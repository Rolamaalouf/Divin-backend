const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { optionalAuthenticate } = require('../middlewares/authMiddleware');


// Only customer can manage their cart
router.post('/', optionalAuthenticate, cartController.createCart);
router.get('/',  cartController.getCarts);
router.get('/:id', cartController.getCartById);
router.put('/:id', optionalAuthenticate, cartController.updateCart);
router.delete('/:id', optionalAuthenticate, cartController.deleteCart);

module.exports = router;
