// components/Navbar.jsx
// BARRA SUPERIOR: muestra el nombre del usuario y el botón "Cerrar sesión".

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth(); // Leemos la "pizarra"
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logout(); // 1. El backend destruye la sesión
    } finally {
      // 2. Volvemos al Login con un mensaje verde
      navigate('/login', {
        replace: true,
        state: { notice: 'Has cerrado sesión correctamente.' },
      });
    }
  }

  return (
    <header className="navbar">
      <strong>📦 Panel de Productos</strong>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span>
          Hola, <strong>{user?.fullName}</strong>
        </span>
        <button className="btn btn-secondary btn-small" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}