const express = require("express");
const db = require("../db");

const router = express.Router();

// Get customer details by ID
// router.get("/get-customer/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [customerRows] = await db.query(
//       "SELECT * FROM customersignup WHERE id = ?",
//       [id]
//     );

//     if (customerRows.length === 0) {
//       return res.status(404).json({ message: "Customer not found" });
//     }

//     const customer = customerRows[0];

//     res.status(200).json({
//       customer: {
//         id: customer.id,
//         companyName: customer.companyName,
//         registrationNumber: customer.registrationNumber,
//         gstNumber: customer.gstNumber,
//         firstName: customer.firstName,
//         lastName: customer.lastName,
//         phoneNumber: customer.phoneNumber,
//         email: customer.email,
//         address: customer.address,
//         country: customer.country,
//         state: customer.state,
//         city: customer.city,
//         postalCode: customer.postalCode,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching customer details:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// Update customer profile
router.post("/update-profile", async (req, res) => {
  const {
    id, companyName, registrationNumber, gstNumber,
    firstName, lastName, phoneNumber, email, address, 
    country, state, city, postalCode
  } = req.body;

  try {
    // Ensure all required fields are provided
    if (!id || !firstName || !lastName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // SQL query to update the customer profile
    const updateQuery = `
      UPDATE customersignup 
      SET companyName = ?, registrationNumber = ?, gstNumber = ?, firstName = ?, lastName = ?, 
          phoneNumber = ?, email = ?, address = ?, country = ?, state = ?, city = ?, postalCode = ?
      WHERE id = ?
    `;
    
    const result = await db.query(updateQuery, [
      companyName, registrationNumber, gstNumber, firstName, lastName, 
      phoneNumber, email, address, country, state, city, postalCode, id
    ]);

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: "Profile updated successfully" });
    } else {
      return res.status(400).json({ message: "Failed to update profile" });
    }
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
