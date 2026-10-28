const Order = require('../models/Order');
const mongoose = require('mongoose');

// VENDOR ANALYTICS: revenue over time + top products (for the logged-in vendor only)
exports.getVendorAnalytics = async (req, res) => {
  try {
    const vendorId = new mongoose.Types.ObjectId(req.user.id);

    // Total revenue & order count for this vendor
    const summary = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.vendor': vendorId } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $sum: 1 },
          totalUnitsSold: { $sum: '$items.quantity' },
        },
      },
    ]);

    // Revenue grouped by day (for a line chart)
    const revenueOverTime = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.vendor': vendorId } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top-selling products for this vendor
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.vendor': vendorId } },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          unitsSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
    ]);

    res.json({
      summary: summary[0] || { totalRevenue: 0, totalOrders: 0, totalUnitsSold: 0 },
      revenueOverTime,
      topProducts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ADMIN ANALYTICS: platform-wide numbers
exports.getAdminAnalytics = async (req, res) => {
  try {
    const summary = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          totalOrders: { $sum: 1 },
        },
      },
    ]);

    const revenueOverTime = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Top vendors by revenue
    const topVendors = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.vendor',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          unitsSold: { $sum: '$items.quantity' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'vendorInfo',
        },
      },
      { $unwind: '$vendorInfo' },
      {
        $project: {
          revenue: 1,
          unitsSold: 1,
          name: '$vendorInfo.name',
          storeName: '$vendorInfo.storeName',
        },
      },
    ]);

    res.json({
      summary: summary[0] || { totalRevenue: 0, totalOrders: 0 },
      revenueOverTime,
      topVendors,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};