const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  // Products
  async getProducts() {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error('Error al obtener productos');
    return response.json();
  },

  async updateProduct(id, data) {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar producto');
    return response.json();
  },

  // Orders
  async createOrder(cliente, items) {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cliente, items })
    });
    
    if (response.status === 409) {
      const error = await response.json();
      throw { status: 409, ...error };
    }
    
    if (!response.ok) throw new Error('Error al crear pedido');
    return response.json();
  },

  async getOrders(estado = null) {
    const url = estado 
      ? `${API_URL}/pedidos?estado=${estado}` 
      : `${API_URL}/pedidos`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al obtener pedidos');
    return response.json();
  },

  async updateOrderStatus(id, estado) {
    const response = await fetch(`${API_URL}/pedidos/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    });
    if (!response.ok) throw new Error('Error al actualizar estado del pedido');
    return response.json();
  }
};

export default api;
