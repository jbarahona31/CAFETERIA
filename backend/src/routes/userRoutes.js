const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const userController = require('../controllers/userController');

// Rate limiter for login endpoint to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: { error: 'Demasiados intentos de login. Por favor intente de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

// POST /api/usuarios/login - Login de usuario (rate limited)
router.post('/login', loginLimiter, userController.login);

// GET /api/usuarios - Lista todos los usuarios
router.get('/', userController.getAll);

// GET /api/usuarios/:id - Obtiene un usuario por ID
router.get('/:id', userController.getById);

// POST /api/usuarios - Crea un nuevo usuario
router.post('/', userController.create);

// PUT /api/usuarios/:id - Actualiza un usuario
router.put('/:id', userController.update);

// DELETE /api/usuarios/:id - Elimina un usuario
router.delete('/:id', userController.delete);

module.exports = router;
