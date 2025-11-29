const pool = require('../config/database');
const productService = require('./productService');

class OrderService {
  async create(cliente, items) {
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();

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
      const [orderResult] = await connection.query(
        'INSERT INTO pedidos (cliente, estado, total) VALUES (?, ?, ?)',
        [cliente, 'pendiente', total]
      );
      
      const pedidoId = orderResult.insertId;

      // Create order details
      for (const detail of detailItems) {
        await connection.query(
          'INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal) VALUES (?, ?, ?, ?, ?)',
          [pedidoId, detail.productoId, detail.cantidad, detail.precioUnitario, detail.subtotal]
        );
      }

      // Decrement stock
      await productService.decrementStock(items);

      await connection.commit();

      return {
        pedidoId,
        cliente,
        items: detailItems,
        total,
        estado: 'pendiente'
      };

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async getAll(estado = null) {
    let query = `
      SELECT p.id, p.cliente, p.estado, p.total, p.created_at,
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'productoId', dp.producto_id,
                 'nombre', pr.nombre,
                 'cantidad', dp.cantidad,
                 'precioUnitario', dp.precio_unitario,
                 'subtotal', dp.subtotal
               )
             ) as items
      FROM pedidos p
      LEFT JOIN detalle_pedido dp ON p.id = dp.pedido_id
      LEFT JOIN productos pr ON dp.producto_id = pr.id
    `;
    
    const params = [];
    if (estado) {
      query += ' WHERE p.estado = ?';
      params.push(estado);
    }

    query += ' GROUP BY p.id ORDER BY p.created_at DESC';

    const [rows] = await pool.query(query, params);
    
    // Parse JSON items
    return rows.map(row => ({
      ...row,
      items: row.items ? JSON.parse(row.items) : []
    }));
  }

  async getById(id) {
    const [rows] = await pool.query(
      `SELECT p.id, p.cliente, p.estado, p.total, p.created_at,
              JSON_ARRAYAGG(
                JSON_OBJECT(
                  'productoId', dp.producto_id,
                  'nombre', pr.nombre,
                  'cantidad', dp.cantidad,
                  'precioUnitario', dp.precio_unitario,
                  'subtotal', dp.subtotal
                )
              ) as items
       FROM pedidos p
       LEFT JOIN detalle_pedido dp ON p.id = dp.pedido_id
       LEFT JOIN productos pr ON dp.producto_id = pr.id
       WHERE p.id = ?
       GROUP BY p.id`,
      [id]
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
      ...row,
      items: row.items ? JSON.parse(row.items) : []
    };
  }

  async updateStatus(id, estado) {
    const validStates = ['pendiente', 'preparacion', 'listo', 'entregado', 'cancelado'];
    
    if (!validStates.includes(estado)) {
      throw new Error(`Estado inválido: ${estado}`);
    }

    await pool.query(
      'UPDATE pedidos SET estado = ? WHERE id = ?',
      [estado, id]
    );

    return this.getById(id);
  }
}

module.exports = new OrderService();
