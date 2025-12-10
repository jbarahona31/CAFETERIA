const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

// Fail fast si JWT_SECRET no está definido en producción
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('JWT_SECRET environment variable is required in production');
}

class UserService {
  // Obtener todos los usuarios
  async getAll() {
    const result = await pool.query(
      'SELECT id, nombre, correo, rol, created_at FROM usuarios ORDER BY created_at DESC'
    );
    return result.rows;
  }

  // Obtener usuario por ID
  async getById(id) {
    const result = await pool.query(
      'SELECT id, nombre, correo, rol, created_at FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  // Obtener usuario por email
  async getByEmail(email) {
    const result = await pool.query(
      'SELECT id, nombre, correo, contraseña, rol, created_at FROM usuarios WHERE correo = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  // Crear usuario nuevo
  async create(data) {
    const { nombre, email, contrasena, rol = 'mesero' } = data;

    // Validar si el correo ya existe
    const existing = await this.getByEmail(email);
    if (existing) {
      const error = new Error('El correo electrónico ya está registrado');
      error.code = 'EMAIL_EXISTS';
      throw error;
    }

    // Hashear contraseña
    const contrasena_hash = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, correo, contraseña, rol) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, nombre, correo, rol, created_at`,
      [nombre, email, contrasena_hash, rol]
    );

    return result.rows[0];
  }

  // Actualizar usuario
  async update(id, data) {
    const { nombre, email, contrasena, rol } = data;
    
    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (nombre !== undefined) {
      fields.push(`nombre = $${paramIndex++}`);
      values.push(nombre);
    }
    if (email !== undefined) {
      // Validar si el correo ya está en uso por otro usuario
      const existing = await this.getByEmail(email);
      if (existing && existing.id !== parseInt(id, 10)) {
        const error = new Error('El correo electrónico ya está en uso por otro usuario');
        error.code = 'EMAIL_IN_USE';
        throw error;
      }
      fields.push(`correo = $${paramIndex++}`);
      values.push(email);
    }
    if (contrasena !== undefined) {
      const contrasena_hash = await bcrypt.hash(contrasena, SALT_ROUNDS);
      fields.push(`contraseña = $${paramIndex++}`);
      values.push(contrasena_hash);
    }
    if (rol !== undefined) {
      fields.push(`rol = $${paramIndex++}`);
      values.push(rol);
    }

    if (fields.length === 0) {
      return null; // No hay campos para actualizar
    }

    values.push(id);
    await pool.query(
      `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    return this.getById(id);
  }

  // Eliminar usuario
  async delete(id) {
    const user = await this.getById(id);
    if (!user) {
      return null;
    }

    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    return user;
  }

  // Verificar contraseña y generar JWT
  async verifyPassword(email, contrasena) {
    const user = await this.getByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(contrasena, user.contraseña);
    if (!isValid) {
      return null;
    }

    // Excluir hash de la respuesta
    const { contraseña, ...userWithoutPassword } = user;
    
    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, rol: user.rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { usuario: userWithoutPassword, token };
  }
}

module.exports = new UserService();
