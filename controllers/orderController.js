const User = require("../models/User");
const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount } = req.body;
    
    const order = new Order({
      userId,
      products,
      totalAmount
    });
    
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const orders = await Order.find({ userId: user._id });
    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};
