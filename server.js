require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const User = require("./models/User");
const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const orderRoutes = require("./routes/orderRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

const User = require("./models/User"); 

app.put("/api/update-profile", async (req, res) => {
  const { phone, name, email, age } = req.body;
  try {
    const user = await User.findOneAndUpdate({ phone }, { name, email, age }, { new: true });
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

const PORT = 4545;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));











// require("dotenv").config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const twilio = require("twilio");

// const User = require("./models/User");
// const Order = require("./models/Order");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Twilio setup
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const serviceSid = process.env.TWILIO_SERVICE_SID;
// const client = twilio(accountSid, authToken);

// // Send OTP
// app.post("/send-otp", async (req, res) => {
//   const { phone } = req.body;
//   try {
//     const verification = await client.verify.v2
//       .services(serviceSid)
//       .verifications.create({ to: `+91${phone}`, channel: "sms" });
//     res.status(200).send(verification);
//   } catch (error) {
//     console.error("Send OTP error:", error);
//     res.status(500).send(error);
//   }
// });

// // Verify OTP and log in / create user
// app.post("/verify-otp", async (req, res) => {
//   const { phone, code } = req.body;
//   try {
//     const verificationCheck = await client.verify.v2
//       .services(serviceSid)
//       .verificationChecks.create({ to: `+91${phone}`, code });

//     if (verificationCheck.status === "approved") {
//       let user = await User.findOne({ phone });
//       if (!user) {
//         user = await User.create({ phone });
//       }
//       res.status(200).json({ message: "Phone verified", user });
//     } else {
//       res.status(400).json({ message: "Invalid OTP" });
//     }
//   } catch (error) {
//     console.error("Verify OTP error:", error);
//     res.status(500).send(error);
//   }
// });

// // Get user by phone
// app.get("/user/:phone", async (req, res) => {
//   try {
//     const user = await User.findOne({ phone: req.params.phone });
//     if (!user) return res.status(404).send({ message: "User not found" });
//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Create an order
// app.post("/order", async (req, res) => {
//   try {
//     const { phone, items, totalAmount } = req.body;
//     const user = await User.findOne({ phone });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const order = new Order({
//       userId: user._id,
//       products: items,
//       totalAmount,
//     });

//     await order.save();
//     res.status(201).json(order);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// // Get all orders for a user
// app.get("/orders/:phone", async (req, res) => {
//   try {
//     const user = await User.findOne({ phone: req.params.phone });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const orders = await Order.find({ userId: user._id });
//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

// // Start server
// const PORT = 4545;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
