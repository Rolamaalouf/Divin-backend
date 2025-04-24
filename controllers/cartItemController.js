const { CartItem, Cart, Product } = require('../models');


exports.getMyCartItems = async (req, res) => {
  try {
    const userId = req.user?.id;
    const guestId = req.query.guest_id;


    if (!userId && !guestId) {
      return res.status(400).json({ error: "Missing user ID or guest ID" });
    }

    const cart = await Cart.findOne({
      where: userId ? { user_id: userId } : { guest_id: guestId },
    });

    if (!cart) return res.json([]); // Return empty if no cart exists

    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image'],
      }],
    });

    res.json(cartItems);
  } catch (error) {
    console.error('GET MY CART ITEMS ERROR:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMyCartItems = async (req, res) => {
  try {
    const userId = req.user?.id;
    const guestId = req.query.guest_id;

    // Find the most recent cart for the user (or guest if no user)
    const cart = await Cart.findOne({
      where: userId ? { user_id: userId } : { guest_id: guestId },
      order: [['createdAt', 'DESC']], // Get the most recent cart
    });

    if (!cart) return res.json([]); // If no cart found, return empty array

    console.log('Fetched cart:', cart);

    // Now get the cart items for the found cart
    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image'],
      }],
    });

    console.log('Fetched cart items:', cartItems);
    res.json(cartItems); // Return cart items
  } catch (error) {
    console.error('GET MY CART ITEMS ERROR:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Create or update cart item
exports.createCartItem = async (req, res) => {
  try {
    const { cart_id, product_id, quantity } = req.body;

    const existingItem = await CartItem.findOne({
      where: { cart_id, product_id },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
      return res.status(200).json(existingItem);
    }

    const cartItem = await CartItem.create({ cart_id, product_id, quantity });
    res.status(201).json(cartItem);
  } catch (error) {
    console.error('CREATE/UPDATE CART ITEM ERROR:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all cart items
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image'],
      }],
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get cart item by ID
exports.getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id, {
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image'],
      }],
    });

    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update cart item
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }
    // Ensure only quantity is updated
    const [updated] = await CartItem.update(
      { quantity },
      { where: { id } }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const updatedCartItem = await CartItem.findByPk(id, {
      include: [{
        model: Product,
        attributes: ['id', 'name', 'price', 'image'],
      }],
    });

    res.json(updatedCartItem);
  } catch (error) {
    console.error('UPDATE CART ITEM ERROR:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Delete cart item
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
