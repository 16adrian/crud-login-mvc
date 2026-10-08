// controllers/authController.js
// CONTROLLER de autenticación: decide QUÉ HACER con cada pedido de login, logout y "¿quién soy?".
// Usa el Model (userModel) para buscar datos y la función md5 para comparar contraseñas.

import { findByUsername } from '../models/userModel.js';
import { md5 } from '../utils/md5.js';

// Mensaje igual para "usuario no existe" y "contraseña incorrecta".
// Así un intruso no puede averiguar qué usuarios existen.
const INVALID_CREDENTIALS = 'Usuario o contraseña incorrectos.';

// ---------- POST /api/auth/login ----------
export function login(req, res, next) {
  // 1. Leer lo que envió el formulario (y asegurarnos de que sea texto)
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  // 2. Validar que no vengan vacíos
  if (!username || !password) {
    return res.status(400).json({ message: 'Escribe tu usuario y tu contraseña porfa.' });
  }

  // 3. Pedirle al Model que busque el usuario
  const user = findByUsername(username);

  if (!user) {
    console.log(`🔴 Login fallido: el usuario "${username}" no existe`);
    return res.status(401).json({ message: INVALID_CREDENTIALS });
  }

  // 4. Convertir la contraseña escrita a MD5 y compararla con la guardada
  const passwordHash = md5(password); //  AQUÍ se aplica MD5 durante el login
  if (passwordHash !== user.password) {
    console.log(`🔴 Login fallido: contraseña incorrecta para "${username}"`);
    return res.status(401).json({ message: INVALID_CREDENTIALS });
  }

  // 5. Datos correctos Creamos una sesión NUEVA (ficha nueva del guardarropa)
  req.session.regenerate((error) => {
    if (error) return next(error); // Si algo falla, lo atrapa el errorHandler

    // Anotamos en el "cuaderno" quién es (¡nunca la contraseña!)
    req.session.user = {
      id: user.id,
      username: user.username,
      fullName: user.full_name,
    };

    console.log(`🟢 Login correcto: "${user.username}"`);
    res.json({
      message: `¡Bienvenido, ${user.full_name}!`,
      user: req.session.user,
    });
  });
}

// ---------- POST /api/auth/logout ----------
export function logout(req, res, next) {
  // Arrancamos la página del cuaderno: esta ficha ya no vale
  req.session.destroy((error) => {
    if (error) return next(error);

    res.clearCookie('sid'); // Le pedimos al navegador que bote la cookie
    res.json({ message: 'Sesión cerrada correctamente.' });
  });
}

// ---------- GET /api/auth/me ----------
// "¿Quién soy?": React lo usará para saber si hay una sesión activa.
// Solo llega aquí si el guardia (requireAuth) dejó pasar la petición.
export function me(req, res) {
  res.json({ user: req.session.user });
}