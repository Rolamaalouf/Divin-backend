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
exports.getOrderItemById = async (req, res) => {
  try {
    const orderItem = await OrderItem.findByPk(req.params.id, {
      include: [{ model: Product, as: 'product' }]
    });

    if (!orderItem) return res.status(404).json({ message: 'Order item not found' });

    res.json(orderItem);
  } catch (error) {
    console.error('Get OrderItemById error:', error);
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

exports.getMyOrderItems = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user); 
    const userId = req.user?.id;
    const guestId = req.guestId;
    console.log("Authenticated user:", req.user); 
    const orderWhere = {};

    if (userId) {
      orderWhere.user_id = userId;
    } else if (guestId) {
      orderWhere.guest_id = guestId;
    } else {
      return res.status(401).json({ error: 'No user or guest ID provided' });
    }

    const orderItems = await OrderItem.findAll({
      include: [
        {
          model: Order,
          where: orderWhere,
          attributes: ['id', 'status']
        },
        {
          model: Product,
          as: 'product', // ✅ match the alias used in association
          attributes: ['name', 'price', 'image']
        }
      ]
    });

    res.json(orderItems);
  } catch (error) {
    console.error('Error fetching user/guest order items:', error);
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
// Get all order items for a specific order ID
exports.getOrderItemsByOrderId = async (req, res) => {
  try {
    const { orderId } = req.params;

    const orderItems = await OrderItem.findAll({
      where: { order_id: orderId },
      include: [
        {
          model: Product,
          as: 'product', 
          attributes: ['id', 'name', 'price', 'image']
        }
      ]
    });

    res.json(orderItems);
  } catch (error) {
    console.error('Get OrderItems by OrderId error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
