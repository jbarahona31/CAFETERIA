const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// GET /api/productos - Lista productos con stock y promociones
router.get('/', productController.getAll);

// POST /api/productos - Crea nuevo producto
router.post('/', productController.create);

// PUT /api/productos/:id - Actualiza precio, stock, promoción, nombre y descripción
router.put('/:id', productController.update);

// DELETE /api/productos/:id - Elimina un producto
router.delete('/:id', productController.delete);

module.exports = router;
