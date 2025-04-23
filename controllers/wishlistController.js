// controllers/wishlistController.js
const { Wishlist } = require('../models');

exports.createWishlistItem = async (req, res) => {
  try {
    const { product_id, guest_id } = req.body; // guest_id could be passed from frontend
    const user_id = req.user ? req.user.id : null;

    console.log('[CREATE WISHLIST] Received:', { product_id, guest_id, user_id });
    if (!user_id && !guest_id) {
      return res.status(400).json({ message: 'user_id or guest_id is required' });
    }

    const wishlistItem = await Wishlist.create({ user_id, product_id, guest_id });
    res.status(201).json(wishlistItem);
  } catch (error) {
    console.error('[CREATE WISHLIST ERROR]', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll();
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getWishlistItemById = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findByPk(req.params.id);
    if (!wishlistItem) return res.status(404).json({ message: 'Wishlist item not found' });
    res.json(wishlistItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Wishlist.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Wishlist item not found' });
    const updatedWishlistItem = await Wishlist.findByPk(id);
    res.json(updatedWishlistItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteWishlistItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Wishlist.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Wishlist item not found' });
    res.json({ message: 'Wishlist item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
