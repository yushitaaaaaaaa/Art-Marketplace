const express = require("express");
const router = express.Router();
const { createOrder, getUserOrders } = require("../controllers/orderController");

router.post("/order", createOrder);
router.get("/orders/:phone", getUserOrders);

module.exports = router;
