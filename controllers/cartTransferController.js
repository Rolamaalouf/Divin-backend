const { Cart, CartItem, sequelize } = require('../models'); // Make sure sequelize is imported

exports.transferGuestCartToUser = async (req, res) => {

  const user_id = req.user?.id;
  const { guest_id } = req.body;

  if (!user_id || !guest_id) {
    console.warn('Missing user_id or guest_id:', { user_id, guest_id });
    return res.status(400).json({ message: 'Missing user_id or guest_id' });
  }

  const t = await sequelize.transaction(); // Start transaction

  try {
    console.log('Attempting to transfer guest cart:', { guest_id, user_id });

    // Find guest cart with items
    const guestCart = await Cart.findOne({
      where: { guest_id },
      include: [CartItem],
      transaction: t
    });

    if (!guestCart) {
      console.warn('No guest cart found for guest_id:', guest_id);
      await t.rollback();
      return res.status(404).json({ message: 'Guest cart not found' });
    }

    console.log('Guest cart found:', guestCart.id);
    console.log('Guest cart items count:', guestCart.CartItems.length);

    // Find or create user cart
    let userCart = await Cart.findOne({ where: { user_id }, transaction: t });

    if (!userCart) {
      console.log('No existing user cart, creating new one.');
      userCart = await Cart.create({ user_id }, { transaction: t });
    } else {
      console.log('User cart found:', userCart.id);
    }

    // Move items from guest cart to user cart
    for (const item of guestCart.CartItems) {
      console.log(`Processing item product_id=${item.product_id}, quantity=${item.quantity}`);

      const existingItem = await CartItem.findOne({
        where: {
          cart_id: userCart.id,
          product_id: item.product_id
        },
        transaction: t
      });

      if (existingItem) {
        console.log('Item already exists in user cart. Updating quantity.');
        await existingItem.update(
          { quantity: existingItem.quantity + item.quantity },
          { transaction: t }
        );
      } else {
        console.log('Item not in user cart. Creating new entry.');
        await CartItem.create(
          {
            cart_id: userCart.id,
            product_id: item.product_id,
            quantity: item.quantity
          },
          { transaction: t }
        );
      }
    }

    // Delete guest cart items then the cart
    console.log('Deleting guest cart items and cart.');
    await CartItem.destroy({ where: { cart_id: guestCart.id }, transaction: t });
    await guestCart.destroy({ transaction: t });

    await t.commit(); // Commit all changes
    console.log('Guest cart successfully transferred.');

    res.status(200).json({
      message: 'Guest cart successfully transferred to user',
      cart: userCart
    });
  } catch (err) {
    await t.rollback(); // Rollback changes on error
    console.error('Cart transfer error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
