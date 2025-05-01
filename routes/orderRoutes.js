const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { optionalAuthenticate, authenticate, authorize } = require('../middlewares/authMiddleware');

// Authenticated customers create/view orders
router.post('/', optionalAuthenticate, orderController.createOrder);
router.get('/', optionalAuthenticate,  orderController.getOrders);
router.get('/:id', authenticate, authorize(['admin', 'customer']), orderController.getOrderById);
router.put('/:id', authenticate, authorize(['admin']), orderController.updateOrder);
router.delete('/:id', authenticate, authorize(['admin']), orderController.deleteOrder);


module.exports = router;
