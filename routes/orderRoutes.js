const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Authenticated customers create/view orders
router.post('/', authenticate, authorize(['customer']), orderController.createOrder);
router.get('/', authenticate, authorize(['admin', 'customer']), orderController.getOrders);
router.get('/:id', authenticate, authorize(['admin', 'customer']), orderController.getOrderById);
router.put('/:id', authenticate, authorize(['admin']), orderController.updateOrder);
router.delete('/:id', authenticate, authorize(['admin']), orderController.deleteOrder);

// Guest creates order (no authentication)
router.post('/guest', orderController.createGuestOrder);

module.exports = router;
