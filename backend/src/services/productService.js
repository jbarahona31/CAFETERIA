const pool = require('../config/database');

class ProductService {
  async getAll() {
    const [rows] = await pool.query(
      'SELECT id, nombre, categoria, descripcion, precio, stock, promocion, imagen_url FROM productos ORDER BY categoria, nombre'
    );
    return rows;
  }

  async getById(id) {
    const [rows] = await pool.query(
      'SELECT id, nombre, categoria, descripcion, precio, stock, promocion, imagen_url FROM productos WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }

  async update(id, data) {
    const { nombre, descripcion, precio, stock, promocion, imagen_url } = data;
    
    const fields = [];
    const values = [];

    if (nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(nombre);
    }
    if (descripcion !== undefined) {
      fields.push('descripcion = ?');
      values.push(descripcion);
    }
    if (precio !== undefined) {
      fields.push('precio = ?');
      values.push(precio);
    }
    if (stock !== undefined) {
      fields.push('stock = ?');
      values.push(stock);
    }
    if (promocion !== undefined) {
      fields.push('promocion = ?');
      values.push(promocion);
    }
    if (imagen_url !== undefined) {
      fields.push('imagen_url = ?');
      values.push(imagen_url);
    }

    if (fields.length === 0) {
      return null;
    }

    values.push(id);
    await pool.query(
      `UPDATE productos SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    return this.getById(id);
  }

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

  async decrementStock(items) {
    for (const item of items) {
      await pool.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ?',
        [item.cantidad, item.productoId]
      );
    }
  }
}

module.exports = new ProductService();
