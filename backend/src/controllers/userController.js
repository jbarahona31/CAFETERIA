const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, hashedPassword, rol || 'cliente']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
};

// Login usuario
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error en login' });
  }
};

// Obtener todos los usuarios
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, email, rol FROM usuarios');
    res.json(result.rows);
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
};

// Obtener usuario por ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT id, nombre, email, rol FROM usuarios WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error obteniendo usuario' });
  }
};

// Crear usuario (admin)
exports.create = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, hashedPassword, rol || 'cliente']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error creando usuario' });
  }
};

// Actualizar usuario
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, email, password, rol } = req.body;

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, email = $2, password = COALESCE($3, password), rol = $4 
       WHERE id = $5 RETURNING *`,
      [nombre, email, hashedPassword, rol, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error actualizando usuario' });
  }
};

// Eliminar usuario
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error eliminando usuario' });
  }
};
