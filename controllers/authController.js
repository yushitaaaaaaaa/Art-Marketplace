const twilio = require("twilio");
const User = require("../models/User");

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;

if (!twilioAccountSid || !twilioAuthToken || !serviceSid) {
  console.error("ERROR: Missing Twilio credentials in environment variables");
  console.error("Please check your .env file and ensure all Twilio variables are set");
}

const client = twilio(twilioAccountSid, twilioAuthToken);

exports.sendOTP = async (req, res) => {
  const { phone } = req.body;
  
  console.log(`Sending OTP to +91${phone}`);
  
  if (!phone || phone.length !== 10 || isNaN(phone)) {
    console.log(`Invalid phone number format: ${phone}`);
    return res.status(400).json({ message: "Invalid phone number format" });
  }
  
  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: `+91${phone}`, channel: "sms" });
    console.log(`OTP sent successfully to +91${phone}, status: ${verification.status}`);
    res.status(200).json({ message: "OTP sent successfully", status: verification.status });
  } catch (error) {
    console.error(`Error sending OTP to +91${phone}:`, error);
    res.status(500).json({ 
      message: "Failed to send OTP", 
      error: error.message,
      code: error.code || 'unknown'
    });
  }
};

exports.verifyOTP = async (req, res) => {
  const { phone, code } = req.body;
  
  console.log(`Verifying OTP for +91${phone}, code: ${code}`);
  
  if (!phone || !code) {
    console.log(`Missing required fields: phone=${phone}, code=${code ? 'provided' : 'missing'}`);
    return res.status(400).json({ message: "Phone number and OTP code are required" });
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: `+91${phone}`, code });

    console.log(`Verification result for +91${phone}: ${verificationCheck.status}`);

    if (verificationCheck.status === "approved") {
      try {
        console.log(`Checking if user exists with phone: ${phone}`);
        let user = await User.findOne({ phone });
        
        if (!user) {
          console.log(`Creating new user with phone: ${phone}`);
          
          try {
            const newUser = new User({ phone });
            user = await newUser.save();
            console.log(`New user created successfully with ID: ${user._id}`);
          } catch (dbError) {
            console.error(`Error creating new user with phone ${phone}:`, dbError);
            
            if (dbError.code === 11000) {
              console.log(`Duplicate key error - trying to fetch user again`);
              user = await User.findOne({ phone });
              if (user) {
                console.log(`Successfully retrieved user after duplicate key error`);
              } else {
                return res.status(500).json({ 
                  message: "Database conflict error", 
                  error: "User exists but couldn't be retrieved" 
                });
              }
            } else {
              return res.status(500).json({ 
                message: "Failed to create user", 
                error: dbError.message,
                code: dbError.code || 'unknown'
              });
            }
          }
        } else {
          console.log(`Existing user found with ID: ${user._id}`);
        }

        res.status(200).json({ 
          message: "Phone verified successfully", 
          user: {
            _id: user._id,
            phone: user.phone,
            name: user.name || '',
            email: user.email || '',
            age: user.age || null,
            createdAt: user.createdAt
          }
        });
      } catch (userError) {
        console.error(`Database error during user operations for phone ${phone}:`, userError);
        res.status(500).json({ 
          message: "Database error during user verification", 
          error: userError.message 
        });
      }
    } else {
      console.log(`Invalid OTP for phone +91${phone}`);
      res.status(400).json({ 
        message: "Invalid OTP", 
        status: verificationCheck.status 
      });
    }
  } catch (error) {
    console.error(`Error verifying OTP for +91${phone}:`, error);
    res.status(500).json({ 
      message: "OTP verification failed", 
      error: error.message,
      code: error.code || 'unknown'
    });
  }
};

exports.getUser = async (req, res) => {
  const { phone } = req.params;
  console.log(`Getting user data for phone: ${phone}`);
  
  try {
    const user = await User.findOne({ phone });
    
    if (!user) {
      console.log(`User not found for phone: ${phone}`);
      return res.status(404).json({ message: "User not found" });
    }
    
    console.log(`User found for phone ${phone}: ${user._id}`);
    res.status(200).json({
      _id: user._id,
      phone: user.phone,
      name: user.name || '',
      email: user.email || '',
      age: user.age || null,
      createdAt: user.createdAt
    });
  } catch (err) {
    console.error(`Error fetching user for phone ${phone}:`, err);
    res.status(500).json({ message: "Failed to retrieve user", error: err.message });
  }
};
