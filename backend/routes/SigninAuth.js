// Backend (Express + JWT + Bcrypt)
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();
const SECRET_KEY = "your_secret_key"; // Replace with a strong secret

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1️⃣ Check if the user is a Vendor
    const [vendorRows] = await db.query(
      "SELECT id, firstName, lastName, companyName, officialEmail, phoneNumber, password FROM vendorsignup WHERE officialEmail = ?",
      [email]
    );

    if (vendorRows.length > 0) {
      const vendor = vendorRows[0];
      const isMatch = await bcrypt.compare(password, vendor.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: vendor.id, userType: "vendor" }, SECRET_KEY, { expiresIn: "1h" });

      return res.status(200).json({
        message: "Login successful",
        userType: "vendor",
        token,
        user: {
          id: vendor.id,
          firstName: vendor.firstName,
          lastName: vendor.lastName,
          companyName: vendor.companyName,
          officialEmail: vendor.officialEmail,
          phoneNumber: vendor.phoneNumber,
        },
      });
    }

    // 2️⃣ Check if the user is a Customer
    const [customerRows] = await db.query(
      "SELECT id, firstName, lastName, email, phoneNumber, password FROM customersignup WHERE email = ?",
      [email]
    );

    if (customerRows.length > 0) {
      const customer = customerRows[0];
      const isMatch = await bcrypt.compare(password, customer.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      const token = jwt.sign({ id: customer.id, userType: "customer" }, SECRET_KEY, { expiresIn: "1h" });

      return res.status(200).json({
        message: "Login successful",
        userType: "customer",
        token,
        user: {
          id: customer.id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          phoneNumber: customer.phoneNumber,
        },
      });
    }

    return res.status(400).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Sign-in Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;