const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  products: [
    {
      productId: String,
      name: String,
      price: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);