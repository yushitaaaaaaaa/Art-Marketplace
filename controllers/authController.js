const twilio = require("twilio");
const User = require("../models/User");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const serviceSid = process.env.TWILIO_SERVICE_SID;

exports.sendOTP = async (req, res) => {
  const { phone } = req.body;
  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: `+91${phone}`, channel: "sms" });
    res.status(200).send(verification);
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).send(error);
  }
};

exports.verifyOTP = async (req, res) => {
  const { phone, code } = req.body;
  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: `+91${phone}`, code });

    if (verificationCheck.status === "approved") {
      let user = await User.findOne({ phone });
      if (!user) user = await User.create({ phone });
      res.status(200).json({ message: "Phone verified", user });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).send(error);
  }
};

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) return res.status(404).send({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).send(err);
  }
};
