const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { sendOTP } = require("../utils/mailer");

const router = express.Router();
let otpStore = {}; // Stores OTPs with expiration

// OTP Generation for Vendor
router.post("/vendor-sendotp", async (req, res) => {
  console.log("Received Request Body:", req.body);

  const { officialEmail } = req.body;

  if (!officialEmail) {
    return res.status(400).json({ error: "Email is required" });
  }

  const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP

  try {
    await sendOTP(officialEmail, otp);

    console.log(`Generated OTP for ${officialEmail}: ${otp}`);

    // Store OTP with an expiration time
    otpStore[officialEmail] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Vendor Signup
router.post("/vendor-signup", async (req, res) => {
  console.log(req.body);
  try {
    const { 
      companyName, registrationNumber, companyWebsite, gstNumber, firstName, lastName,
      phoneNumber, officialEmail, otp, address, country, state, city, postalCode, password 
    } = req.body;

    const [rows] = await db.query("SELECT * FROM vendorsignup WHERE officialEmail = ?", [officialEmail]);
    if (rows.length > 0) return res.status(400).json({ message: "Email already exists" });

    if (!otp) {
      return res.status(400).json({ message: "OTP is required." });
    }

    // Validate OTP
    if (!otpStore[officialEmail]) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    console.log(`Stored OTP for ${officialEmail}: ${otpStore[officialEmail].otp}`);
    console.log(`Entered OTP: ${otp}`);

    if (Number(otpStore[officialEmail].otp) !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Delete OTP after successful verification
    delete otpStore[officialEmail];

    if (!password) return res.status(400).json({ message: "Password is required" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO vendorsignup (companyName, registrationNumber, companyWebsite, gstNumber, firstName, lastName, 
        phoneNumber, officialEmail, address, country, state, city, postalCode, password) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [companyName, registrationNumber, companyWebsite, gstNumber, firstName, lastName, phoneNumber,
       officialEmail, address, country, state, city, postalCode, hashedPassword]
    );

    console.log("Inserted data:", result);
    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
