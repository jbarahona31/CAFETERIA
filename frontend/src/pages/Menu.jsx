import { useState, useEffect } from 'react';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import './Menu.css';

function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showPromoOnly, setShowPromoOnly] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los productos. Por favor, intente más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    if (filter !== 'all' && product.categoria !== filter) return false;
    if (showPromoOnly && !product.promocion) return false;
    return true;
  });

  const comidas = filteredProducts.filter(p => p.categoria === 'comida');
  const bebidas = filteredProducts.filter(p => p.categoria === 'bebida');

  if (loading) {
    return (
      <div className="menu-loading">
        <div className="loading-spinner"></div>
        <p>Cargando menú...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-error">
        <p>{error}</p>
        <button onClick={loadProducts} className="btn btn-primary">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <div className="menu-header">
        <h2>Nuestro Menú</h2>
        <div className="menu-filters">
          <div className="filter-buttons">
            <button
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('all')}
            >
              Todos
            </button>
            <button
              className={`btn ${filter === 'comida' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('comida')}
            >
              🍽️ Comidas
            </button>
            <button
              className={`btn ${filter === 'bebida' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setFilter('bebida')}
            >
              🥤 Bebidas
            </button>
          </div>
          <button
            className={`btn ${showPromoOnly ? 'btn-secondary' : 'btn-outline'}`}
            onClick={() => setShowPromoOnly(!showPromoOnly)}
          >
            🔥 Solo Promociones
          </button>
        </div>
      </div>

      {filter === 'all' || filter === 'comida' ? (
        comidas.length > 0 && (
          <section className="menu-section">
            <h3 className="section-title">🍽️ Comidas</h3>
            <div className="products-grid">
              {comidas.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )
      ) : null}

      {filter === 'all' || filter === 'bebida' ? (
        bebidas.length > 0 && (
          <section className="menu-section">
            <h3 className="section-title">🥤 Bebidas</h3>
            <div className="products-grid">
              {bebidas.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )
      ) : null}

      {filteredProducts.length === 0 && (
        <div className="no-products">
          <p>No hay productos que coincidan con los filtros seleccionados.</p>
        </div>
      )}
    </div>
  );
}

export default Menu;
