const pool = require('../config/database');

// Obtener todos los productos
exports.getAll = async (req, res) => {
  try {
    console.log('[ProductController] Fetching all products...');
    const result = await pool.query('SELECT * FROM productos ORDER BY categoria, nombre');
    console.log(`[ProductController] Found ${result.rows.length} products`);
    res.json(result.rows);
  } catch (err) {
    console.error('[ProductController] Error fetching products:', err);
    res.status(500).json({ error: 'Error obteniendo productos', details: err.message });
  }
};

// Obtener producto por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM productos WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error obteniendo producto' });
  }
};

// Crear nuevo producto
exports.create = async (req, res) => {
  try {
    const { nombre, categoria, descripcion, precio, stock, promocion } = req.body;

    if (!nombre || !categoria || !descripcion || precio == null || stock == null || promocion == null) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const result = await pool.query(
      `INSERT INTO productos (nombre, categoria, descripcion, precio, stock, promocion)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [nombre, categoria, descripcion, precio, stock, promocion]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error creando producto' });
  }
};

// Actualizar producto
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, categoria, descripcion, precio, stock, promocion } = req.body;

    const result = await pool.query(
      `UPDATE productos 
       SET nombre = $1, categoria = $2, descripcion = $3, precio = $4, stock = $5, promocion = $6 
       WHERE id = $7 RETURNING *`,
      [nombre, categoria, descripcion, precio, stock, promocion, id]
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

// Eliminar producto
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM productos WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error eliminando producto' });
  }
};
