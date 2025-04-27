const { CartItem, Cart, Product } = require('../models');

// Get all cart items (admin/debug)
exports.getCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.findAll({
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'image'] }],
    });

    res.json(cartItems.map(item => ({
      cartItemId: item.id,
      cartId: item.cart_id, // <-- ADD THIS LINE
      productId: item.Product.id,
      name: item.Product.name,
      price: item.Product.price,
      image: item.Product.image,
      quantity: item.quantity,
    })));
    
  } catch (error) {
    console.error('GET CART ITEMS ERROR:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get cart item by ID
exports.getCartItemById = async (req, res) => {
  try {
    const cartItem = await CartItem.findByPk(req.params.id, {
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'image'] }],
    });

    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

    res.json({
      cartItemId: cartItem.id,
      cartId: cartItem.cart_id, 
      productId: cartItem.Product.id,
      name: cartItem.Product.name,
      price: cartItem.Product.price,
      image: cartItem.Product.image,
      quantity: cartItem.quantity,
    });
    
  } catch (error) {
    console.error('GET CART ITEM BY ID ERROR:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get cart items for current user or guest
exports.getMyCartItems = async (req, res) => {
  try {
    const userId = req.user?.id;
    const guestId = req.query.guest_id;

    if (!userId && !guestId) {
      return res.status(400).json({ error: "Missing user ID or guest ID" });
    }

    const cart = await Cart.findOne({
      where: userId ? { user_id: userId } : { guest_id: guestId },
      order: [['createdAt', 'DESC']],
    });

    if (!cart) return res.json([]);

    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id },
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'image'] }],
    });

    res.json(cartItems.map(item => ({
      cartItemId: item.id,
      cartId: item.cart_id, // <-- ADD THIS LINE
      productId: item.Product.id,
      name: item.Product.name,
      price: item.Product.price,
      image: item.Product.image,
      quantity: item.quantity,
    })));
    
  } catch (error) {
    console.error('GET MY CART ITEMS ERROR:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create or add to cart item
exports.createCartItem = async (req, res) => {
  try {
    const { cart_id, product_id, quantity, guest_id } = req.body;
    const user_id = req.user?.id;

    let finalCartId = cart_id;

    if (!finalCartId) {
      let cart = await Cart.findOne({
        where: user_id ? { user_id } : { guest_id },
        order: [['createdAt', 'DESC']],
      });

      if (!cart) {
        cart = await Cart.create({
          user_id: user_id || null,
          guest_id: user_id ? null : guest_id,
        });
      }

      finalCartId = cart.id;
    }

    let cartItem = await CartItem.findOne({
      where: { cart_id: finalCartId, product_id },
    });

    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        cart_id: finalCartId,
        product_id,
        quantity,
      });
    }

    const updatedCartItem = await CartItem.findByPk(cartItem.id, {
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'image'] }],
    });

    res.status(cartItem ? 200 : 201).json({
      cartItemId: updatedCartItem.id,
      productId: updatedCartItem.Product.id,
      name: updatedCartItem.Product.name,
      price: updatedCartItem.Product.price,
      image: updatedCartItem.Product.image,
      quantity: updatedCartItem.quantity,
    });
  } catch (error) {
    console.error('CREATE CART ITEM ERROR:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be greater than 0' });
    }

    const [updated] = await CartItem.update({ quantity }, { where: { id } });

    if (!updated) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    const updatedCartItem = await CartItem.findByPk(id, {
      include: [{ model: Product, attributes: ['id', 'name', 'price', 'image'] }],
    });

    res.json({
      cartItemId: updatedCartItem.id,
      productId: updatedCartItem.Product.id,
      name: updatedCartItem.Product.name,
      price: updatedCartItem.Product.price,
      image: updatedCartItem.Product.image,
      quantity: updatedCartItem.quantity,
    });
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

    if (!deleted) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('DELETE CART ITEM ERROR:', error);
    res.status(500).json({ error: 'Server error' });
  }
};