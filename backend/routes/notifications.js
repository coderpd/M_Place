const express = require("express");
const router = express.Router();
const db = require("../db");

// Save notification when customer clicks "Notify Vendor"
router.post("/notifyVendor", async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const message = `Customer has requested a quote for ${cart.length} item(s).`;

    // Assuming vendor_id is known (modify as needed)
    const vendor_id = cart[0]?.vendor_id; // Assuming each item has a vendor_id
    if (!vendor_id) return res.status(400).json({ message: "Vendor ID missing." });
    

    await db.query(
      "INSERT INTO notifications (vendor_id, message, is_read, created_at) VALUES (?, ?, ?, NOW())",
      [vendor_id, message, 0]
    );

    res.json({ message: "Notification sent to vendor successfully!" });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Fetch vendor notifications
router.get("/vendorNotifications/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const [notifications] = await db.query("SELECT * FROM notifications WHERE vendor_id = ? ORDER BY created_at DESC", [vendorId]);
    res.json({ notifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Mark notification as read
router.post("/markNotificationRead", async (req, res) => {
  try {
    const { notificationId } = req.body;
    await db.query("UPDATE notifications SET is_read = 1 WHERE id = ?", [notificationId]);
    res.json({ message: "Notification marked as read." });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
