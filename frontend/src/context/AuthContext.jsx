// context/AuthContext.jsx
// LA PIZARRA DE LA CASA: guarda quién inició sesión y lo comparte con TODAS las pantallas.
// Cualquier componente puede preguntar: "¿quién está conectado?" usando useAuth().

import { createContext, useContext, useEffect, useState } from 'react';
import { authApi, setUnauthorizedHandler } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);         // Quién inició sesión (null = nadie)
  const [checking, setChecking] = useState(true); // ¿Todavía estamos preguntando al backend?

  // Al abrir la aplicación (o recargar la página), le preguntamos al backend:
  // "¿Esta cookie tiene una sesión válida? ¿Quién soy?"
  useEffect(() => {
    // Si algún pedido responde 401, borramos al usuario de la pizarra
    setUnauthorizedHandler(() => setUser(null));

    authApi
      .me()
      .then((data) => setUser(data.user))  // Sí hay sesión: anotamos al usuario
      .catch(() => setUser(null))          // No hay sesión: pizarra vacía
      .finally(() => setChecking(false));  // Ya terminamos de preguntar
  }, []);

  // Iniciar sesión: le pedimos al backend que verifique, y si todo sale bien, anotamos al usuario
  async function login(username, password) {
    const data = await authApi.login(username, password);
    setUser(data.user);
    return data;
  }

  // Cerrar sesión: le pedimos al backend que destruya la sesión y borramos la pizarra
  async function logout() {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, checking, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Atajo para leer la pizarra desde cualquier pantalla
export function useAuth() {
  return useContext(AuthContext);
}