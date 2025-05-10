const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { getUserOrders } = require("../controllers/orderController");

router.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
});

router.get("/orders/:phone", getUserOrders);

module.exports = router;
