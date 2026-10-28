const express = require('express');
const router = express.Router();
const { createReview, getProductReviews, deleteReview } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('customer'), createReview);
router.get('/:productId', getProductReviews);
router.delete('/:id', protect, authorize('customer'), deleteReview);

module.exports = router;