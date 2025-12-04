const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// Rate limiter for login endpoint to prevent brute force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login attempts per windowMs
  message: { error: 'Demasiados intentos de login. Por favor intente de nuevo en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter for register endpoint
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 registration attempts per hour
  message: { error: 'Demasiados intentos de registro. Por favor intente de nuevo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes
// POST /api/usuarios/register - Registrar nuevo usuario
router.post('/register', registerLimiter, userController.register);

// POST /api/usuarios/login - Login de usuario (rate limited)
router.post('/login', loginLimiter, userController.login);

// Protected routes - require authentication
// GET /api/usuarios - Lista todos los usuarios (admin only)
router.get('/', authMiddleware, requireRole('admin'), userController.getAll);

// GET /api/usuarios/:id - Obtiene un usuario por ID
router.get('/:id', authMiddleware, userController.getById);

// POST /api/usuarios - Crea un nuevo usuario (admin only)
router.post('/', authMiddleware, requireRole('admin'), userController.create);

// PUT /api/usuarios/:id - Actualiza un usuario (admin only)
router.put('/:id', authMiddleware, requireRole('admin'), userController.update);

// DELETE /api/usuarios/:id - Elimina un usuario (admin only)
router.delete('/:id', authMiddleware, requireRole('admin'), userController.delete);

module.exports = router;
