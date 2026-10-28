const express = require('express');
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductById,
  getMyProducts,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes (anyone can view products)
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Vendor-only routes (must be logged in AND be a vendor)
router.post('/', protect, authorize('vendor'), createProduct);
router.get('/vendor/my-products', protect, authorize('vendor'), getMyProducts);
router.put('/:id', protect, authorize('vendor'), updateProduct);
router.delete('/:id', protect, authorize('vendor'), deleteProduct);

module.exports = router;