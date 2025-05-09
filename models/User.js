const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  age: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
