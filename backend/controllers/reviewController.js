const Review = require('../models/Review');
const Order = require('../models/Order');

exports.createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const existing = await Review.findOne({ product: productId, customer: req.user.id });
    if (existing) {
      return res.status(400).json({ message: 'You already reviewed this product' });
    }

    // Verified purchase = this customer has an order containing the product
    const bought = await Order.exists({ customer: req.user.id, 'items.product': productId });

    const review = new Review({
      product: productId,
      customer: req.user.id,
      rating,
      comment,
      verifiedPurchase: !!bought,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('customer', 'name')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can only delete your own review' });
    }
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};