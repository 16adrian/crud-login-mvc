// controllers/productController.js
// CONTROLLER de productos: el "jefe de cocina" del CRUD.
// 1) Revisa que los datos que llegan tengan sentido (validaciones).
// 2) Le pide al Model que guarde, busque, cambie o borre.
// 3) Responde con un mensaje claro de éxito o de error.

import { findAll, findById, create, update, remove } from '../models/productModel.js';

// ---------- AYUDANTE 1: revisar el id que viene en la URL ----------
// Ejemplo: en /api/products/5, el id es "5". Debe ser un número entero mayor que 0.
function parseId(text) {
  const id = Number(text);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// ---------- AYUDANTE 2: revisar los datos del formulario ----------
// Devuelve la lista de errores encontrados y los datos ya "limpios".
function validateProduct(body) {
  const name = typeof body?.name === 'string' ? body.name.trim() : '';
  const description = typeof body?.description === 'string' ? body.description.trim() : '';
  const priceText = String(body?.price ?? '').trim();
  const stockText = String(body?.stock ?? '').trim();

  const errors = [];

  // Nombre: obligatorio
  if (!name) errors.push('El nombre es obligatorio.');
  else if (name.length > 100) errors.push('El nombre no puede tener más de 100 caracteres.');

  // Precio: obligatorio, número y no negativo
  const price = Number(priceText);
  if (priceText === '') errors.push('El precio es obligatorio.');
  else if (!Number.isFinite(price)) errors.push('El precio debe ser un número.');
  else if (price < 0) errors.push('El precio no puede ser negativo.');

  // Stock: opcional (si viene vacío vale 0), número entero y no negativo
  const stock = stockText === '' ? 0 : Number(stockText);
  if (!Number.isInteger(stock)) errors.push('El stock debe ser un número entero.');
  else if (stock < 0) errors.push('El stock no puede ser negativo.');

  return { errors, data: { name, description, price, stock } };
}

// ---------- READ: GET /api/products ----------
export function listProducts(req, res) {
  const products = findAll();
  res.json({ products });
}

// ---------- READ: GET /api/products/:id ----------
export function getProduct(req, res) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'El id del producto no es válido.' });
  }

  const product = findById(id);
  if (!product) {
    return res.status(404).json({ message: `No existe un producto con el id ${id}.` });
  }

  res.json({ product });
}

// ---------- CREATE: POST /api/products ----------
export function createProduct(req, res) {
  const { errors, data } = validateProduct(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' '), errors });
  }

  try {
    const product = create(data);
    res.status(201).json({ message: 'Producto creado correctamente.', product });
  } catch (error) {
    console.error('❌ Error al crear el producto:', error);
    res.status(500).json({ message: 'No se pudo crear el producto. Intenta de nuevo.' });
  }
}

// ---------- UPDATE: PUT /api/products/:id ----------
export function updateProduct(req, res) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'El id del producto no es válido.' });
  }

  const { errors, data } = validateProduct(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(' '), errors });
  }

  try {
    const product = update(id, data);
    if (!product) {
      return res.status(404).json({ message: `No existe un producto con el id ${id}.` });
    }
    res.json({ message: 'Producto actualizado correctamente.', product });
  } catch (error) {
    console.error('❌ Error al actualizar el producto:', error);
    res.status(500).json({ message: 'No se pudo actualizar el producto. Intenta de nuevo.' });
  }
}

// ---------- DELETE: DELETE /api/products/:id ----------
export function deleteProduct(req, res) {
  const id = parseId(req.params.id);
  if (!id) {
    return res.status(400).json({ message: 'El id del producto no es válido.' });
  }

  try {
    const deleted = remove(id);
    if (!deleted) {
      return res.status(404).json({ message: `No existe un producto con el id ${id}.` });
    }
    res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) {
    console.error('❌ Error al eliminar el producto:', error);
    res.status(500).json({ message: 'No se pudo eliminar el producto. Intenta de nuevo.' });
  }
}