const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { sendOTP } = require("../utils/mailer");

const router = express.Router();
let otpStore = {};

// OTP Generation
router.post("/customer-sendotp", async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  const otp = Math.floor(1000 + Math.random() * 9000); // Generate 4-digit OTP

  try {
    await sendOTP(email, otp);
    console.log(`Generated OTP for ${email}: ${otp}`);

    // Store OTP with expiry time
    otpStore[email] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 }; // Expires in 5 minutes

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Register User
router.post("/Customer-signup", async (req, res) => {
  try {
    const {
      companyName, registrationNumber,companyWebsite, gstNumber, firstName, lastName,
      phoneNumber, email, otp, address, country, state, city, postalCode, password
    } = req.body;

    const [rows] = await db.query("SELECT * FROM customersignup WHERE email = ?", [email]);
    if (rows.length > 0) return res.status(400).json({ message: "Email already exists" });

    if (!otp) return res.status(400).json({ message: "OTP is required." });

    
    if (!otpStore[email]) {
      return res.status(400).json({ message: "OTP expired or not found" });
    }

    console.log(`Stored OTP for ${email}: ${otpStore[email].otp}`);
    console.log(`Entered OTP: ${otp}`);

    if (Number(otpStore[email].otp) !== Number(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }


    // delete otpStore[email];

    if (!password) return res.status(400).json({ message: "Password is required" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO customersignup (companyName, registrationNumber,companyWebsite, gstNumber, firstName, lastName, 
        phoneNumber, email, address, country, state, city, postalCode, password) 
       VALUES (?, ?, ?, ? , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [companyName, registrationNumber,companyWebsite, gstNumber, firstName, lastName, phoneNumber,
       email, address, country, state, city, postalCode, hashedPassword]
    );

    console.log("Inserted data:", result);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
