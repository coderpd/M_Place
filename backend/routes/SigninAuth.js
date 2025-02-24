const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");

const router = express.Router();

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check in vendor table only
    const [vendorRows] = await db.query(
      "SELECT * FROM vendorsignup WHERE officialEmail = ?",
      [email]
    );

    if (vendorRows.length > 0) {
      const vendor = vendorRows[0];
      const isMatch = await bcrypt.compare(password, vendor.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }

      return res.status(200).json({
        message: "Login successful",
        userType: "vendor",
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

    // If vendor not found
    return res.status(400).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Sign-in Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
