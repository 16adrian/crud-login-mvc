// App.jsx
// MAPA DE PÁGINAS: dice qué pantalla mostrar según la URL.

import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import ProductFormPage from './pages/ProductFormPage.jsx';

export default function App() {
  return (
    <Routes>
      {/* 🔓 Página PÚBLICA */}
      <Route path="/login" element={<LoginPage />} />

      {/* 🔒 Páginas PROTEGIDAS: todas pasan primero por el candado */}
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/products" element={<ProductsPage />} />
        <Route path="/admin/products/new" element={<ProductFormPage />} />
        <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
      </Route>

      {/* Cualquier otra URL → al Login (si ya hay sesión, el Login te manda a los productos) */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}