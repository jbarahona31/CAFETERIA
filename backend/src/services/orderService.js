const pool = require('../config/database');
const productService = require('./productService');

class OrderService {
  async create(cliente, items) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Calculate total
      let total = 0;
      const detailItems = [];

      for (const item of items) {
        const product = await productService.getById(item.productoId);
        if (!product) {
          throw new Error(`Producto ${item.productoId} no encontrado`);
        }
        
        const subtotal = product.precio * item.cantidad;
        total += subtotal;
        
        detailItems.push({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: product.precio,
          subtotal: subtotal,
          nombre: product.nombre
        });
      }

      // Create order
      const orderResult = await client.query(
        'INSERT INTO pedidos (cliente, estado, total) VALUES ($1, $2, $3) RETURNING id',
        [cliente, 'pendiente', total]
      );
      
      const pedidoId = orderResult.rows[0].id;

      // Create order details
      for (const detail of detailItems) {
        await client.query(
          'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES ($1, $2, $3, $4, $5)',
          [pedidoId, detail.productoId, detail.cantidad, detail.precioUnitario, detail.subtotal]
        );
      }

      // Decrement stock
      await productService.decrementStock(items);

      await client.query('COMMIT');

      return {
        pedidoId,
        cliente,
        items: detailItems,
        total,
        estado: 'pendiente'
      };

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getAll(estado = null) {
    let query = `
      SELECT p.id, p.cliente, p.estado, p.total, p.created_at,
             COALESCE(
               json_agg(
                 json_build_object(
                   'productoId', dp.producto_id,
                   'nombre', pr.nombre,
                   'cantidad', dp.cantidad,
                   'precioUnitario', dp.precio_unitario,
                   'subtotal', dp.subtotal
                 )
               ) FILTER (WHERE dp.id IS NOT NULL),
               '[]'
             ) as items
      FROM pedidos p
      LEFT JOIN detalle_pedido dp ON p.id = dp.pedido_id
      LEFT JOIN productos pr ON dp.producto_id = pr.id
    `;
    
    const params = [];
    if (estado) {
      query += ' WHERE p.estado = $1';
      params.push(estado);
    }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query(
      `SELECT p.id, p.cliente, p.estado, p.total, p.created_at,
              COALESCE(
                json_agg(
                  json_build_object(
                    'productoId', dp.producto_id,
                    'nombre', pr.nombre,
                    'cantidad', dp.cantidad,
                    'precioUnitario', dp.precio_unitario,
                    'subtotal', dp.subtotal
                  )
                ) FILTER (WHERE dp.id IS NOT NULL),
                '[]'
              ) as items
       FROM pedidos p
       LEFT JOIN detalle_pedido dp ON p.id = dp.pedido_id
       LEFT JOIN productos pr ON dp.producto_id = pr.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [id]
    );

    if (result.rows.length === 0) return null;

    return result.rows[0];
  }

  async updateStatus(id, estado) {
    const validStates = ['pendiente', 'preparacion', 'listo', 'entregado', 'cancelado'];
    
    if (!validStates.includes(estado)) {
      throw new Error(`Estado inválido: ${estado}`);
    }

    await pool.query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2',
      [estado, id]
    );

    return this.getById(id);
  }
}

module.exports = new OrderService();
