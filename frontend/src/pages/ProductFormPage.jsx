// pages/ProductFormPage.jsx
// FORMULARIO DE PRODUCTO: sirve para CREAR (vacío) y para EDITAR (lleno).
//   /admin/products/new       → CREATE
//   /admin/products/:id/edit  → UPDATE

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { productsApi } from '../services/api.js';

const EMPTY_FORM = { name: '', description: '', price: '', stock: '' };

// Validaciones en pantalla (el backend vuelve a validar por seguridad)
function validate(form) {
  const errors = {};

  if (!form.name.trim()) errors.name = 'El nombre es obligatorio.';

  const priceText = String(form.price).trim();
  if (priceText === '') errors.price = 'El precio es obligatorio.';
  else if (!Number.isFinite(Number(priceText))) errors.price = 'El precio debe ser un número.';
  else if (Number(priceText) < 0) errors.price = 'El precio no puede ser negativo.';

  const stockText = String(form.stock).trim();
  if (stockText !== '') {
    const stock = Number(stockText);
    if (!Number.isInteger(stock)) errors.stock = 'El stock debe ser un número entero.';
    else if (stock < 0) errors.stock = 'El stock no puede ser negativo.';
  }

  return errors;
}

// Estilo del mensaje rojo debajo de cada casilla
const fieldErrorStyle = { color: '#b91c1c', fontSize: 13 };

export default function ProductFormPage() {
  const { id } = useParams();   // Si la URL es /admin/products/5/edit → id = "5"
  const isEdit = Boolean(id);   // ¿Estamos editando? (si hay id, sí)
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);   // Lo que está escrito en las casillas
  const [fieldErrors, setFieldErrors] = useState({}); // Errores de cada casilla
  const [error, setError] = useState('');          // Error general (caja roja)
  const [loading, setLoading] = useState(isEdit);  // Cargando el producto a editar
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);     // Guardando...

  // Si estamos EDITANDO: pedimos el producto al backend y llenamos el formulario
  useEffect(() => {
    if (!isEdit) return;
    productsApi
      .get(id)
      .then(({ product }) =>
        setForm({
          name: product.name,
          description: product.description,
          price: String(product.price),
          stock: String(product.stock),
        })
      )
      .catch((err) => {
        setError(err.message); // Ej: "No existe un producto con el id 999."
        setLoadFailed(true);
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  // Cada vez que se escribe en una casilla, actualizamos ese campo
  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  // Al presionar "Guardar"
  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    // 1. Validamos en pantalla
    const errors = validate(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return; // Hay errores: no enviamos nada

    // 2. Enviamos al backend: CREATE o UPDATE según el caso
    setSaving(true);
    try {
      const data = isEdit
        ? await productsApi.update(id, form) // PUT  /api/products/5
        : await productsApi.create(form);    // POST /api/products

      // 3. Volvemos a la lista con el mensaje verde
      navigate('/admin/products', { state: { message: data.message } });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="container">
        <div className="card card-wide" style={{ margin: '0 auto' }}>
          <h1>{isEdit ? 'Editar producto' : 'Nuevo producto'}</h1>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <p className="empty">Cargando producto...</p>
          ) : loadFailed ? (
            <Link to="/admin/products" className="btn btn-secondary">
              ← Volver a la lista
            </Link>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="name">Nombre *</label>
                <input id="name" name="name" type="text" value={form.name} onChange={handleChange} />
                {fieldErrors.name && <small style={fieldErrorStyle}>{fieldErrors.name}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Precio *</label>
                <input
                  id="price"
                  name="price"
                  type="text"
                  inputMode="decimal"
                  placeholder="Ej: 45000"
                  value={form.price}
                  onChange={handleChange}
                />
                {fieldErrors.price && <small style={fieldErrorStyle}>{fieldErrors.price}</small>}
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock</label>
                <input
                  id="stock"
                  name="stock"
                  type="text"
                  inputMode="numeric"
                  placeholder="Ej: 10 (si lo dejas vacío, será 0)"
                  value={form.stock}
                  onChange={handleChange}
                />
                {fieldErrors.stock && <small style={fieldErrorStyle}>{fieldErrors.stock}</small>}
              </div>

              <div className="form-actions">
                <Link to="/admin/products" className="btn btn-secondary">
                  Cancelar
                </Link>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </>
  );
}