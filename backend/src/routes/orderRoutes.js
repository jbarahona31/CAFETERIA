const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/pedidos - Crea pedido
router.post('/', orderController.create);

// GET /api/pedidos - Lista pedidos con filtro por estado opcional
router.get('/', orderController.getAll);

// PUT /api/pedidos/:id/estado - Cambia estado
router.put('/:id/estado', orderController.updateStatus);

module.exports = router;
