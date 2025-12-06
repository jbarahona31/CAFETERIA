const pool = require('../config/database');

class ProductService {
  // Obtener todos los productos
  async getAll() {
    const result = await pool.query(
      `SELECT id, nombre, categoria, descripcion, precio, stock, promocion, imagen_url 
       FROM productos 
       ORDER BY categoria, nombre`
    );
    return result.rows;
  }

  // Obtener producto por ID
  async getById(id) {
    const result = await pool.query(
      `SELECT id, nombre, categoria, descripcion, precio, stock, promocion, imagen_url 
       FROM productos 
       WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  // Actualizar producto dinámicamente
  async update(id, data) {
    const { nombre, descripcion, precio, stock, promocion, imagen_url } = data;
    
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (nombre !== undefined) {
      fields.push(`nombre = $${paramIndex++}`);
      values.push(nombre);
    }
    if (descripcion !== undefined) {
      fields.push(`descripcion = $${paramIndex++}`);
      values.push(descripcion);
    }
    if (precio !== undefined) {
      fields.push(`precio = $${paramIndex++}`);
      values.push(precio);
    }
    if (stock !== undefined) {
      fields.push(`stock = $${paramIndex++}`);
      values.push(stock);
    }
    if (promocion !== undefined) {
      fields.push(`promocion = $${paramIndex++}`);
      values.push(promocion);
    }
    if (imagen_url !== undefined) {
      fields.push(`imagen_url = $${paramIndex++}`);
      values.push(imagen_url);
    }

    if (fields.length === 0) {
      return null; // No hay campos para actualizar
    }

    values.push(id);
    await pool.query(
      `UPDATE productos SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    return this.getById(id);
  }

  // Verificar stock de varios productos
  async checkStock(items) {
    const outOfStock = [];
    
    for (const item of items) {
      const product = await this.getById(item.productoId);
      if (!product) {
        outOfStock.push({ productoId: item.productoId, mensaje: 'Producto no encontrado' });
      } else if (product.stock < item.cantidad) {
        outOfStock.push({ 
          productoId: item.productoId, 
          nombre: product.nombre,
          stockDisponible: product.stock,
          cantidadSolicitada: item.cantidad,
          mensaje: `Stock insuficiente para ${product.nombre}`
        });
      }
    }

    return outOfStock;
  }

  // Decrementar stock después de un pedido
  async decrementStock(items) {
    for (const item of items) {
      await pool.query(
        'UPDATE productos SET stock = stock - $1 WHERE id = $2',
        [item.cantidad, item.productoId]
      );
    }
  }
}

module.exports = new ProductService();
