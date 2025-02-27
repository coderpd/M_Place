const express = require("express");
const pool = require("../db");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config();
const {sendConfirmationEmail}=require("../utils/mailer");



// API route to handle contact form submission
router.post("/contactus", async (req, res) => {
  const { name, email, comment } = req.body;

  // Validation
  if (!name || !email || !comment) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    // Store the contact form data in the database
    const [rows] = await pool.query(
      "INSERT INTO contact_us (name, email, comment) VALUES (?, ?, ?)",
      [name, email, comment]
    );

    // Send confirmation email to the user
    await sendConfirmationEmail(name,email);

    // Respond back with success
    res.status(200).json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Error storing contact form data:", error);
    res.status(500).json({ message: "Something went wrong. Please try again." });
  }
});

module.exports = router;



// Update customer profile
// router.post("/update-profile", async (req, res) => {
//   const {
//     id, companyName, registrationNumber, gstNumber,
//     firstName, lastName, phoneNumber, email, address, 
//     country, state, city, postalCode
//   } = req.body;

//   try {
//     // Ensure all required fields are provided
//     if (!id || !firstName || !lastName || !email || !phoneNumber || !address || !country ||!state || !city || !postalCode
//       || !companyName ||!registrationNumber || !gstNumber
//     ) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // SQL query to update the customer profile
//     const updateQuery = `
//       UPDATE customersignup 
//       SET companyName = ?, registrationNumber = ?, gstNumber = ?, firstName = ?, lastName = ?, 
//           phoneNumber = ?, email = ?, address = ?, country = ?, state = ?, city = ?, postalCode = ?
//       WHERE id = ?
//     `;

//     // Execute query
//     const [result] = await db.query(updateQuery, [
//       companyName, registrationNumber, gstNumber, firstName, lastName, 
//       phoneNumber, email, address, country, state, city, postalCode, id
//     ]);

//     if (result.affectedRows > 0) {
//       // Fetch the updated customer details
//       const [rows] = await db.query("SELECT * FROM customersignup WHERE id = ?", [id]);
//       const updatedCustomer = rows.length > 0 ? rows[0] : null;

//       return res.status(200).json({
//         message: "Profile updated successfully",
//         customer: updatedCustomer,
//       });
//     } else {
//       return res.status(400).json({ message: "Failed to update profile" });
//     }
//   } catch (error) {
//     console.error("Update profile error:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// });