const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registrar usuario
exports.register = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body;

    // Validate required fields
    if (!nombre?.trim() || !correo?.trim() || !contraseña?.trim()) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo, rol, created_at',
      [nombre, correo, hashedPassword, rol || 'cliente']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[DB Error]', err);
    if (err.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
    res.status(500).json({ error: 'Error registrando usuario' });
  }
};

// Login usuario
exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body;

    // Validate required fields
    if (!correo?.trim() || !contraseña?.trim()) {
      return res.status(400).json({ error: 'Correo y contraseña son obligatorios' });
    }

    const result = await pool.query('SELECT id, nombre, correo, contraseña, rol, created_at FROM usuarios WHERE correo = $1', [correo]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const validPassword = await bcrypt.compare(contraseña, user.contraseña);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      process.env.JWT_SECRET || 'default-secret-key-change-in-production',
      { expiresIn: process.env.TOKEN_EXPIRATION || '1d' }
    );

    // Don't send password hash back to client
    const { contraseña: _password, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('[DB Error]', err);
    res.status(500).json({ error: 'Error en login' });
  }
};

// Obtener todos los usuarios
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, correo, rol, created_at FROM usuarios');
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
    const result = await pool.query('SELECT id, nombre, correo, rol, created_at FROM usuarios WHERE id = $1', [id]);

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
    const { nombre, correo, contraseña, rol } = req.body;
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, correo, rol, created_at',
      [nombre, correo, hashedPassword, rol || 'cliente']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('[DB Error]', err);
    if (err.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
    res.status(500).json({ error: 'Error creando usuario' });
  }
};

// Actualizar usuario
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo, contraseña, rol } = req.body;

    let hashedPassword = null;
    if (contraseña) {
      hashedPassword = await bcrypt.hash(contraseña, 10);
    }

    const result = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, correo = $2, contraseña = COALESCE($3, contraseña), rol = $4 
       WHERE id = $5 RETURNING id, nombre, correo, rol, created_at`,
      [nombre, correo, hashedPassword, rol, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('[DB Error]', err);
    if (err.code === '23505') { // Unique violation
      return res.status(409).json({ error: 'El correo ya está registrado' });
    }
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
