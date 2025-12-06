const pool = require('../config/database');

// Crear pedido
exports.create = async (req, res) => {
  try {
    const { cliente, productos } = req.body;
    const result = await pool.query(
      'INSERT INTO pedidos (cliente, productos, estado) VALUES ($1, $2, $3) RETURNING *',
      [cliente, JSON.stringify(productos), 'pendiente']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error creando pedido' });
  }
};

// Listar pedidos
exports.getAll = async (req, res) => {
  try {
    const { estado } = req.query;
    let result;
    if (estado) {
      result = await pool.query('SELECT * FROM pedidos WHERE estado = $1', [estado]);
    } else {
      result = await pool.query('SELECT * FROM pedidos');
    }
    res.json(result.rows);
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error obteniendo pedidos' });
  }
};

// Cambiar estado
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    const result = await pool.query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error actualizando estado del pedido' });
  }
};
