// controllers/orderItemController.js
const { OrderItem, Order, Product } = require('../models');

// Create an order item
exports.createOrderItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity, price } = req.body;
    const orderItem = await OrderItem.create({ order_id, product_id, quantity, price });
    res.status(201).json(orderItem);
  } catch (error) {
    console.error('Create OrderItem error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all order items
exports.getOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll();
    res.json(orderItems);
  } catch (error) {
    console.error('Get OrderItems error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get order item by ID
exports.getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (!orderItem) return res.status(404).json({ message: 'Order item not found' });
    res.json(orderItem);
  } catch (error) {
    console.error('Get OrderItem by ID error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update order item
exports.updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await OrderItem.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Order item not found' });
    const updatedOrderItem = await OrderItem.findByPk(id);
    res.json(updatedOrderItem);
  } catch (error) {
    console.error('Update OrderItem error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete order item
exports.deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OrderItem.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Order item not found' });
    res.json({ message: 'Order item deleted successfully' });
  } catch (error) {
    console.error('Delete OrderItem error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all order items for current user
exports.getMyOrderItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Order,
          where: { user_id: userId },
          attributes: ['id', 'status'] // optional: limit fields
        },
        {
          model: Product,
          attributes: ['name', 'price', 'image']
        }
      ]
    });

    res.json(orderItems);
  } catch (error) {
    console.error('Error fetching user order items:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.createGuestOrderItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity, price } = req.body;
    const orderItem = await OrderItem.create({ order_id, product_id, quantity, price });
    res.status(201).json(orderItem);
  } catch (error) {
    console.error('Create guest OrderItem error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
