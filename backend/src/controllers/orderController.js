const orderService = require('../services/orderService');
const productService = require('../services/productService');

const orderController = {
  async create(req, res) {
    try {
      const { cliente, items } = req.body;

      if (!cliente || !items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ 
          error: 'Se requiere cliente e items (array de {productoId, cantidad})' 
        });
      }

      // Validate stock
      const outOfStock = await productService.checkStock(items);
      if (outOfStock.length > 0) {
        return res.status(409).json({
          error: 'Stock insuficiente para algunos productos',
          detalles: outOfStock
        });
      }

      const order = await orderService.create(cliente, items);

      // Emit socket event
      const io = req.app.get('io');
      if (io) {
        io.to('meseros').emit('nuevo_pedido', {
          pedidoId: order.pedidoId,
          cliente: order.cliente,
          items: order.items,
          total: order.total
        });
        console.log(`[Socket] Emitido nuevo_pedido para pedido ${order.pedidoId}`);
      }

      res.status(201).json(order);
    } catch (error) {
      console.error('Error al crear pedido:', error);
      res.status(500).json({ error: 'Error al crear pedido' });
    }
  },

  async getAll(req, res) {
    try {
      const { estado } = req.query;
      const orders = await orderService.getAll(estado);
      res.json(orders);
    } catch (error) {
      console.error('Error al obtener pedidos:', error);
      res.status(500).json({ error: 'Error al obtener pedidos' });
    }
  },

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (!estado) {
        return res.status(400).json({ error: 'Se requiere el estado' });
      }

      const order = await orderService.updateStatus(id, estado);

      if (!order) {
        return res.status(404).json({ error: 'Pedido no encontrado' });
      }

      // Emit socket events
      const io = req.app.get('io');
      if (io) {
        io.to('meseros').emit('pedido_actualizado', {
          pedidoId: order.id,
          estado: order.estado
        });
        console.log(`[Socket] Emitido pedido_actualizado para pedido ${order.id}`);

        // If status is "listo", notify client
        if (estado === 'listo') {
          io.emit('pedido_listo', {
            pedidoId: order.id,
            mensaje: `¡Tu pedido #${order.id} está listo!`
          });
          console.log(`[Socket] Emitido pedido_listo para pedido ${order.id}`);
        }
      }

      res.json(order);
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
      if (error.message.includes('Estado inválido')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Error al actualizar estado del pedido' });
    }
  }
};

module.exports = orderController;
