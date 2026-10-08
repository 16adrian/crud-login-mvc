// database/init.js
// Se ejecuta con:  npm run db:init
// Hace 3 cosas:
//   1) Crea las tablas (eso ocurre automáticamente al importar db.js)
//   2) Crea el usuario administrador de prueba, con su contraseña en MD5
//   3) Crea algunos productos de ejemplo

import db from './db.js';
import { md5 } from '../utils/md5.js';

// ---------- 1. Usuario administrador de prueba ----------
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // Contraseña en texto normal: SOLO existe aquí, nunca en la base de datos
const ADMIN_FULL_NAME = 'Administrador';

// ¿Ya existe un usuario con ese nombre?
const existingUser = db
  .prepare('SELECT id FROM Users WHERE username = ?')
  .get(ADMIN_USERNAME);

if (existingUser) {
  console.log(`El usuario "${ADMIN_USERNAME}" ya existe. No se creó de nuevo.`);
} else {
  const passwordHash = md5(ADMIN_PASSWORD); // AQUÍ se aplica el MD5

  db.prepare('INSERT INTO Users (username, password, full_name) VALUES (?, ?, ?)')
    .run(ADMIN_USERNAME, passwordHash, ADMIN_FULL_NAME);

  console.log(`   Usuario creado: ${ADMIN_USERNAME}`);
  console.log(`   Contraseña escrita:  ${ADMIN_PASSWORD}`);
  console.log(`   Guardada como MD5:   ${passwordHash}`);
}

// ---------- 2. Productos de ejemplo ----------
const { total } = db.prepare('SELECT COUNT(*) AS total FROM Products').get();

if (total > 0) {
  console.log(`ℹYa hay ${total} producto(s). No se agregaron ejemplos.`);
} else {
  const insertProduct = db.prepare(
    'INSERT INTO Products (name, description, price, stock) VALUES (?, ?, ?, ?)'
  );

  insertProduct.run('Mouse inalámbrico', 'Mouse óptico con conexión USB', 45000, 15);
  insertProduct.run('Teclado mecánico', 'Teclado con luces y switches azules', 180000, 8);
  insertProduct.run('Audífonos', 'Audífonos con micrófono para clases virtuales', 95000, 20);

  console.log('Se crearon 3 productos de ejemplo.');
}

db.close(); // Cerramos la conexión porque el script ya terminó
console.log('Base de datos lista.');