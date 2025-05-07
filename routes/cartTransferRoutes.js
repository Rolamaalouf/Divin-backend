const express = require('express');
const router = express.Router();
const { transferGuestCartToUser } = require('../controllers/cartTransferController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/transfer', authenticate, transferGuestCartToUser);

module.exports = router;
