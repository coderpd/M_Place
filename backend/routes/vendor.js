const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure db connection is correct

router.get("/get-vendor/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ message: "Invalid vendor ID" });
    }

    const [vendor] = await db.query("SELECT * FROM vendorsignup WHERE id = ?", [id]);

    if (!vendor || vendor.length === 0) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.status(200).json({ success: true, vendor: vendor[0] });
  } catch (error) {
    console.error("Error fetching vendor:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
