// app.js
// Aquí se ARMA la aplicación Express: se colocan los middlewares y las rutas EN ORDEN.
// Piensa en una línea de montaje: cada petición pasa por estos puestos de arriba hacia abajo.

import express from 'express';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();

// ---------- 1. MIDDLEWARES GENERALES ----------
// Traductor: permite entender los datos JSON que enviará React
app.use(express.json());

// Sesiones: el "cuaderno del guardarropa" y las "fichas" (cookies)
app.use(
  session({
    name: 'sid',                          // Nombre de la cookie (session id)
    secret: process.env.SESSION_SECRET,   // Frase secreta del .env para "sellar" la cookie
    resave: false,                        // No volver a guardar la sesión si no cambió
    saveUninitialized: false,             // No crear fichas a quien no ha iniciado sesión
    cookie: {
      httpOnly: true,                     // El JavaScript de la página NO puede leer la cookie
      sameSite: 'lax',                    // Otras páginas web no pueden usar tu cookie para hacer cambios
      maxAge: 1000 * 60 * 60 * 2,         // La sesión dura 2 horas (en milisegundos)
    },
  })
);

// ---------- 2. RUTAS ----------
// Ruta de prueba: sirve para comprobar que el backend responde
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'El backend está funcionando',
    time: new Date().toISOString(),
  });
});

// Rutas de autenticación: /api/auth/login, /api/auth/logout, /api/auth/me
app.use('/api/auth', authRoutes);

// Rutas del CRUD (todas protegidas por el guardia): /api/products
app.use('/api/products', productRoutes);

// ---------- 3. MANEJO DE ERRORES (SIEMPRE AL FINAL) ----------
app.use(notFound);     // Si ninguna ruta respondió → 404
app.use(errorHandler); // Si algo se rompió → 500 con mensaje claro

export default app;