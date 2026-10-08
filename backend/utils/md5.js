// utils/md5.js
// AQUÍ, y solo aquí, se convierte una contraseña en MD5.
// Se usa en dos momentos:
//   1) Al CREAR un usuario (para guardar la contraseña ya convertida).
//   2) Al hacer LOGIN (para convertir lo que escribió la persona y compararlo).

import crypto from 'node:crypto';

export function md5(text) {
  return crypto.createHash('md5').update(text).digest('hex');
}