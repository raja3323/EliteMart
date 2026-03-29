// server/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.get('/', getAllProducts);                                          // public
router.get('/:id', getProductById);                                      // public
router.post('/', authMiddleware, adminMiddleware, createProduct);         // admin
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);       // admin
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);    // admin

module.exports = router;
