-- database/schema.sql
-- "Plano" de la base de datos: qué tablas existen y qué columnas tienen.
-- IF NOT EXISTS = "créala solo si todavía no existe" (así no se borra nada si se ejecuta otra vez).

-- Tabla de usuarios que pueden iniciar sesión
CREATE TABLE IF NOT EXISTS Users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  username    TEXT    NOT NULL UNIQUE,
  password    TEXT    NOT NULL,
  full_name   TEXT    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de productos sobre la que hacemos el CRUD
CREATE TABLE IF NOT EXISTS Products (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL,
  description TEXT    NOT NULL DEFAULT '',
  price       REAL    NOT NULL CHECK (price >= 0),
  stock       INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  created_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TEXT    NOT NULL DEFAULT CURRENT_TIMESTAMP
);