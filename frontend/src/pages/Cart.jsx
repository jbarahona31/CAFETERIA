import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import socketService from '../services/socket';
import useSound from '../hooks/useSound';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotal, submitOrder, lastOrderId } = useCart();
  const [clientName, setClientName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { playOrderReady } = useSound();

  useEffect(() => {
    // Connect to socket for order ready notifications
    socketService.connect();

    socketService.onPedidoListo((data) => {
      if (lastOrderId && data.pedidoId === lastOrderId) {
        playOrderReady();
        toast.success(data.mensaje, {
          duration: 5000,
          icon: '🎉'
        });
      }
    });

    return () => {
      socketService.offPedidoListo();
    };
  }, [lastOrderId, playOrderReady]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('El carrito está vacío');
      return;
    }

    if (!clientName.trim()) {
      toast.error('Por favor, ingresa tu nombre');
      return;
    }

    setSubmitting(true);

    try {
      const order = await submitOrder(clientName.trim());
      
      // Play sound and show notification
      new Audio('/sounds/order-ready.mp3').play().catch(() => {});
      
      toast.success(
        `¡Pedido #${order.pedidoId} enviado! Total: ${formatPrice(order.total)}`,
        {
          duration: 5000,
          icon: '🎉'
        }
      );

      setClientName('');
    } catch (error) {
      console.error('Error al enviar pedido:', error);
      
      if (error.status === 409) {
        toast.error(error.error || 'Stock insuficiente para algunos productos');
        if (error.detalles) {
          error.detalles.forEach(d => {
            toast.error(d.mensaje, { duration: 4000 });
          });
        }
      } else {
        toast.error('Error al enviar el pedido. Por favor, intente de nuevo.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <span className="empty-icon">🛒</span>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos desde el menú para comenzar.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Ver Menú
          </button>
          
          {lastOrderId && (
            <div className="last-order-notice">
              <p>Tu último pedido fue el #{lastOrderId}</p>
              <p>Te notificaremos cuando esté listo.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Tu Carrito</h2>

      <div className="cart-content">
        <div className="cart-items">
          {cart.map(item => (
            <div key={item.id} className="cart-item card fade-in">
              <img 
                src={item.imagen_url || '/img/placeholder.svg'} 
                alt={item.nombre}
                className="cart-item-image"
              />
              
              <div className="cart-item-info">
                <h4>{item.nombre}</h4>
                <p className="cart-item-price">{formatPrice(item.precio)}</p>
              </div>

              <div className="cart-item-quantity">
                <button 
                  className="btn btn-outline quantity-btn"
                  onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                  aria-label="Reducir cantidad"
                >
                  -
                </button>
                <span className="quantity">{item.cantidad}</span>
                <button 
                  className="btn btn-outline quantity-btn"
                  onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                  disabled={item.cantidad >= item.stock}
                  aria-label="Aumentar cantidad"
                >
                  +
                </button>
              </div>

              <div className="cart-item-subtotal">
                <p>{formatPrice(item.precio * item.cantidad)}</p>
              </div>

              <button 
                className="btn remove-btn"
                onClick={() => removeFromCart(item.id)}
                aria-label={`Eliminar ${item.nombre} del carrito`}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary card">
          <h3>Resumen del Pedido</h3>
          
          <div className="summary-items">
            {cart.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.nombre} x{item.cantidad}</span>
                <span>{formatPrice(item.precio * item.cantidad)}</span>
              </div>
            ))}
          </div>

          <div className="summary-total">
            <span>Total:</span>
            <span className="total-amount">{formatPrice(getTotal())}</span>
          </div>

          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-group">
              <label htmlFor="clientName">Tu nombre:</label>
              <input
                type="text"
                id="clientName"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ingresa tu nombre"
                required
                className="form-input"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-secondary checkout-btn"
              disabled={submitting || cart.length === 0}
            >
              {submitting ? 'Enviando...' : '✓ Confirmar Pedido'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Cart;
