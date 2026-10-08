// database/db.js
// Abre (o crea) el archivo de la base de datos y se asegura de que existan las tablas.
// Todos los demás archivos que necesiten la base de datos importarán "db" desde aquí.

import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';

// Ruta del archivo de la base de datos: quedará en backend/database/database.sqlite
const DB_FILE = path.join(import.meta.dirname, 'database.sqlite');
// Ruta del "plano" con las tablas
const SCHEMA_FILE = path.join(import.meta.dirname, 'schema.sql');

let db;

try {
  // 1. Abrir la base de datos (si el archivo no existe, SQLite lo crea vacío)
  db = new Database(DB_FILE);

  // 2. Leer schema.sql y ejecutarlo para crear las tablas si no existen
  const schema = fs.readFileSync(SCHEMA_FILE, 'utf8');
  db.exec(schema);
} catch (error) {
  // Manejo de error: si algo falla aquí, no tiene sentido seguir
  console.error('❌ Error al conectarse a la base de datos:', error.message);
  process.exit(1); // Apaga el programa
}

export default db;