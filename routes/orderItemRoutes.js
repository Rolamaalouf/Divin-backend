const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.post('/', authenticate, authorize(['admin']), orderItemController.createOrderItem);
router.get('/', authenticate, authorize(['admin']), orderItemController.getOrderItems);
router.get('/:id', authenticate, authorize(['admin']), orderItemController.getOrderItemById);
router.put('/:id', authenticate, authorize(['admin']), orderItemController.updateOrderItem);
router.delete('/:id', authenticate, authorize(['admin']), orderItemController.deleteOrderItem);

module.exports = router;
