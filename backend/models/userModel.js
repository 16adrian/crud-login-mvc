// models/userModel.js
// MODEL de usuarios: el ÚNICO archivo que habla con la tabla Users.
// Recuerda: el Model es "el encargado de la despensa". Solo busca y guarda datos;
// no decide si el login es correcto (eso lo decide el Controller).

import db from '../database/db.js';

// Busca un usuario por su nombre de usuario.
// Devuelve el usuario (incluido su hash MD5) o "undefined" si no existe.
export function findByUsername(username) {
  return db
    .prepare('SELECT id, username, password, full_name FROM Users WHERE username = ?')
    .get(username);
}