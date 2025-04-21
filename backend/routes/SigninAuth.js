const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const router = express.Router();
const JWT_SECRET = "your_secret_key"; // Replace with a secure secret key

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check in Vendor Admin table
    let [vendorRows] = await db.query(
      "SELECT * FROM vendorsignup WHERE email = ?",
      [email]
    );

    if (vendorRows.length > 0) {
      const vendor = vendorRows[0];
      const isMatch = await bcrypt.compare(password, vendor.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: vendor.id, userType: "vendor-admin" },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login successful",
        userType: "vendor-admin",
        user: vendor,
        token,
      });
    }

    // 2. Check in Customer Admin table
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

      const token = jwt.sign(
        { id: customer.id, userType: "customer-admin" },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login successful",
        userType: "customer-admin",
        user: customer,
        token,
      });
    }

    // 3. Check in Vendor User table
    let [vendorUserRows] = await db.query(
      "SELECT * FROM vendorusersignup WHERE Email = ?",
      [email]
    );

    if (vendorUserRows.length > 0) {
      const vendorUser = vendorUserRows[0];
      const isMatch = await bcrypt.compare(password, vendorUser.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: vendorUser.id, userType: "vendor-user" },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login successful",
        userType: "vendor-user",
        user: vendorUser,
        token,
      });
    }


     // 4. Check in Vendor User table
     let [customerusersignup] = await db.query(
      "SELECT * FROM customerusersignup WHERE Email = ?",
      [email]
    );

    if (customerusersignup.length > 0) {
      const customerUser = customerusersignup[0];
      const isMatch = await bcrypt.compare(password, customerUser.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: customerUser.id, userType: "customer-user" },
        JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Login successful",
        userType: "customer-user",
        user: customerUser,
        token,
      });
    }

    // Optionally, handle customer users here too if needed in future

    return res.status(400).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Sign-in Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;