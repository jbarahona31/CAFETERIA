import { useCart } from '../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart, cart } = useCart();
  
  const isOutOfStock = product.stock === 0;
  const cartItem = cart.find(item => item.id === product.id);
  const inCartQuantity = cartItem ? cartItem.cantidad : 0;
  const availableStock = product.stock - inCartQuantity;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!isOutOfStock && availableStock > 0) {
      addToCart(product, 1);
    }
  };

  return (
    <article className="product-card card fade-in">
      <div className="product-image-container">
        <img 
          src={product.imagen_url || '/img/placeholder.jpg'} 
          alt={`${product.nombre} - ${product.categoria}`}
          className="product-image"
          loading="lazy"
        />
        {product.promocion && (
          <span className="badge badge-promo promo-tag pulse">🔥 Promoción</span>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.nombre}</h3>
        <p className="product-description">{product.descripcion}</p>
        
        <div className="product-meta">
          <span className="product-price">{formatPrice(product.precio)}</span>
          
          {isOutOfStock ? (
            <span className="badge badge-out-of-stock">Agotado</span>
          ) : (
            <span className="badge badge-available">
              Disponible: {product.stock}
            </span>
          )}
        </div>

        <button 
          className={`btn btn-primary add-to-cart-btn ${isOutOfStock || availableStock <= 0 ? 'disabled' : ''}`}
          onClick={handleAddToCart}
          disabled={isOutOfStock || availableStock <= 0}
          aria-label={`Agregar ${product.nombre} al carrito`}
        >
          {isOutOfStock ? 'Agotado' : availableStock <= 0 ? 'Máximo en carrito' : '+ Agregar al carrito'}
        </button>

        {inCartQuantity > 0 && (
          <p className="in-cart-notice">
            🛒 {inCartQuantity} en carrito
          </p>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
