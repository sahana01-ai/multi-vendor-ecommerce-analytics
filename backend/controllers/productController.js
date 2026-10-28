const mongoose = require('mongoose');
const Product = require('../models/Product');
const Review = require('../models/Review');

// CREATE a product (vendor only)
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, imageUrl } = req.body;

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      imageUrl,
      vendor: req.user.id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all products, optional ?vendor=<id>, with average rating attached
exports.getAllProducts = async (req, res) => {
  try {
    const filter = {};
    if (req.query.vendor && mongoose.isValidObjectId(req.query.vendor)) {
      filter.vendor = req.query.vendor;
    }

    const products = await Product.find(filter).populate('vendor', 'name storeName').lean();

    const ratings = await Review.aggregate([
      { $group: { _id: '$product', avg: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);
    const ratingMap = Object.fromEntries(ratings.map((r) => [String(r._id), r]));

    res.json(
      products.map((p) => {
        const r = ratingMap[String(p._id)];
        return {
          ...p,
          avgRating: r ? Number(r.avg.toFixed(1)) : null,
          reviewCount: r ? r.count : 0,
        };
      })
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('vendor', 'name storeName');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET products owned by the logged-in vendor
exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE a product (vendor only, own products)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this product' });
    }

    Object.assign(product, req.body);
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// DELETE a product (vendor only, own products)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.vendor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};