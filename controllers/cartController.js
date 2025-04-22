const { Cart } = require('../models');

// Create a cart
exports.createCart = async (req, res) => {
  try {
    // Try to get user_id from authenticated user
    const user_id = req.user ? req.user.id : null;
    // Try to get guest_id from request body (sent by frontend)
    const { guest_id } = req.body;

    if (!user_id && !guest_id) {
      return res.status(400).json({ message: 'user_id or guest_id is required' });
    }

    // Prefer user_id if available
    const finalGuestId = user_id ? null : guest_id;

    const cart = await Cart.create({ user_id, guest_id: finalGuestId });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Server error' });
  }
};


// Get all carts
exports.getCarts = async (req, res) => {
  try {
    const carts = await Cart.findAll();
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get a cart by ID
exports.getCartById = async (req, res) => {
  try {
    const cart = await Cart.findByPk(req.params.id);
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a cart
exports.updateCart = async (req, res) => {
  try {
    const { id } = req.params;
    const { guest_id } = req.body;
    const user_id = req.user ? req.user.userId : null; // Get user ID from authenticated request (JWT)

    const [updated] = await Cart.update({ user_id, guest_id }, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Cart not found' });

    const updatedCart = await Cart.findByPk(id);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a cart
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
