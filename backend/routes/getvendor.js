const express = require("express");
const db = require("../db");

const router = express.Router();

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
      },
    });
  } catch (error) {
    console.error("Error fetching vendor details:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
