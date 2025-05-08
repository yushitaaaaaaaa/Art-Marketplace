const User = require("../models/User");
const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { phone, items, totalAmount } = req.body;
    const user = await User.findOne({ phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const order = new Order({ userId: user._id, products: items, totalAmount });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    const orders = await Order.find({ userId: user._id });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).send(err);
  }
};
