const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const salesController = require('../controllers/salesController');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// Rate limiter for sales endpoints
const salesLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Demasiadas solicitudes. Por favor intente de nuevo más tarde.' },
  standardHeaders: true,
  legacyHeaders: false
});

// GET /api/ventas/diarias - Obtiene el reporte de ventas diarias (admin only)
router.get('/diarias', salesLimiter, authMiddleware, requireRole('admin'), salesController.getDailySales);

module.exports = router;
