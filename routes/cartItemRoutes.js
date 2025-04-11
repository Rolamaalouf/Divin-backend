const express = require('express');
const router = express.Router();
const cartItemController = require('../controllers/cartItemController');

// Only customer can manage cart items
router.post('/', cartItemController.createCartItem);
router.get('/', cartItemController.getCartItems);
router.get('/:id', cartItemController.getCartItemById);
router.put('/:id',cartItemController.updateCartItem);
router.delete('/:id', cartItemController.deleteCartItem);

module.exports = router;
