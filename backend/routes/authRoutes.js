const express = require('express');
const router = express.Router();
const { signup, login, getAllVendors, updateVendorStatus, getStores } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/stores', getStores);
router.get('/vendors', protect, authorize('admin'), getAllVendors);
router.put('/vendors/:id/status', protect, authorize('admin'), updateVendorStatus);

module.exports = router;