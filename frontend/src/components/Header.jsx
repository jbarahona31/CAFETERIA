import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Header.css';

function Header() {
  const location = useLocation();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <img src="/logo.svg" alt="El Sabor Colombiano Logo" className="logo-img" />
          <div className="logo-text">
            <h1>El Sabor Colombiano</h1>
            <span className="tagline">El auténtico sabor de nuestra tierra</span>
          </div>
        </Link>

        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Menú
          </Link>
          <Link 
            to="/carrito" 
            className={`nav-link cart-link ${location.pathname === '/carrito' ? 'active' : ''}`}
          >
            🛒 Carrito
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount}</span>
            )}
          </Link>
          <Link 
            to="/mesero" 
            className={`nav-link btn btn-secondary ${location.pathname === '/mesero' ? 'active' : ''}`}
          >
            👨‍🍳 Panel Mesero
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
