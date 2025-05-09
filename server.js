require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const profileRoutes = require("./routes/profileRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use('/api', authRoutes);
app.use('/api', orderRoutes);
app.use("/api", userRoutes);
app.use("/api", profileRoutes);

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

const PORT = 4545;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
