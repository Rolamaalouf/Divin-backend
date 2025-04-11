const express = require('express');
const router = express.Router();
const productController = require('../controllers/productionController');
const upload = require('../middlewares/upload'); // <-- Add this
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);

// Protected routes for admins only
router.post(
    '/',
    authenticate,
    authorize(['admin']),
    upload.array('images', 5), // allows up to 5 images
    productController.createProduct
  );

router.put('/:id',  upload.array('images'), authenticate, authorize(['admin']), productController.updateProduct);
router.delete('/:id', authenticate, authorize(['admin']), productController.deleteProduct);

module.exports = router;
