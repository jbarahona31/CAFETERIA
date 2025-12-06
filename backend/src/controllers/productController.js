const pool = require('../config/database');

// Obtener todos los productos
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM productos');
    res.json(result.rows);
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error obteniendo productos' });
  }
};

// Actualizar producto
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock, promocion } = req.body;

    const result = await pool.query(
      `UPDATE productos 
       SET nombre = $1, descripcion = $2, precio = $3, stock = $4, promocion = $5 
       WHERE id = $6 RETURNING *`,
      [nombre, descripcion, precio, stock, promocion, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error actualizando producto' });
  }
};
