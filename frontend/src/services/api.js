// services/api.js
// EL CARTERO: todas las peticiones de React al backend pasan por aquí.
// Así, si algo cambia, solo se modifica este archivo.

// Un tipo de error que además guarda el código HTTP (400, 401, 404, 500...)
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

// Qué hacer cuando el backend responde 401 ("no has iniciado sesión").
// AuthContext pondrá aquí una función que borra al usuario de la pizarra.
let unauthorizedHandler = null;
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

// Función general para enviar cualquier petición
async function request(url, options = {}) {
  let response;

  // 1. Enviar la petición
  try {
    response = await fetch(url, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
    });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. ¿Está encendido el backend?', 0);
  }

  // 2. Leer la respuesta (si viene vacía o rota, usamos un objeto vacío)
  const data = await response.json().catch(() => ({}));

  // 3. ¿Salió mal? Lanzamos un error con un mensaje claro
  if (!response.ok) {
    // Si la sesión ya no existe (por ejemplo, se cerró), avisamos a la pizarra
    if (response.status === 401 && url !== '/api/auth/login' && unauthorizedHandler) {
      unauthorizedHandler();
    }

    const message =
      data.message ||
      (response.status >= 500
        ? 'El servidor no responde. ¿Está encendido el backend?'
        : 'Ocurrió un error inesperado.');

    throw new ApiError(message, response.status);
  }

  // 4. ¡Todo bien! Devolvemos los datos
  return data;
}

// ---------- Pedidos de autenticación ----------
export const authApi = {
  login: (username, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request('/api/auth/logout', { method: 'POST' }),
  me: () => request('/api/auth/me'),
};

// ---------- Pedidos del CRUD de productos ----------
export const productsApi = {
  list: () => request('/api/products'),                                  // READ (todos)
  get: (id) => request(`/api/products/${id}`),                           // READ (uno)
  create: (product) =>
    request('/api/products', { method: 'POST', body: JSON.stringify(product) }),       // CREATE
  update: (id, product) =>
    request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),  // UPDATE
  remove: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),               // DELETE
};