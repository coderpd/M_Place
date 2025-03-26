const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const JWT_SECRET = "your_secret_key"; // Replace with a secure secret key

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check in vendor table first
    let [vendorRows] = await db.query(
      "SELECT * FROM vendorsignup WHERE officialEmail = ?",
      [email]
    );

    if (vendorRows.length > 0) {
      const vendor = vendorRows[0];
      const isMatch = await bcrypt.compare(password, vendor.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: vendor.id, userType: "vendor" },
        JWT_SECRET,
        { expiresIn: "1h" } // Token valid for 1 hour
      );

      return res.status(200).json({
        message: "Login successful",
        userType: "vendor",
        user: {
          id: vendor.id,
          name: vendor.name,
          email: vendor.officialEmail,
          phone: vendor.phone,
        },
        token,
      });
    }

    // If not vendor, check customer table
    let [customerRows] = await db.query(
      "SELECT * FROM customersignup WHERE email = ?",
      [email]
    );

    if (customerRows.length > 0) {
      const customer = customerRows[0];
      const isMatch = await bcrypt.compare(password, customer.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign({ id: customer.id, userType: "customer" }, JWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        message: "Login successful",
        userType: "customer",
        user: customer,
        token,
      });
    }

    return res.status(400).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("🚨 Sign-in Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
