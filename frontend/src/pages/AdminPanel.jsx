import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import './AdminPanel.css';

function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('productos');
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'productos') {
        const data = await api.getProducts();
        setProducts(data);
      } else if (activeTab === 'usuarios') {
        const data = await api.getUsers();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProduct = async (id, field, value) => {
    try {
      await api.updateProduct(id, { [field]: value });
      toast.success('Producto actualizado');
      loadData();
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      toast.error('Error al actualizar producto');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      await api.deleteUser(id);
      toast.success('Usuario eliminado');
      loadData();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      toast.error('Error al eliminar usuario');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const getRoleBadge = (rol) => {
    const badges = {
      admin: { class: 'badge-admin', label: '👑 Admin' },
      mesero: { class: 'badge-mesero', label: '👨‍🍳 Mesero' },
      cocina: { class: 'badge-cocina', label: '🍳 Cocina' },
      cliente: { class: 'badge-cliente', label: '👤 Cliente' }
    };
    return badges[rol] || { class: '', label: rol };
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="panel-loading">
          <div className="loading-spinner"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="panel-header">
        <h2>⚙️ Panel de Administración</h2>
        <p>Bienvenido, {user?.nombre}</p>
      </div>

      <div className="admin-tabs">
        <button
          className={`tab-btn ${activeTab === 'productos' ? 'active' : ''}`}
          onClick={() => setActiveTab('productos')}
        >
          📦 Productos
        </button>
        <button
          className={`tab-btn ${activeTab === 'usuarios' ? 'active' : ''}`}
          onClick={() => setActiveTab('usuarios')}
        >
          👥 Usuarios
        </button>
      </div>

      {activeTab === 'productos' && (
        <div className="admin-section">
          <div className="section-header">
            <h3>Gestión de Productos ({products.length})</h3>
            <button onClick={loadData} className="btn btn-outline">
              🔄 Actualizar
            </button>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Promoción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.nombre}</td>
                    <td>
                      <span className={`badge badge-${product.categoria}`}>
                        {product.categoria}
                      </span>
                    </td>
                    <td>{formatPrice(product.precio)}</td>
                    <td>
                      <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => handleUpdateProduct(product.id, 'stock', parseInt(e.target.value, 10))}
                        className="stock-input"
                        min="0"
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={product.promocion}
                        onChange={(e) => handleUpdateProduct(product.id, 'promocion', e.target.checked)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => setEditingProduct(product)}
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'usuarios' && (
        <div className="admin-section">
          <div className="section-header">
            <h3>Gestión de Usuarios ({users.length})</h3>
            <button onClick={loadData} className="btn btn-outline">
              🔄 Actualizar
            </button>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Creado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => {
                  const roleBadge = getRoleBadge(u.rol);
                  return (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.nombre}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${roleBadge.class}`}>
                          {roleBadge.label}
                        </span>
                      </td>
                      <td>{formatDate(u.created_at)}</td>
                      <td>
                        {u.id !== user?.id && (
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDeleteUser(u.id)}
                          >
                            🗑️
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
