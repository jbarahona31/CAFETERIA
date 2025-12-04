import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getItemCount } = useCart();
  const { user, isAuthenticated, hasRole, hasAnyRole, logout } = useAuth();
  const itemCount = getItemCount();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
          
          {isAuthenticated() && hasAnyRole('admin', 'mesero') && (
            <Link 
              to="/mesero" 
              className={`nav-link ${location.pathname === '/mesero' ? 'active' : ''}`}
            >
              👨‍🍳 Pedidos
            </Link>
          )}
          
          {isAuthenticated() && hasRole('admin') && (
            <Link 
              to="/admin" 
              className={`nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              ⚙️ Admin
            </Link>
          )}

          {isAuthenticated() ? (
            <div className="user-menu">
              <span className="user-name">👤 {user?.nombre}</span>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Salir
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className={`nav-link btn btn-secondary ${location.pathname === '/login' ? 'active' : ''}`}
            >
              🔐 Ingresar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
