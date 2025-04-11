const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Authenticated access
router.post('/', authenticate, authorize(['admin']), orderItemController.createOrderItem);
router.get('/', authenticate, authorize(['admin']), orderItemController.getOrderItems);
router.get('/:id', authenticate, authorize(['admin']), orderItemController.getOrderItemById);
router.put('/:id', authenticate, authorize(['admin']), orderItemController.updateOrderItem);
router.delete('/:id', authenticate, authorize(['admin']), orderItemController.deleteOrderItem);
router.get('/my-orders', authenticate, authorize(['admin', 'customer']), orderItemController.getMyOrderItems);

// Guest order item creation (no auth)
router.post('/guest', orderItemController.createGuestOrderItem);

module.exports = router;
