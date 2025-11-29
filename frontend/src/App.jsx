import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import WaiterPanel from './pages/WaiterPanel';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content container">
            <Routes>
              <Route path="/" element={<Menu />} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/mesero" element={<WaiterPanel />} />
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
    </CartProvider>
  );
}

export default App;
