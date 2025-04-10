const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItemController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Only customer can manage cart items
router.post('/', authenticate, authorize(['customer']), cartItemController.createCartItem);
router.get('/', authenticate, authorize(['customer']), cartItemController.getCartItems);
router.get('/:id', authenticate, authorize(['customer']), cartItemController.getCartItemById);
router.put('/:id', authenticate, authorize(['customer']), cartItemController.updateCartItem);
router.delete('/:id', authenticate, authorize(['customer']), cartItemController.deleteCartItem);

module.exports = router;
