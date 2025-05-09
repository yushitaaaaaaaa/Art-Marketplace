const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  const { phone, name, email, age } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { phone },
      { name, email, age },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
