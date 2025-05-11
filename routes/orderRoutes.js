const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/orders', orderController.createOrder);

router.get('/orders/:phone', orderController.getUserOrders);

module.exports = router;

