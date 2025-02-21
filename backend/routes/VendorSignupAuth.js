
const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const { sendOTP } = require("../utils/mailer");

const router = express.Router();

let otpStore = {};
//vendor signup
router.post("/vendor-signup", async (req, res) => {
  console.log(req.body);
  try {
    const { companyName, registrationNumber, companyWebsite, gstNumber, firstName, lastName,
            phoneNumber, officialEmail, otp, address, country, state, city, postalCode, password } = req.body;

    
    const [rows] = await db.query("SELECT * FROM vendorsignup WHERE officialEmail = ?", [officialEmail]);
    if (rows.length > 0) return res.status(400).json({ message: "Email already exists" });
    
    if (!otp) {
      return res.status(400).json({ message: "OTP is required." });
    }

    otpStore[officialEmail] = otp;
  
    console.log(`Stored OTP for ${officialEmail}: ${otpStore[officialEmail]}`);
    console.log(`Entered OTP: ${otp}`);

    
    if (otpStore[officialEmail] !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    
 
    if (!password) return res.status(400).json({ message: "Password is required" });

    
    const hashedPassword = await hash(password, 10);

   
    const result = await db.query(
      `INSERT INTO vendorsignup (companyName, registrationNumber, companyWebsite, gstNumber, firstName, lastName, 
        phoneNumber, officialEmail, address, country, state, city, postalCode, password) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [companyName, registrationNumber, companyWebsite, gstNumber, firstName, lastName, phoneNumber,
       officialEmail, address, country, state, city, postalCode, hashedPassword] // otp removed from values
    );

    console.log("Inserted data:", result);
    res.status(201).json({ message: "Vendor registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/vendor-sendotp", async (req, res) => {
  console.log("Received Request Body:", req.body);

  const { officialEmail } = req.body;

  if (!officialEmail) {
    return res.status(400).json({ error: "Email is required" });
  }


  const otp = Math.floor(1000 + Math.random() * 9000);

  try {
    await sendOTP(officialEmail, otp);

  
    console.log(`Generated OTP for ${officialEmail}: ${otp}`);

    otpStore[officialEmail] = otp;

    res.json({ success: true, message: "OTP sent successfully!" });
  } catch (error) {
    console.error("OTP Error:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});
module.exports=router
