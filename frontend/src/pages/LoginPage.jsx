// pages/LoginPage.jsx
// PANTALLA DE LOGIN: formulario con usuario, contraseña y botón "Iniciar sesión".

import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function LoginPage() {
  const { user, checking, login } = useAuth(); // Leemos la "pizarra"
  const navigate = useNavigate();              // Herramienta para cambiar de página
  const location = useLocation();

  // ¿A dónde quería ir la persona? (lo anotó el candado). Si no hay, a los productos.
  const from = location.state?.from || '/admin/products';
  // Mensajes que pueden venir de otras pantallas:
  const reason = location.state?.reason; // 🔒 "Necesitas iniciar sesión..." (del candado)
  const notice = location.state?.notice; // ✅ "Has cerrado sesión..." (del botón Cerrar sesión)

  // Lo que la persona escribe en el formulario
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Mensaje de error (vacío = no hay error)
  const [error, setError] = useState('');
  // ¿Estamos esperando la respuesta del backend?
  const [loading, setLoading] = useState(false);

  // Mientras preguntamos al backend si ya hay sesión, mostramos "Cargando..."
  if (checking) return <p className="empty">Cargando...</p>;

  // Si ya hay sesión, no tiene sentido ver el Login: vamos a donde quería ir
  if (user) return <Navigate to={from} replace />;

  // Esto se ejecuta al presionar "Iniciar sesión"
  async function handleSubmit(event) {
    event.preventDefault(); // Evita que el navegador recargue la página
    setError('');

    // Validación rápida en pantalla
    if (!username.trim() || !password) {
      setError('Escribe tu usuario y tu contraseña.');
      return;
    }

    setLoading(true);
    try {
      await login(username.trim(), password); // Le pedimos al backend que verifique
      navigate(from, { replace: true });      // ¡Correcto! Vamos a la página que quería
    } catch (err) {
      setError(err.message); // Ej: "Usuario o contraseña incorrectos."
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-center">
      <div className="card">
        <h1>Iniciar sesión</h1>
        <p className="subtitle">Ingresa para administrar los productos</p>

        {/* Mensajes: verde (cerraste sesión), rojo 🔒 (página protegida), rojo (error de login) */}
        {notice && !error && <div className="alert alert-success">{notice}</div>}
        {reason && !error && <div className="alert alert-error">🔒 {reason}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  );
}