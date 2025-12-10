const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const productController = require('../controllers/productController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// Rate limiter for product endpoints
const productLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Demasiadas solicitudes. Por favor intente de nuevo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});

// GET /api/productos - Lista productos con stock y promociones
router.get('/', productLimiter, productController.getAll);

// POST /api/productos - Crea nuevo producto (admin only)
router.post('/', productLimiter, authMiddleware, requireRole('admin'), productController.create);

// PUT /api/productos/:id - Actualiza precio, stock, promoción, nombre y descripción (admin only)
router.put('/:id', productLimiter, authMiddleware, requireRole('admin'), productController.update);

// DELETE /api/productos/:id - Elimina un producto (admin only)
router.delete('/:id', productLimiter, authMiddleware, requireRole('admin'), productController.delete);

module.exports = router;
