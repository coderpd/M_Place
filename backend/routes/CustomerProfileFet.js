const express = require("express");
const db = require("../db"); // Ensure db.js exports a valid MySQL connection

const router = express.Router();

// Fetch customer details by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      SELECT companyName, registrationNumber, gstNumber, firstName, lastName, 
             phoneNumber, email, address, country, state, city, postalCode 
      FROM customersignup 
      WHERE id = ?
    `;

    const [result] = await db.query(query, [id]); // ✅ Corrected db.query()

    if (!result.length) {
      return res.status(404).json({ error: "Customer not found." });
    }

    res.status(200).json(result[0]); // ✅ Return first result

  } catch (error) {
    console.error("Error fetching customer details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
