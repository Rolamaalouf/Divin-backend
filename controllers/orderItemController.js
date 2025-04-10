// controllers/orderItemController.js
const { OrderItem } = require('../models');

exports.createOrderItem = async (req, res) => {
  try {
    const { order_id, product_id, quantity, price } = req.body;
    const orderItem = await OrderItem.create({ order_id, product_id, quantity, price });
    res.status(201).json(orderItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getOrderItems = async (req, res) => {
  try {
    const orderItems = await OrderItem.findAll();
    res.json(orderItems);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id);
    if (!orderItem) return res.status(404).json({ message: 'Order item not found' });
    res.json(orderItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await OrderItem.update(req.body, { where: { id } });
    if (!updated) return res.status(404).json({ message: 'Order item not found' });
    const updatedOrderItem = await OrderItem.findByPk(id);
    res.json(updatedOrderItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteOrderItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await OrderItem.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: 'Order item not found' });
    res.json({ message: 'Order item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
