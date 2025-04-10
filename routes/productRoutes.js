// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productionController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected routes for admins only
router.post('/', authenticate, authorize(['admin']), productController.createProduct);
router.put('/:id', authenticate, authorize(['admin']), productController.updateProduct);
router.delete('/:id', authenticate, authorize(['admin']), productController.deleteProduct);

module.exports = router;
