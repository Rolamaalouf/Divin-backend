const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');
const { optionalAuthenticate, authenticate, authorize } = require('../middlewares/authMiddleware');

// Authenticated access
router.post('/', optionalAuthenticate, orderItemController.createOrderItem);
router.get('/', optionalAuthenticate, orderItemController.getOrderItems);
router.get('/:id', optionalAuthenticate, orderItemController.getOrderItemById);
router.put('/:id', authenticate, authorize(['admin']), orderItemController.updateOrderItem);
router.delete('/:id', authenticate, authorize(['admin']), orderItemController.deleteOrderItem);
router.get('/my-orders', optionalAuthenticate, authorize(['admin', 'customer']), orderItemController.getMyOrderItems);
router.get('/by-order/:orderId', orderItemController.getOrderItemsByOrderId);

// Guest order item creation (no auth)
router.post('/guest', orderItemController.createGuestOrderItem);

module.exports = router;
