const userService = require('../services/userService');

const userController = {
  async getAll(req, res) {
    try {
      const users = await userService.getAll();
      res.json(users);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener usuarios' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  },

  async create(req, res) {
    try {
      const { nombre, email, contrasena, rol } = req.body;

      if (!nombre || !email || !contrasena) {
        return res.status(400).json({ 
          error: 'Se requiere nombre, email y contrasena' 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido' });
      }

      // Validate password length
      if (contrasena.length < 6) {
        return res.status(400).json({ 
          error: 'La contraseña debe tener al menos 6 caracteres' 
        });
      }

      // Validate role if provided
      const validRoles = ['admin', 'mesero', 'cocina'];
      if (rol && !validRoles.includes(rol)) {
        return res.status(400).json({ 
          error: `Rol inválido. Roles válidos: ${validRoles.join(', ')}` 
        });
      }

      const user = await userService.create({ nombre, email, contrasena, rol });
      res.status(201).json(user);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      if (error.message.includes('ya está registrado')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al crear usuario' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nombre, email, contrasena, rol } = req.body;

      // Validate email format if provided
      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ error: 'Formato de email inválido' });
        }
      }

      // Validate password length if provided
      if (contrasena && contrasena.length < 6) {
        return res.status(400).json({ 
          error: 'La contraseña debe tener al menos 6 caracteres' 
        });
      }

      // Validate role if provided
      const validRoles = ['admin', 'mesero', 'cocina'];
      if (rol && !validRoles.includes(rol)) {
        return res.status(400).json({ 
          error: `Rol inválido. Roles válidos: ${validRoles.join(', ')}` 
        });
      }

      const user = await userService.update(id, { nombre, email, contrasena, rol });
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json(user);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      if (error.message.includes('ya está en uso')) {
        return res.status(409).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al actualizar usuario' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const user = await userService.delete(id);
      
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      res.json({ mensaje: 'Usuario eliminado', usuario: user });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      res.status(500).json({ error: 'Error al eliminar usuario' });
    }
  },

  async login(req, res) {
    try {
      const { email, contrasena } = req.body;

      if (!email || !contrasena) {
        return res.status(400).json({ 
          error: 'Se requiere email y contrasena' 
        });
      }

      const user = await userService.verifyPassword(email, contrasena);
      
      if (!user) {
        return res.status(401).json({ error: 'Credenciales inválidas' });
      }

      res.json({ mensaje: 'Login exitoso', usuario: user });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({ error: 'Error en login' });
    }
  }
};

module.exports = userController;
