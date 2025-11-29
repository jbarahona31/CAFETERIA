const productService = require('../services/productService');

const productController = {
  async getAll(req, res) {
    try {
      const products = await productService.getAll();
      res.json(products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ error: 'Error al obtener productos' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await productService.update(id, req.body);
      
      if (!updated) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      res.json(updated);
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      res.status(500).json({ error: 'Error al actualizar producto' });
    }
  }
};

module.exports = productController;
