const express = require("express");
const bcrypt = require("bcrypt");
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

    // Check if the email exists in the vendorsignup table (email field)
    const [vendorRows] = await db.query(
      "SELECT * FROM vendorsignup WHERE email = ?",
      [email]
    );
    // Check if the email exists in the customersignup table
    const [customerRows] = await db.query(
      "SELECT * FROM customersignup WHERE email = ?",
      [email]
    );
    // Check if the email exists in the customerUserSignup table
    const [customerUser] = await db.query(
      "SELECT * FROM customerusersignup WHERE Email = ?",
      [email]
    );
    // Check if the email exists in the customerUserSignup table
    const [vendorUser] = await db.query(
      "SELECT * FROM vendorusersignup WHERE Email = ?",
      [email]
    );

    // If email is not found in both tables
    if (
      customerRows.length === 0 &&
      vendorRows.length === 0 &&
      customerUser.length === 0 &&
      vendorUser.length === 0
    ) {
      return res.status(404).json({
        message:
          "Email not registered. Please sign up as a customer or vendor.",
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
    return res
      .status(500)
      .json({ error: "Failed to process request", details: error.message });
  }
});

// Forgot Password - OTP Verification
router.post("/verify-otp", async (req, res) => {
  try {
    console.log("Received request body:", req.body);
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    if (!otpStore[email]) {
      return res
        .status(400)
        .json({ error: "OTP expired or not generated for this email" });
    }

    // Check if the OTP matches the stored OTP for the email
    if (Number(otpStore[email]) !== Number(otp)) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    // OTP verified successfully, remove it from storage
    delete otpStore[email];

    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("OTP Verification Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to process request", details: error.message });
  }
});

// Forgot Password - Reset Password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: "Email, New Password, and Confirm Password are required",
      });
    }

    // Check if new password and confirm password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Check if the email belongs to the vendor or customer
    const [vendorRows] = await db.query(
      "SELECT * FROM vendorsignup WHERE email = ?",
      [email]
    );
    const [customerRows] = await db.query(
      "SELECT * FROM customersignup WHERE email = ?",
      [email]
    );
    const [customerUser] = await db.query(
      "SELECT * FROM customerusersignup WHERE Email = ?",
      [email]
    );

    const [vendorUser] = await db.query(
      "SELECT * FROM vendorusersignup WHERE Email = ?",
      [email]
    );

    if (vendorRows.length > 0) {
      // Update password for vendor
      await db.query("UPDATE vendorsignup SET password = ? WHERE email = ?", [
        hashedPassword,
        email,
      ]);
      return res.json({
        success: true,
        message: "Password reset successfully for vendor",
      });
    }

    if (vendorUser.length > 0) {
      // Update password for customer
      await db.query(
        "UPDATE vendorusersignup SET password = ? WHERE Email = ?",
        [hashedPassword, email]
      );
      return res.json({
        success: true,
        message: "Password reset successfully for customer",
      });
    }

    if (customerUser.length > 0) {
      // Update password for customer
      await db.query(
        "UPDATE customerusersignup SET password = ? WHERE Email = ?",
        [hashedPassword, email]
      );
      return res.json({
        success: true,
        message: "Password reset successfully for customer",
      });
    }
    if (customerRows.length > 0) {
      // Update password for customer
      await db.query("UPDATE customersignup SET password = ? WHERE email = ?", [
        hashedPassword,
        email,
      ]);
      return res.json({
        success: true,
        message: "Password reset successfully for customer",
      });
    }

    return res.status(404).json({ error: "Email not found in any table" });
  } catch (error) {
    console.error("Password Reset Error:", error);
    return res
      .status(500)
      .json({ error: "Failed to process request", details: error.message });
  }
});

module.exports = router;
