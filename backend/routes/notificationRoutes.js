const express = require("express");
const router = express.Router();
const db = require("../db"); // Ensure this points to your DB connection

// Store notification when customer clicks "Notify Vendor"
// Store notification when customer clicks "Notify Vendor"
router.post("/add", async (req, res) => {
    const { product_id, vendor_id, message } = req.body;
  
    if (!product_id || !vendor_id || !message) {
      return res.status(400).json({ error: "All fields (product_id, vendor_id, message) are required" });
    }
  
    try {
      const sql = "INSERT INTO notifications (product_id, vendor_id, message, read_status, created_at) VALUES (?, ?, ?, ?, NOW())";
      await db.query(sql, [product_id, vendor_id, message, 0]); // Assuming 0 for unread status
      
      return res.status(201).json({ success: true, message: "Notification added successfully!" });
    } catch (error) {
      console.error("Error adding notification:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
module.exports = router;
