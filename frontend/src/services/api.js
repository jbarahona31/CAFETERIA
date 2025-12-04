const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const api = {
  // Auth
  async register(nombre, email, contrasena) {
    const response = await fetch(`${API_URL}/usuarios/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, email, contrasena })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw { status: response.status, ...error };
    }
    return response.json();
  },

  async login(email, contrasena) {
    const response = await fetch(`${API_URL}/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, contrasena })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw { status: response.status, ...error };
    }
    return response.json();
  },

  // Products
  async getProducts() {
    const response = await fetch(`${API_URL}/productos`);
    if (!response.ok) throw new Error('Error al obtener productos');
    return response.json();
  },

  async updateProduct(id, data) {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar producto');
    return response.json();
  },

  // Orders
  async createOrder(cliente, items) {
    const response = await fetch(`${API_URL}/pedidos`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
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
    const response = await fetch(url, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener pedidos');
    return response.json();
  },

  async updateOrderStatus(id, estado) {
    const response = await fetch(`${API_URL}/pedidos/${id}/estado`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ estado })
    });
    if (!response.ok) throw new Error('Error al actualizar estado del pedido');
    return response.json();
  },

  // Users (admin only)
  async getUsers() {
    const response = await fetch(`${API_URL}/usuarios`, {
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return response.json();
  },

  async createUser(data) {
    const response = await fetch(`${API_URL}/usuarios`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw { status: response.status, ...error };
    }
    return response.json();
  },

  async updateUser(id, data) {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw { status: response.status, ...error };
    }
    return response.json();
  },

  async deleteUser(id) {
    const response = await fetch(`${API_URL}/usuarios/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!response.ok) throw new Error('Error al eliminar usuario');
    return response.json();
  }
};

export default api;
