const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getVendorOrders,
  updateItemStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('customer'), createOrder);
router.get('/my-orders', protect, authorize('customer'), getMyOrders);
router.get('/vendor-orders', protect, authorize('vendor'), getVendorOrders);
router.put('/:orderId/items/:itemId', protect, authorize('vendor'), updateItemStatus);

module.exports = router;