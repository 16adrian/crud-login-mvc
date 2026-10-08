// middlewares/requireAuth.js
// EL GUARDIA DE LA PUERTA.
// Se coloca ANTES de cualquier ruta protegida.
// Revisa si la petición trae una sesión válida:
//   - Si la trae    → next(): "puedes pasar".
//   - Si no la trae → responde 401 y la petición NO llega al Controller.

export function requireAuth(req, res, next) {
  if (req.session?.user) {
    return next(); //  Tiene sesión: pasa al siguiente (el Controller)
  }

  // NO tiene sesión: aquí se detiene todo
  res.status(401).json({
    message: 'Alto ahi bandido, necesitas iniciar sesión para acceder a este recurso.',
  });
}