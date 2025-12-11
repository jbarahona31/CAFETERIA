/**
 * Rutas de productos
 * - GET /api/productos: lista productos disponibles (público, con rate limit)
 * - POST /api/productos: crea producto (solo admin)
 * - PUT /api/productos/:id: actualiza producto (solo admin)
 * - DELETE /api/productos/:id: elimina producto (solo admin)
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// Rate limiter solo para la ruta pública de productos
const productLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 solicitudes por IP en ese periodo
  message: { error: 'Demasiadas solicitudes. Por favor intente de nuevo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});

// GET /api/productos - Lista productos con stock y promociones (público)
router.get('/', productLimiter, productController.getAll);

// POST /api/productos - Crea nuevo producto (admin only)
router.post('/', authMiddleware, requireRole('admin'), productController.create);

// PUT /api/productos/:id - Actualiza producto (admin only)
router.put('/:id', authMiddleware, requireRole('admin'), productController.update);

// DELETE /api/productos/:id - Elimina producto (admin only)
router.delete('/:id', authMiddleware, requireRole('admin'), productController.delete);

module.exports = router;
