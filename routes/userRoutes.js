const express = require("express");
const router = express.Router();
const User = require("../models/User"); 

console.log("Registering user routes...");

router.get('/profile/:phone', async (req, res) => {
  try {
    console.log(`GET /profile/${req.params.phone} called`);
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Failed to fetch profile", error: err.message });
  }
});

router.put('/update-profile', async (req, res) => {
  const { phone, name, email, age } = req.body;
  
  console.log(`PUT /update-profile called for phone: ${phone}`);
  console.log("Update data:", { name, email, age });
  
  if (!phone) {
    return res.status(400).json({ message: "Phone number is required" });
  }
  
  try {
    const existingUser = await User.findOne({ phone });
    
    if (!existingUser) {
      console.log(`User with phone ${phone} not found`);
      return res.status(404).json({ message: "User not found" });
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { phone },
      { 
        name: name || existingUser.name,
        email: email || existingUser.email,
        age: age || existingUser.age
      },
      { new: true }
    );
    
    console.log(`User profile updated successfully for ${phone}`);
    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

router.delete('/delete-account/:phone', async (req, res) => {
  try {
    console.log(`DELETE /delete-account/${req.params.phone} called`);
    const result = await User.findOneAndDelete({ phone: req.params.phone });
    if (!result) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (err) {
    console.error("Error deleting user account:", err);
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
});

module.exports = router;
