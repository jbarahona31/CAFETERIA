import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api';
import socketService from '../services/socket';
import useSound from '../hooks/useSound';
import './WaiterPanel.css';

const STATUS_LABELS = {
  pendiente: '⏳ Pendiente',
  preparacion: '👨‍🍳 En Preparación',
  listo: '✅ Listo',
  entregado: '📦 Entregado',
  cancelado: '❌ Cancelado'
};

const STATUS_FLOW = ['pendiente', 'preparacion', 'listo', 'entregado'];

function WaiterPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { playNewOrder, playOrderReady } = useSound();

  useEffect(() => {
    loadOrders();
    
    // Connect to socket and join meseros room
    socketService.connect();
    socketService.joinMeseros();

    // Listen for new orders
    socketService.onNuevoPedido((data) => {
      console.log('[Socket] Nuevo pedido recibido:', data);
      playNewOrder();
      toast.success(`¡Nuevo pedido #${data.pedidoId} de ${data.cliente}!`, {
        duration: 5000,
        icon: '🔔'
      });
      loadOrders();
    });

    // Listen for order updates
    socketService.onPedidoActualizado((data) => {
      console.log('[Socket] Pedido actualizado:', data);
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === data.pedidoId 
            ? { ...order, estado: data.estado }
            : order
        )
      );
    });

    return () => {
      socketService.offNuevoPedido();
      socketService.offPedidoActualizado();
    };
  }, [playNewOrder]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      
      if (newStatus === 'listo') {
        playOrderReady();
        toast.success('¡Pedido marcado como listo! El cliente ha sido notificado.', {
          duration: 3000,
          icon: '✅'
        });
      } else {
        toast.success(`Estado actualizado a "${STATUS_LABELS[newStatus]}"`, {
          duration: 2000
        });
      }

      loadOrders();
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      toast.error('Error al actualizar estado del pedido');
    }
  };

  const getNextStatus = (currentStatus) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    if (currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1) {
      return null;
    }
    return STATUS_FLOW[currentIndex + 1];
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.estado === filter);

  if (loading) {
    return (
      <div className="waiter-panel">
        <div className="panel-loading">
          <div className="loading-spinner"></div>
          <p>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="waiter-panel">
      <div className="panel-header">
        <h2>👨‍🍳 Panel de Mesero</h2>
        <button onClick={loadOrders} className="btn btn-outline refresh-btn">
          🔄 Actualizar
        </button>
      </div>

      <div className="panel-filters">
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setFilter('all')}
        >
          Todos ({orders.length})
        </button>
        {Object.entries(STATUS_LABELS).map(([status, label]) => {
          const count = orders.filter(o => o.estado === status).length;
          return (
            <button
              key={status}
              className={`btn ${filter === status ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter(status)}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <p>No hay pedidos para mostrar.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map(order => {
            const nextStatus = getNextStatus(order.estado);
            
            return (
              <div key={order.id} className={`order-card card fade-in status-${order.estado}`}>
                <div className="order-header">
                  <span className="order-id">Pedido #{order.id}</span>
                  <span className={`badge status-${order.estado}`}>
                    {STATUS_LABELS[order.estado]}
                  </span>
                </div>

                <div className="order-info">
                  <p className="order-client">
                    <strong>👤 Cliente:</strong> {order.cliente}
                  </p>
                  <p className="order-time">
                    <strong>🕐 Hora:</strong> {formatDate(order.created_at)}
                  </p>
                </div>

                <div className="order-items">
                  <h4>Productos:</h4>
                  <ul>
                    {order.items && order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.cantidad}x {item.nombre} - {formatPrice(item.subtotal)}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="order-total">
                  <strong>Total:</strong> {formatPrice(order.total)}
                </div>

                <div className="order-actions">
                  {nextStatus && (
                    <button
                      className="btn btn-accent action-btn"
                      onClick={() => handleStatusChange(order.id, nextStatus)}
                    >
                      Marcar como: {STATUS_LABELS[nextStatus]}
                    </button>
                  )}
                  
                  {order.estado !== 'cancelado' && order.estado !== 'entregado' && (
                    <button
                      className="btn btn-outline cancel-btn"
                      onClick={() => handleStatusChange(order.id, 'cancelado')}
                    >
                      ❌ Cancelar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WaiterPanel;
