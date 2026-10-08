// routes/authRoutes.js
// RUTAS de autenticación: el "menú" que dice qué función del Controller atiende cada URL.
// En app.js estas rutas se conectan bajo el prefijo /api/auth, así que:
//   POST /login   → POST /api/auth/login
//   POST /logout  → POST /api/auth/logout
//   GET  /me      → GET  /api/auth/me

import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = Router();

router.post('/login', login);          // Pública: cualquiera puede intentar iniciar sesión
router.post('/logout', logout);        // Pública: cerrar sesión (si no hay sesión, no pasa nada)
router.get('/me', requireAuth, me);    // 🔒 Protegida: primero el guardia, luego el Controller

export default router;