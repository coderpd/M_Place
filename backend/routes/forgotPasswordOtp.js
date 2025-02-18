const express = require("express");
const db = require("../db");
const { sendOTP } = require("../utils/mailer");

const router = express.Router();
let otpStore = {};

// Forgot Password - Send OTP
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

   
    // Check if the email exists in the vendorsignup table (officialEmail field)
    const [vendorRows] = await db.query("SELECT * FROM vendorsignup WHERE officialEmail = ?", [email]);
     // Check if the email exists in the customersignup table
     const [customerRows] = await db.query("SELECT * FROM customersignup WHERE email = ?", [email]);


    // If email is not found in both tables
    if (customerRows.length === 0 && vendorRows.length === 0) {
      return res.status(404).json({
        message: "Email not registered. Please sign up as a customer or vendor.",
      });
    }

    // Generate OTP
    const otp = Math.floor(1000 + Math.random() * 9000);

    // Send OTP to email
    try {
      await sendOTP(email, otp);
      otpStore[email] = otp;
      console.log(`Generated OTP for ${email}: ${otp}`);
      return res.json({ success: true, message: "OTP sent successfully!" });
    } catch (sendOtpError) {
      console.error("Error sending OTP:", sendOtpError);
      return res.status(500).json({ error: "Failed to send OTP" });
    }

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return res.status(500).json({ error: "Failed to process request", details: error.message });
  }
});

module.exports = router;
