const express = require('express');
const router = express.Router();
const salesController = require('../controllers/salesController');

// GET /api/ventas/diarias - Obtiene el reporte de ventas diarias
router.get('/diarias', salesController.getDailySales);

module.exports = router;
