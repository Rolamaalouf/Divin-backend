const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.post('/', authenticate, authorize(['admin']), categoryController.createCategory);
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);
router.put('/:id', authenticate, authorize(['admin']), categoryController.updateCategory);
router.delete('/:id', authenticate, authorize(['admin']), categoryController.deleteCategory);

module.exports = router;
