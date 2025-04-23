
const express = require('express');
const router = express.Router();

const wishlistController = require('../controllers/wishlistController');
const {authenticate} = require('../middlewares/authMiddleware');
const { optionalAuthenticate } = require('../middlewares/authMiddleware');

router.post('/', optionalAuthenticate, wishlistController.createWishlistItem);
router.get('/', optionalAuthenticate, wishlistController.getWishlist);
router.get('/:id', optionalAuthenticate, wishlistController.getWishlistItemById);
router.put('/:id', authenticate, wishlistController.updateWishlistItem);
router.delete('/:id', optionalAuthenticate, wishlistController.deleteWishlistItem);

module.exports = router;
