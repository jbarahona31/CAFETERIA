import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import './Login.css';

function Register() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [rol, setRol] = useState('mesero');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre || !email || !contrasena || !confirmarContrasena) {
      toast.error('Por favor complete todos los campos');
      return;
    }

    if (contrasena !== confirmarContrasena) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (contrasena.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await api.register(nombre, email, contrasena, rol);
      
      toast.success('¡Registro exitoso! Ahora puedes iniciar sesión');
      navigate('/login');
    } catch (error) {
      console.error('Error en registro:', error);
      toast.error(error.error || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <div className="login-header">
          <h2>📝 Crear Cuenta</h2>
          <p>Regístrate para hacer pedidos</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              disabled={loading}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarContrasena">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmarContrasena"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              placeholder="Repite tu contraseña"
              disabled={loading}
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="rol">Tipo de usuario</label>
            <select
              id="rol"
              value={rol}
              onChange={(e) => setRol(e.target.value)}
              disabled={loading}
              className="form-select"
            >
              <option value="mesero">👨‍🍳 Mesero</option>
              <option value="admin">👑 Administrador</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-login"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="login-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
