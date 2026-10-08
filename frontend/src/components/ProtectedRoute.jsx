// components/ProtectedRoute.jsx
// CANDADO DE REACT: protege las páginas del administrador.
// - Mientras se pregunta al backend si hay sesión → muestra "Verificando sesión..."
// - Si NO hay sesión → manda al Login con un mensaje
// - Si SÍ hay sesión → deja ver la página (Outlet)

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute() {
  const { user, checking } = useAuth(); // Leemos la "pizarra"
  const location = useLocation();       // La URL que la persona intentó abrir

  // 1. Todavía estamos preguntando al backend "¿esta cookie tiene sesión?"
  if (checking) {
    return <p className="empty">Verificando sesión...</p>;
  }

  // 2. No hay sesión → al Login, recordando a dónde quería ir
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          reason: 'Necesitas iniciar sesión para acceder a esa página.',
        }}
      />
    );
  }

  // 3. Sí hay sesión → mostramos la página pedida
  return <Outlet />;
}