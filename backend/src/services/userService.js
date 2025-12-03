const pool = require('../config/database');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

class UserService {
  async getAll() {
    const result = await pool.query(
      'SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async getById(id) {
    const result = await pool.query(
      'SELECT id, nombre, email, rol, created_at FROM usuarios WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  async getByEmail(email) {
    const result = await pool.query(
      'SELECT id, nombre, email, contrasena_hash, rol, created_at FROM usuarios WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  async create(data) {
    const { nombre, email, contrasena, rol = 'mesero' } = data;

    // Check if email already exists
    const existing = await this.getByEmail(email);
    if (existing) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Hash the password
    const contrasena_hash = await bcrypt.hash(contrasena, SALT_ROUNDS);

    const result = await pool.query(
      'INSERT INTO usuarios (nombre, email, contrasena_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol, created_at',
      [nombre, email, contrasena_hash, rol]
    );

    return result.rows[0];
  }

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
      // Check if email is already taken by another user
      const existing = await this.getByEmail(email);
      if (existing && existing.id !== parseInt(id)) {
        throw new Error('El correo electrónico ya está en uso por otro usuario');
      }
      fields.push(`email = $${paramIndex++}`);
      values.push(email);
    }
    if (contrasena !== undefined) {
      const contrasena_hash = await bcrypt.hash(contrasena, SALT_ROUNDS);
      fields.push(`contrasena_hash = $${paramIndex++}`);
      values.push(contrasena_hash);
    }
    if (rol !== undefined) {
      fields.push(`rol = $${paramIndex++}`);
      values.push(rol);
    }

    if (fields.length === 0) {
      return null;
    }

    values.push(id);
    await pool.query(
      `UPDATE usuarios SET ${fields.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    return this.getById(id);
  }

  async delete(id) {
    const user = await this.getById(id);
    if (!user) {
      return null;
    }

    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    return user;
  }

  async verifyPassword(email, contrasena) {
    const user = await this.getByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(contrasena, user.contrasena_hash);
    if (!isValid) {
      return null;
    }

    // Return user without password hash
    const { contrasena_hash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}

module.exports = new UserService();
