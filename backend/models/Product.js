const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true, default: 0 },
  imageUrl: { type: String },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // links this product to the vendor who created it
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);