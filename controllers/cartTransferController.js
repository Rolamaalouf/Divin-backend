const { Cart, CartItem } = require('../models');

exports.transferGuestCartToUser = async (req, res) => {
  const user_id = req.user?.id;
  const { guest_id } = req.body;

  if (!user_id || !guest_id) {
    return res.status(400).json({ message: 'Missing user_id or guest_id' });
  }

  try {
    // Find guest cart and items
    const guestCart = await Cart.findOne({ where: { guest_id }, include: [CartItem] });
    if (!guestCart) return res.status(404).json({ message: 'Guest cart not found' });

    // Find or create user cart
    let userCart = await Cart.findOne({ where: { user_id } });
    if (!userCart) {
      userCart = await Cart.create({ user_id });
    }

    // Move each cart item to user cart
    for (const item of guestCart.CartItems) {
      const existingItem = await CartItem.findOne({
        where: {
          cart_id: userCart.id,
          product_id: item.product_id
        }
      });

      if (existingItem) {
        // If product already in user cart, update quantity
        await existingItem.update({ quantity: existingItem.quantity + item.quantity });
      } else {
        // Otherwise, move item to user cart
        await CartItem.create({
          cart_id: userCart.id,
          product_id: item.product_id,
          quantity: item.quantity
        });
      }
    }

    // Delete guest cart and items
    await CartItem.destroy({ where: { cart_id: guestCart.id } });
    await guestCart.destroy();

    res.status(200).json({ message: 'Guest cart successfully transferred to user', cart: userCart });
  } catch (err) {
    console.error('Cart transfer error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
