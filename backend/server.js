// server.js
// Punto de ARRANQUE del backend. Hace 4 cosas en orden:
//   1) Lee la configuración del archivo .env
//   2) Revisa que la configuración esté completa
//   3) Revisa la base de datos
//   4) Enciende el servidor

import 'dotenv/config';            // 1) Lee .env y guarda sus valores en process.env
import app from './app.js';        // La aplicación Express ya armada
import db from './database/db.js'; // Abre la base de datos (si falla, db.js apaga el programa)

// 2) ¿Está completa la configuración?
if (!process.env.SESSION_SECRET) {
  console.error('❌ Falta SESSION_SECRET en el archivo .env');
  console.error('   Revisa que exista backend/.env (puedes copiar .env.example).');
  process.exit(1);
}

// 3) ¿La base de datos tiene usuarios?
const { total } = db.prepare('SELECT COUNT(*) AS total FROM Users').get();
if (total === 0) {
  console.warn('  No hay usuarios en la base de datos. Ejecuta: npm run db:init');
} else {
  console.log(` Base de datos conectada (${total} usuario(s) registrado(s))`);
}

// 4) Encender el servidor
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(` Servidor encendido en http://localhost:${PORT}`);
  console.log(`   Prueba: http://localhost:${PORT}/api/health`);
});

// Si la puerta ya está ocupada, mostramos un mensaje claro
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ El puerto ${PORT} ya está en uso. ¿Tienes el servidor encendido en otra terminal?`);
  } else {
    console.error('❌ No se pudo encender el servidor:', error.message);
  }
  process.exit(1);
});