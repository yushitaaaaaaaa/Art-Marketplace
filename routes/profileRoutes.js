const express = require("express");
const router = express.Router();
const { updateProfile } = require("../controllers/profileController");

router.put("/update-profile", updateProfile);

module.exports = router;
