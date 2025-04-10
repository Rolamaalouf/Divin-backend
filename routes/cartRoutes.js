const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Only customer can manage their cart
router.post('/', authenticate, authorize(['customer']), cartController.createCart);
router.get('/', authenticate, authorize(['customer']), cartController.getCarts);
router.get('/:id', authenticate, authorize(['customer']), cartController.getCartById);
router.put('/:id', authenticate, authorize(['customer']), cartController.updateCart);
router.delete('/:id', authenticate, authorize(['customer']), cartController.deleteCart);

module.exports = router;
