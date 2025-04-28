const { Order, OrderItem } = require('../models');

exports.createOrder = async (req, res) => {
  try {
    let { user_id, guest_id, status, address, shipping_fees, promocode, items } = req.body;

    // Validate presence of one and only one of user_id or guest_id
    if (!!user_id === !!guest_id) {
      return res.status(400).json({ error: 'Provide either user_id or guest_id, not both.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    // Create the order
    const orderData = {
      status,
      address,
      shipping_fees,
      promocode,
      user_id: user_id || null,
      guest_id: guest_id || null
    };

    const order = await Order.create(orderData);

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price
    }));

    await OrderItem.bulkCreate(orderItems);

    res.status(201).json({ order, orderItems });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
};



// Get all orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Order.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Order not found' });
    const updatedOrder = await Order.findByPk(id);
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete an order
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
exports.createGuestOrder = async (req, res) => {
  try {
    const { guest_id, status, address, shipping_fees, promocode } = req.body;
    const order = await Order.create({
      guest_id, status, address, shipping_fees, promocode
    });
    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

