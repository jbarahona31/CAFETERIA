import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import WaiterPanel from './pages/WaiterPanel';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

// Protected route component
function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, hasAnyRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasAnyRole(...allowedRoles)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppContent() {
  return (
    <Router>
      <div className="app">
        <Header />
        <main className="main-content container">
          <Routes>
            <Route path="/" element={<Menu />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route 
              path="/mesero" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'mesero']}>
                  <WaiterPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <p>© 2024 El Sabor Colombiano - El auténtico sabor de nuestra tierra</p>
          </div>
        </footer>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#4A2C2A',
            color: '#fff',
            borderRadius: '8px',
          },
          success: {
            iconTheme: {
              primary: '#8BC34A',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#DC3545',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
