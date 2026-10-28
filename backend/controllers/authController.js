const User = require('../models/User');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, storeName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer',
      storeName: role === 'vendor' ? storeName : undefined,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET all vendors (admin only)
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor' }).select('-password');
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE vendor approval status (admin only)
exports.updateVendorStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const vendor = await User.findById(req.params.id);
    if (!vendor || vendor.role !== 'vendor') {
      return res.status(404).json({ message: 'Vendor not found' });
    }
    vendor.vendorStatus = status;
    await vendor.save();
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// PUBLIC: approved shops with their product counts
exports.getStores = async (req, res) => {
  try {
    const vendors = await User.find({ role: 'vendor', vendorStatus: 'approved' }).select('name storeName');
    const counts = await Product.aggregate([{ $group: { _id: '$vendor', count: { $sum: 1 } } }]);
    const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));

    res.json(
      vendors.map((v) => ({
        _id: v._id,
        storeName: v.storeName || v.name,
        productCount: countMap[String(v._id)] || 0,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};