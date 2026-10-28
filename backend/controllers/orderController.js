const Order = require('../models/Order');
const Product = require('../models/Product');
const { FREE_ABOVE, findArea } = require('../config/deliveryAreas');

// CREATE an order (customer checkout)
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, pincode } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    if (!['COD', 'Online'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Choose a payment method' });
    }
    const area = findArea(pincode);
    if (!area) {
      return res.status(400).json({ message: "Sorry, we don't deliver to that pincode yet." });
    }

    let itemsTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${product.name}` });
      }

      orderItems.push({
        product: product._id,
        vendor: product.vendor,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
      itemsTotal += product.price * item.quantity;

      product.stock -= item.quantity;
      await product.save();
    }

    const deliveryFee = itemsTotal >= FREE_ABOVE ? 0 : area.fee;

    const order = new Order({
      customer: req.user.id,
      items: orderItems,
      totalAmount: itemsTotal + deliveryFee,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'Online' ? 'paid' : 'pending',
      deliveryPincode: String(pincode).trim(),
      deliveryCity: area.city,
      deliveryFee,
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET orders for the logged-in customer
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET orders that contain items from the logged-in vendor
exports.getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.vendor': req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// UPDATE the status of one item (vendor updates their own item only)
exports.updateItemStatus = async (req, res) => {
  try {
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const item = order.items.id(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in order' });

    if (item.vendor.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this item' });
    }

    item.status = status;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};