// routes/productRoutes.js
// RUTAS del CRUD de productos: el "menú" que dice qué función del Controller atiende cada URL.
// En app.js se conectan bajo el prefijo /api/products.
// 🔒 TODAS estas rutas están protegidas por el guardia (requireAuth).

import { Router } from 'express';
import {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { requireAuth } from '../middlewares/requireAuth.js';

const router = Router();

// El guardia se pone UNA vez aquí y vigila TODAS las rutas de abajo
router.use(requireAuth);

router.get('/', listProducts);        // READ:   GET    /api/products
router.get('/:id', getProduct);       // READ:   GET    /api/products/5
router.post('/', createProduct);      // CREATE: POST   /api/products
router.put('/:id', updateProduct);    // UPDATE: PUT    /api/products/5
router.delete('/:id', deleteProduct); // DELETE: DELETE /api/products/5

export default router;