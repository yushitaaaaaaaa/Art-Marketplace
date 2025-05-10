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









