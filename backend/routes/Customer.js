const express = require("express");
const db = require("../db");

const router = express.Router();

// Update customer profile
router.post("/update-profile", async (req, res) => {
  const {
    id, companyName, registrationNumber, gstNumber,
    firstName, lastName, phoneNumber, email, address, 
    country, state, city, postalCode
  } = req.body;
  router.get("/customer/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // SQL query to fetch customer details by ID
    const [rows] = await db.query("SELECT * FROM customersignup WHERE id = ?", [id]);

    if (rows.length > 0) {
      const customer = rows[0];
      return res.status(200).json(customer);
    } else {
      return res.status(404).json({ message: "Customer not found" });
    }
  } catch (error) {
    console.error("Error fetching customer data:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

  try {
    // Log the received request body
    console.log("Received data:", req.body);

    // Ensure all required fields are provided
    if (!id || !firstName || !lastName || !email || !phoneNumber || !address || !country ||!state || !city || !postalCode
      || !companyName ||!registrationNumber || !gstNumber
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // SQL query to update the customer profile
    const updateQuery = `
      UPDATE customersignup 
      SET companyName = ?, registrationNumber = ?, gstNumber = ?, firstName = ?, lastName = ?, 
          phoneNumber = ?, email = ?, address = ?, country = ?, state = ?, city = ?, postalCode = ?
      WHERE id = ?
    `;

    console.log("Executing SQL Query:", updateQuery);
    console.log("Query Values:", [
      companyName, registrationNumber, gstNumber, firstName, lastName, 
      phoneNumber, email, address, country, state, city, postalCode, id
    ]);

    // Execute query
    const [result] = await db.query(updateQuery, [
      companyName, registrationNumber, gstNumber, firstName, lastName, 
      phoneNumber, email, address, country, state, city, postalCode, id
    ]);

    console.log("Update result:", result);

    if (result.affectedRows > 0) {
      // Fetch the updated customer details
      const [rows] = await db.query("SELECT * FROM customersignup WHERE id = ?", [id]);
      const updatedCustomer = rows.length > 0 ? rows[0] : null;

      console.log("Updated customer data:", updatedCustomer);

      return res.status(200).json({
        message: "Profile updated successfully",
        customer: updatedCustomer,
      });
    } else {
      return res.status(400).json({ message: "Failed to update profile" });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
