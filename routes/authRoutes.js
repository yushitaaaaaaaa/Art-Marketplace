const express = require("express");
const router = express.Router();
const { sendOTP, verifyOTP, getUser } = require("../controllers/authController");

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.get("/user/:phone", getUser);

module.exports = router;
