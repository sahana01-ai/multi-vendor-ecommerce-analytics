const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
      },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['COD', 'Online'], required: true },
  paymentStatus: { type: String, enum: ['pending', 'paid'], default: 'pending' },
  shippingAddress: { type: String, required: true },
  deliveryPincode: { type: String },
  deliveryCity: { type: String },
  deliveryFee: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);