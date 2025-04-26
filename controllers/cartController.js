const { Cart } = require('../models');

exports.createCart = async (req, res) => {
  try {
    const user_id = req.user ? req.user.id : null;
    const { guest_id } = req.body;

    if (!user_id && !guest_id) {
      return res.status(400).json({ message: 'user_id or guest_id is required' });
    }

    // Prefer user_id if available
    const finalGuestId = user_id ? null : guest_id;

    // Check if a cart already exists for this user or guest
    const existingCart = await Cart.findOne({
      where: user_id ? { user_id } : { guest_id: finalGuestId },
    });

    if (existingCart) {
      // Return existing cart instead of creating a new one
      return res.status(200).json(existingCart);
    }

    // No existing cart found, create a new one
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
