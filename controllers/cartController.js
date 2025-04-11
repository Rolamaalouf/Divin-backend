const { Cart } = require('../models');

exports.createCart = async (req, res) => {
  try {
    const { user_id, guest_id } = req.body;

    if (!user_id && !guest_id) {
      return res.status(400).json({ message: 'user_id or guest_id is required' });
    }

    const cart = await Cart.create({ user_id, guest_id });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, guest_id } = req.body;

    const [updated] = await Cart.update({ user_id, guest_id }, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Cart not found' });

    const updatedCart = await Cart.findByPk(id);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCart = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Cart.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Cart not found' });
    res.json({ message: 'Cart deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
