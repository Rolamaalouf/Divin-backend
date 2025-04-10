// controllers/wishlistController.js
const { Wishlist } = require('../models');

exports.createWishlistItem = async (req, res) => {
  try {
    const { user_id, product_id } = req.body;
    const wishlistItem = await Wishlist.create({ user_id, product_id });
    res.status(201).json(wishlistItem);
  } catch (error) {
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
