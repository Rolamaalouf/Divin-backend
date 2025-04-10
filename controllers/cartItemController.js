// controllers/cartItemController.js
const { CartItem } = require('../models');

exports.createCartItem = async (req, res) => {
  try {
    const { cart_id, product_id, quantity } = req.body;
    const cartItem = await CartItem.create({ cart_id, product_id, quantity });
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll();
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id);
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await CartItem.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Cart item not found' });
    const updatedCartItem = await CartItem.findByPk(id);
    res.json(updatedCartItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await CartItem.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
