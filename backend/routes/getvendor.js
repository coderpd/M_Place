const express = require("express");
const db = require("../db");

const router = express.Router();

// Get vendor details by ID
router.get("/get-vendor/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [vendorRows] = await db.query(
      "SELECT * FROM vendorsignup WHERE id = ?",
      [id]
    );

    if (vendorRows.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const vendor = vendorRows[0];

    res.status(200).json({
      vendor: {
        id: vendor.id,
        firstName: vendor.firstName,
        lastName: vendor.lastName,
        companyName: vendor.companyName,
        officialEmail: vendor.officialEmail,
        phoneNumber: vendor.phoneNumber,
        address: vendor.address, // Added Address Field
      },
    });
  } catch (error) {
    console.error("Error fetching vendor details:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.put("/update-vendor/:id", async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  if (!id) {
    return res.status(400).json({ message: "Vendor ID is required" });
  }

  try {
    // Fetch existing vendor details
    const [existingVendor] = await db.query("SELECT * FROM vendorsignup WHERE id = ?", [id]);

    if (existingVendor.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const vendor = existingVendor[0]; // Extract vendor object

    // Merge existing values with new values (preserve old values if new ones are missing)
    const updatedData = {
      companyName: updatedFields.companyName || vendor.companyName,
      registrationNumber: updatedFields.registrationNumber || vendor.registrationNumber,
      companyWebsite: updatedFields.companyWebsite || vendor.companyWebsite,
      gstNumber: updatedFields.gstNumber || vendor.gstNumber,
      firstName: updatedFields.firstName || vendor.firstName,
      lastName: updatedFields.lastName || vendor.lastName,
      phoneNumber: updatedFields.phoneNumber || vendor.phoneNumber,
      officialEmail: updatedFields.officialEmail || vendor.officialEmail,
      address: updatedFields.address || vendor.address,
      country: updatedFields.country || vendor.country,
      state: updatedFields.state || vendor.state,
      city: updatedFields.city || vendor.city,
      postalCode: updatedFields.postalCode || vendor.postalCode,
      password: updatedFields.password || vendor.password, // Ensure hashing if required
    };

    const result = await db.query(
      `UPDATE vendorsignup 
       SET companyName = ?, registrationNumber = ?, companyWebsite = ?, gstNumber = ?, firstName = ?, 
           lastName = ?, phoneNumber = ?, officialEmail = ?, address = ?, country = ?, state = ?, 
           city = ?, postalCode = ?, password = ?
       WHERE id = ?`,
      [
        updatedData.companyName,
        updatedData.registrationNumber,
        updatedData.companyWebsite,
        updatedData.gstNumber,
        updatedData.firstName,
        updatedData.lastName,
        updatedData.phoneNumber,
        updatedData.officialEmail,
        updatedData.address,
        updatedData.country,
        updatedData.state,
        updatedData.city,
        updatedData.postalCode,
        updatedData.password,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No changes made" });
    }

    res.json({ message: "Vendor updated successfully" });
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Database error", error });
  }
});

module.exports = router;
