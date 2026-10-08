// middlewares/errorHandler.js
// Dos middlewares que van AL FINAL de app.js:
//   1) notFound:     responde cuando alguien pide una ruta que no existe (404)
//   2) errorHandler: atrapa cualquier error inesperado y responde un mensaje claro (500)

// 1) Ruta no encontrada
export function notFound(req, res) {
  res.status(404).json({
    message: `La ruta ${req.method} ${req.originalUrl} no existe.`,
  });
}

// 2) Manejador general de errores
// IMPORTANTE: Express reconoce que es un manejador de errores porque recibe 4 parámetros.
// Aunque no usemos "next", debe estar escrito.
export function errorHandler(err, req, res, next) {
  // Caso especial: llegaron datos con formato JSON roto
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Los datos enviados no tienen un formato válido.',
    });
  }

  // Cualquier otro error: lo mostramos completo en la terminal (para nosotros)...
  console.error('❌ Error inesperado:', err);

  // ...pero al usuario solo le damos un mensaje sencillo (sin detalles internos)
  res.status(500).json({
    message: 'Ocurrió un error inesperado en el servidor. Intenta de nuevo.',
  });
}