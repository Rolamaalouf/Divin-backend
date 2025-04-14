// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getCurrentUser);
router.put('/:id', authenticate, authorize(['admin']), authController.editUser);     // Admin only
router.delete('/:id', authenticate, authorize(['admin']), authController.deleteUser); // Admin only
router.get('/', authenticate, authorize(['admin']), authController.getAllUsers);      // Admin only
router.get('/:id', authenticate, authController.getUserById);                         // Any authenticated user


module.exports = router;
