
const express = require('express');
const router = express.Router();

const wishlistController = require('../controllers/wishlistController');
const {authenticate} = require('../middlewares/authMiddleware');

router.post('/', authenticate, wishlistController.createWishlistItem);
router.get('/', authenticate, wishlistController.getWishlist);
router.get('/:id', authenticate, wishlistController.getWishlistItemById);
router.put('/:id', authenticate, wishlistController.updateWishlistItem);
router.delete('/:id', authenticate, wishlistController.deleteWishlistItem);

module.exports = router;
