const { Order, OrderItem, Product, User } = require('../models');

// Create a new order
exports.createOrder = async (req, res) => {
  try {
    const { status, address, shipping_fees, promocode, items, name, email } = req.body;

    const user_id = req.user?.id || null;
    const guest_id = req.guestId || req.body.guest_id || null;

    if (!!user_id === !!guest_id) {
      return res.status(400).json({ error: 'Provide either user or guest session.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    const order = await Order.create({
      status,
      address,
      shipping_fees,
      promocode,
      user_id,
      guest_id,
      name,
      email
    });

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    }));

    for (const item of items) {
      await Product.decrement('stock', {
        by: item.quantity,
        where: { id: item.product_id }
      });
    }

    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({ order, orderItems });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all orders (with user info)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
          required : false
        }
      ]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single order with details
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'image']
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
          required : false
        }
      ]
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get Order by ID error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update order
// ... your other imports and code ...

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id || null;
    const guest_id = req.guestId || req.body.guest_id || null;


    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only allow if the user or guest owns the order
    if (
      (order.user_id && order.user_id !== user_id) ||
      (order.guest_id && order.guest_id !== guest_id)
    ) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    await order.update(req.body);

    const updatedOrder = await Order.findByPk(id, {
      include: [
        {
          model: OrderItem,
          as: 'orderItems',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'image']
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email'],
          required: false
        }
      ]
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error('Update Order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
