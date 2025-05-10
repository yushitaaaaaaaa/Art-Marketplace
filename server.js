const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

const client = twilio(accountSid, authToken);

app.post("/send-otp", async (req, res) => {
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
});

app.post("/verify-otp", async (req, res) => {
  const { phone, code } = req.body;
  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: `+91${phone}`, code });
    if (verificationCheck.status === "approved") {
      res.status(200).send({ message: "Phone verified" });
    } else {
      res.status(400).send({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).send(error);
  }
});

const PORT = 4545;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

