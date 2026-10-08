// pages/ProductsPage.jsx
// PANTALLA DE PRODUCTOS: muestra la tabla (READ) y permite eliminar (DELETE).
// Los botones "Nuevo" y "Editar" llevan al formulario (Bloque 5).

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { productsApi } from '../services/api.js';

// Muestra el precio como dinero: 45000 → $ 45.000
const money = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export default function ProductsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]); // La lista de productos
  const [loading, setLoading] = useState(true); // ¿Estamos cargando?
  const [error, setError] = useState('');       // Mensaje rojo
  // Mensaje verde. Puede venir del formulario, ej: "Producto creado correctamente."
  const [success, setSuccess] = useState(location.state?.message ?? '');

  // ---------- READ: pedir la lista al backend ----------
  async function loadProducts() {
    setLoading(true);
    setError('');
    try {
      const data = await productsApi.list();
      setProducts(data.products);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Al aparecer la pantalla: cargamos los productos
  useEffect(() => {
    loadProducts();
    // Si llegamos con un mensaje verde, lo borramos de la URL para que no se repita al recargar
    if (location.state?.message) {
      navigate(location.pathname, { replace: true });
    }
  }, []);

  // ---------- DELETE: eliminar un producto ----------
  async function handleDelete(product) {
    const confirmed = window.confirm(`¿Seguro que quieres eliminar "${product.name}"?`);
    if (!confirmed) return;

    setError('');
    setSuccess('');
    try {
      const data = await productsApi.remove(product.id);
      // Lo quitamos de la lista en pantalla
      setProducts((current) => current.filter((p) => p.id !== product.id));
      setSuccess(data.message); // "Producto eliminado correctamente."
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="page-header">
          <h1>Productos</h1>
          <Link to="/admin/products/new" className="btn btn-primary">
            + Nuevo producto
          </Link>
        </div>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="table-wrapper">
          {loading ? (
            <p className="empty">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="empty">Aún no hay productos. ¡Crea el primero!</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description || '—'}</td>
                    <td>{money.format(product.price)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <div className="actions">
                        <Link
                          to={`/admin/products/${product.id}/edit`}
                          className="btn btn-secondary btn-small"
                        >
                          Editar
                        </Link>
                        <button
                          className="btn btn-danger btn-small"
                          onClick={() => handleDelete(product)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}