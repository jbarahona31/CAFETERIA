const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/productos - Lista productos con stock y promociones
router.get('/', productController.getAll);

// PUT /api/productos/:id - Actualiza precio, stock, promoción, nombre y descripción
router.put('/:id', productController.update);

module.exports = router;
