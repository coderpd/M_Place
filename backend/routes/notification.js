const express =require("express")

const db = require("../db");
const router = express.Router();

// ✅ Notify Vendor
router.post("/", (req, res) => {
  const { cart } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const query =
    "INSERT INTO notifications (product_id, company, message, read_status) VALUES ?";
  const values = cart.map((item) => [
    item.id,
    item.company,
    `Customer is interested in buying ${item.name}.`,
    false,
  ]);

  _query(query, [values], (err) => {
    if (err) {
      console.error("❌ Error inserting notification:", err);
      return res.status(500).json({ error: "Error sending notification." });
    }
    res.status(200).json({ message: "✅ Vendor notified successfully!" });
  });
});

// ✅ Fetch Vendor Notifications
router.get("/:company", (req, res) => {
  const { company } = req.params;
  const query = "SELECT * FROM notifications WHERE LOWER(company) = LOWER(?) ORDER BY created_at DESC";

  _query(query, [company], (err, results) => {
    if (err) {
      console.error("❌ Error fetching notifications:", err);
      return res.status(500).json({ error: "Error fetching notifications." });
    }
    res.status(200).json(results);
  });
});

// ✅ Mark All Notifications as Read for a Company
router.put("/markAllAsRead/:company", (req, res) => {
  const { company } = req.params;

  const query = "UPDATE notifications SET read_status = 1 WHERE company = ? AND read_status = 0";

  _query(query, [company], (err, result) => {
    if (err) {
      console.error("❌ Error marking notifications as read:", err);
      return res.status(500).json({ error: "Error updating notifications." });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No unread notifications found." });
    }

    res.status(200).json({ message: `${result.affectedRows} notifications marked as read!` });
  });
});

// ✅ Dismiss (Delete) a Notification
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  _query("DELETE FROM notifications WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting notification:", err);
      return res.status(500).json({ error: "Error deleting notification." });
    }
    res.status(200).json({ message: "✅ Notification dismissed successfully!" });
  });
});

module.exports=router;
