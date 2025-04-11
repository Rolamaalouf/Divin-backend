const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');


// Only customer can manage their cart
router.post('/', cartController.createCart);
router.get('/',  cartController.getCarts);
router.get('/:id',  cartController.getCartById);
router.put('/:id', cartController.updateCart);
router.delete('/:id', cartController.deleteCart);

module.exports = router;
