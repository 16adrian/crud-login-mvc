// models/productModel.js
// MODEL de productos: el ÚNICO archivo que habla con la tabla Products.
// Tiene una función por cada operación del CRUD.

import db from '../database/db.js';

// READ: obtener TODOS los productos (los más nuevos primero)
export function findAll() {
  return db.prepare('SELECT * FROM Products ORDER BY id DESC').all();
}

// READ: obtener UN producto por su id (o "undefined" si no existe)
export function findById(id) {
  return db.prepare('SELECT * FROM Products WHERE id = ?').get(id);
}

// CREATE: guardar un producto nuevo y devolverlo ya guardado
export function create({ name, description, price, stock }) {
  const result = db
    .prepare('INSERT INTO Products (name, description, price, stock) VALUES (?, ?, ?, ?)')
    .run(name, description, price, stock);

  return findById(result.lastInsertRowid);
}

// UPDATE: cambiar un producto existente.
// Devuelve el producto actualizado, o "undefined" si ese id no existe.
export function update(id, { name, description, price, stock }) {
  const result = db
    .prepare(
      `UPDATE Products
       SET name = ?, description = ?, price = ?, stock = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`
    )
    .run(name, description, price, stock, id);

  if (result.changes === 0) return undefined; // No se cambió nada: ese id no existe
  return findById(id);
}

// DELETE: borrar un producto.
// Devuelve true si se borró, o false si ese id no existía.
export function remove(id) {
  const result = db.prepare('DELETE FROM Products WHERE id = ?').run(id);
  return result.changes > 0;
}