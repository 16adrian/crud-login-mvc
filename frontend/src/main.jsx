// main.jsx
// Punto de ARRANQUE de React: aquí se "enciende" la aplicación.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* BrowserRouter: permite tener varias páginas con URLs distintas (/login, /admin/products...) */}
    <BrowserRouter>
      {/* AuthProvider: pone la "pizarra" de sesión disponible para toda la aplicación */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);