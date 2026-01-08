/**
 * EJEMPLO DE INTEGRACIÓN: ProductCard con Visualización 3D
 * 
 * Este archivo muestra cómo integrar el componente Model3D en ProductCard
 * para que los productos puedan mostrar opcionalmente una vista 3D.
 * 
 * CÓMO USAR ESTE EJEMPLO:
 * 1. Copia el código que necesites de este archivo
 * 2. Intégralo en tu ProductCard.jsx existente
 * 3. Agrega el campo model3d_url a tu base de datos (opcional)
 * 
 * NO reemplaces tu ProductCard actual a menos que estés listo para usar modelos 3D.
 */

import { useState, Suspense } from 'react';
import { useCart } from '../context/CartContext';
import Model3D from './Model3D';
import './ProductCard.css';

// OPCIÓN 1: ProductCard con Toggle 3D/Imagen
function ProductCardWith3DToggle({ product }) {
  const { addToCart, cart } = useCart();
  const [show3D, setShow3D] = useState(false);
  
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

  // Determinar si el producto tiene modelo 3D disponible
  const has3DModel = product.model3d_url && product.model3d_url.length > 0;

  return (
    <article className="product-card card fade-in">
      <div className="product-image-container">
        {/* Toggle entre vista 3D e imagen */}
        {show3D && has3DModel ? (
          <Suspense fallback={
            <div className="loading-3d-small">
              <div className="spinner-small"></div>
              <p>Cargando 3D...</p>
            </div>
          }>
            <div className="model-3d-wrapper">
              <Model3D modelPath={product.model3d_url} />
            </div>
          </Suspense>
        ) : (
          <img 
            src={product.imagen_url || '/img/placeholder.svg'} 
            alt={`${product.nombre} - ${product.categoria}`}
            className="product-image"
            loading="lazy"
          />
        )}
        
        {/* Botón para alternar vista 3D */}
        {has3DModel && (
          <button 
            className="toggle-3d-btn"
            onClick={() => setShow3D(!show3D)}
            aria-label={show3D ? 'Ver imagen 2D' : 'Ver modelo 3D'}
          >
            {show3D ? '📷 Ver Foto' : '🎨 Ver en 3D'}
          </button>
        )}
        
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

// OPCIÓN 2: ProductCard que siempre muestra 3D si está disponible
function ProductCardWith3DDefault({ product }) {
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

  const has3DModel = product.model3d_url && product.model3d_url.length > 0;

  return (
    <article className="product-card card fade-in">
      <div className="product-image-container">
        {/* Muestra 3D por defecto si está disponible, sino imagen */}
        {has3DModel ? (
          <Suspense fallback={
            <img 
              src={product.imagen_url || '/img/placeholder.svg'} 
              alt={`${product.nombre} - ${product.categoria}`}
              className="product-image"
            />
          }>
            <Model3D modelPath={product.model3d_url} />
          </Suspense>
        ) : (
          <img 
            src={product.imagen_url || '/img/placeholder.svg'} 
            alt={`${product.nombre} - ${product.categoria}`}
            className="product-image"
            loading="lazy"
          />
        )}
        
        {product.promocion && (
          <span className="badge badge-promo promo-tag pulse">🔥 Promoción</span>
        )}
        
        {has3DModel && (
          <span className="badge-3d">Vista 3D 🎨</span>
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

// OPCIÓN 3: Componente simple solo para visualización 3D (sin funcionalidad de carrito)
function Product3DViewer({ product }) {
  const has3DModel = product.model3d_url && product.model3d_url.length > 0;

  return (
    <div className="product-3d-viewer">
      {has3DModel ? (
        <Suspense fallback={
          <div className="loading-3d">
            <div className="spinner"></div>
            <p>Cargando modelo 3D...</p>
          </div>
        }>
          <Model3D modelPath={product.model3d_url} />
        </Suspense>
      ) : (
        <div className="no-3d-model">
          <p>No hay modelo 3D disponible para este producto</p>
          <img 
            src={product.imagen_url || '/img/placeholder.svg'} 
            alt={product.nombre}
          />
        </div>
      )}
    </div>
  );
}

// CSS adicional necesario para las nuevas características
const additionalCSS = `
/* Agregar a ProductCard.css */

.toggle-3d-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255, 255, 255, 0.95);
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  z-index: 10;
}

.toggle-3d-btn:hover {
  background: white;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.model-3d-wrapper {
  width: 100%;
  height: 250px;
  border-radius: 8px;
  overflow: hidden;
}

.loading-3d-small {
  width: 100%;
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}

.spinner-small {
  width: 30px;
  height: 30px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color, #d4a574);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.badge-3d {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.product-3d-viewer {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.loading-3d {
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  border-radius: 12px;
}

.no-3d-model {
  text-align: center;
  padding: 2rem;
  background: #f5f5f5;
  border-radius: 12px;
}

.no-3d-model img {
  max-width: 300px;
  margin-top: 1rem;
  border-radius: 8px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// INSTRUCCIONES DE USO
const usageInstructions = `
CÓMO INTEGRAR EN TU PROYECTO:
================================

1. AGREGAR CAMPO A LA BASE DE DATOS (Opcional):
   
   ALTER TABLE productos 
   ADD COLUMN model3d_url VARCHAR(255) DEFAULT NULL;
   
   UPDATE productos 
   SET model3d_url = '/models/uniformes/camiseta.glb' 
   WHERE nombre = 'Camiseta Colombia';

2. ELEGIR UNA OPCIÓN:
   
   - ProductCardWith3DToggle: Botón para alternar entre imagen y 3D
   - ProductCardWith3DDefault: Muestra 3D automáticamente si está disponible
   - Product3DViewer: Solo visualizador 3D (sin carrito)

3. REEMPLAZAR TU PRODUCTCARD ACTUAL:
   
   // En ProductCard.jsx
   export default ProductCardWith3DToggle;
   // O la opción que prefieras

4. AGREGAR CSS:
   
   Copia el CSS adicional al final de ProductCard.css

5. PROBAR:
   
   Asegúrate de tener un archivo .glb en la ubicación correcta
   y actualiza la base de datos con la ruta del modelo.

EJEMPLO DE DATOS DE PRUEBA:
============================

{
  "id": 1,
  "nombre": "Camiseta Colombia",
  "descripcion": "Camiseta oficial de la selección",
  "precio": 80000,
  "imagen_url": "/img/camiseta-colombia.jpg",
  "model3d_url": "/models/uniformes/camiseta-colombia.glb",
  "categoria": "comida",
  "stock": 10,
  "promocion": false
}
`;

// Exportar las opciones
export {
  ProductCardWith3DToggle,
  ProductCardWith3DDefault,
  Product3DViewer,
  additionalCSS,
  usageInstructions
};

// Por defecto, exportar la versión con toggle
export default ProductCardWith3DToggle;
