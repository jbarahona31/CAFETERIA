const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/usuarios/login - Login de usuario
router.post('/login', userController.login);

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
