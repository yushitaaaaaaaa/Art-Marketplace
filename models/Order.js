const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  products: [
    {
      productId: { type: String, required: true },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: Number,
  date: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    default: 'Pending' 
  }
});


module.exports = mongoose.model('Order', orderSchema);
