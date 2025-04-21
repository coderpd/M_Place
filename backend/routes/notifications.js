const express = require("express");
const router = express.Router();
const db = require("../db");

const convertToIST = (utcDateString) => {
  return new Date(utcDateString).toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
};          

router.get("/:vendorId", async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ error: "Vendor ID is required" });
    }

    const [notifications] = await db.execute(
      "SELECT id, message, created_at, status FROM notifications WHERE product_vendor_id = ?",
      [vendorId]
    );

    const formattedNotifications = notifications.map((notif) => ({
      ...notif,
      created_at: convertToIST(notif.created_at),
    }));

    res.json({ notifications: formattedNotifications });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


// Notify vendor and insert into notifications table
router.post("/notify-vendor", async (req, res) => {
  try {
    console.log("Received Request:", req.body);

    const { Email, cart } = req.body;
    if (!Email || !cart || cart.length === 0) {
      console.error("Invalid data received:", req.body);
      return res.status(400).json({ error: "Invalid data provided" });
    }

    // Fetch customer ID
    const [customerResult] = await db.query(
      "SELECT Id, personName, Email FROM customerusersignup WHERE Email = ?",
      [Email]
    );

    if (customerResult.length === 0) {
      console.error("Customer not found:", Email);
      return res.status(404).json({ error: "Customer not found" });
    }
    const customerName = customerResult[0].personName;
    const customer_id = customerResult[0].Id;
    
    const values = [];

    for (const item of cart) {
      console.log("Processing item:", item);

      if (!item.productId) {
        console.warn("Skipping item due to missing productId:", item);
        continue;
      }

      // Fetch product details (including vendor ID)
      const [productResult] = await db.query(
        "SELECT id, vendor_id, productName FROM products WHERE id = ?",
        [item.productId]
      );

      if (productResult.length === 0) {
        console.warn(`Product not found for ID: ${item.productId}`);
        continue;
      }

      const { id: productId, vendor_id: vendorId, productName } = productResult[0];

      if (!vendorId) {
        console.warn(`Vendor ID missing for product ID: ${productId}`);
        continue;
      }

      // Fetch vendor email
      const [vendorResult] = await db.query(
        "SELECT email FROM vendorusersignup WHERE id = ?",
        [vendorId]
      );

      if (vendorResult.length === 0) {
        console.warn(`Vendor not found for ID: ${vendorId}`);
        continue;
      }
      const vendorEmail = vendorResult[0].email;
       console.log(vendorEmail)
      values.push([
        customer_id,
        customerName,
        vendorId,
        productId,
        `Customer  ${customerName} wants to buy your product: ${productName} (x${item.quantity}). Contact: ${Email}`,
      ]);
    }

    if (values.length === 0) {
      console.warn("No valid notifications to insert");
      return res.status(400).json({ error: "No valid notifications to insert" });
    }

    console.log("Final values to insert:", values);

    // Insert into notifications table
    const query = `INSERT INTO notifications (customer_id,customerName, product_vendor_id, product_id, message) VALUES ?`;
    await db.query(query, [values]);

    res.status(200).json({ message: "Vendor notified successfully!" });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


router.put("/read/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = "UPDATE notifications SET status = 'read' WHERE id = ?";
    const [result] = await db.execute(query, [id]);

    if (result.affectedRows > 0) {
      return res.json({ success: true, message: "Notification marked as read" });
    } else {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
  } catch (error) {
    console.error("Error updating notification:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


router.post("/vendor-admin", async (req, res) => {
  try {
    const { vendorAdminID } = req.body;

    if (!vendorAdminID) {
      return res.status(400).json({ error: "Vendor Admin ID is required" });
    }

    const [notifications] = await db.execute(
      `SELECT 
        n.id ,
        vu.personName,
        vu.Email ,
        p.productName,
        cu.companyName,
      REPLACE(REPLACE(REGEXP_SUBSTR(n.message, '\\(x[0-9]+\\)'), '(x', ''), ')', '') AS quantity,
        p.price,
        n.created_at,
        n.status
      FROM notifications n
      JOIN products p ON n.product_id = p.id
      JOIN vendorusersignup vu ON n.product_vendor_id = vu.id
      JOIN customerusersignup cu ON n.customer_id = cu.id
      WHERE vu.vendorId = ?
      ORDER BY n.created_at DESC`,
      [vendorAdminID]
    );

    const formattedNotifications = notifications.map((notif) => ({
      ...notif,
      created_at: convertToIST(notif.created_at),
    }));

    res.json({ notifications: formattedNotifications });
  } catch (error) {
    console.error("Error fetching vendor admin notifications:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

//ordernotification
router.post("/admin", async (req, res) => {
  try {
    const { adminID } = req.body;

    if (!adminID) {
      return res.status(400).json({ error: "Admin ID is required" });
    }

    const [notifications] = await db.execute(
      `SELECT 
  n.id,
  n.customerName,
  c.Email,
  v.companyName,
  p.productName,
  n.message,
  REPLACE(REPLACE(REGEXP_SUBSTR(n.message, '\\(x[0-9]+\\)'), '(x', ''), ')', '') AS quantity,
  p.price,
  n.created_at
FROM notifications n
LEFT JOIN products p ON n.product_id = p.id
LEFT JOIN vendorusersignup v ON n.product_vendor_id = v.id
LEFT JOIN customerusersignup c ON n.customer_id = c.id
WHERE c.adminID = ?
ORDER BY n.created_at DESC;
`,
      [adminID]
    );
    console.log("Fetched notifications:", notifications.length);


    const formattedNotifications = notifications.map((notif) => ({
      ...notif,
      created_at: convertToIST(notif.created_at),
    }));

    res.json({ notifications: formattedNotifications });
  } catch (error) {
    console.error("Error fetching admin notifications:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;