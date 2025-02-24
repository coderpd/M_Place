const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve images

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "products_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error: ", err);
    return;
  }
  console.log("✅ Connected to MySQL database.");
});

// Uploads directory
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Uploads directory created.");
}

// Image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// ========================= PRODUCTS API =========================

// Add a new product
app.post("/api/products", upload.single("image"), (req, res) => {
  const { name, price, brand, company, category, description } = req.body;
  const image = req.file ? req.file.filename : null;

  const query =
    "INSERT INTO products (name, price, brand, company, category, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(query, [name, price, brand, company, category, description, image], (err, result) => {
    if (err) {
      console.error("❌ Database insertion error:", err);
      return res.status(500).json({ error: "Error adding product." });
    }

    res.status(200).json({
      id: result.insertId,
      name,
      price,
      brand,
      company,
      category,
      description,
      image: image ? `/uploads/${image}` : null,
    });
  });
});

// Get all products
app.get("/api/products", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, result) => {
    if (err) {
      console.error("❌ Error fetching products:", err);
      return res.status(500).json({ error: "Error fetching products." });
    }
    res.status(200).json(result);
  });
});

// Get product by ID
app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM products WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error fetching product:", err);
      return res.status(500).json({ error: "Error fetching product." });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json(result[0]);
  });
});

// ========================= NOTIFICATIONS API =========================

// ✅ Notify Vendor
app.post("/api/notifyVendor", (req, res) => {
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

  db.query(query, [values], (err) => {
    if (err) {
      console.error("❌ Error inserting notification:", err);
      return res.status(500).json({ error: "Error sending notification." });
    }
    res.status(200).json({ message: "✅ Vendor notified successfully!" });
  });
});

// ✅ Fetch Vendor Notifications
app.get("/api/notifications/:company", (req, res) => {
  const { company } = req.params;
  const query = "SELECT * FROM notifications WHERE LOWER(company) = LOWER(?) ORDER BY created_at DESC";

  db.query(query, [company], (err, results) => {
    if (err) {
      console.error("❌ Error fetching notifications:", err);
      return res.status(500).json({ error: "Error fetching notifications." });
    }
    res.status(200).json(results);
  });
});


// app.get("/api/notifications/")

// ✅ Mark All Notifications as Read for a Company
app.put('/api/markAllNotificationsAsRead/:company', (req, res) => {
  const { company } = req.params; // Get the company from URL parameter

  // Query to update all notifications for the given company where read_status is 0 (unread)
  const query = "UPDATE notifications SET read_status = 1 WHERE company = ? AND read_status = 0";

  db.query(query, [company], (err, result) => {
    if (err) {
      console.error("❌ Error marking notifications as read:", err);
      return res.status(500).json({ error: "Error updating notifications." });
    }
cancelAnimationFrame
    // If no rows were affected, that means there were no unread notifications to mark as read
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No unread notifications found." });
    }

    // Return success message with the number of notifications marked as read
    res.status(200).json({ message: `${result.affectedRows} notifications marked as read!` });
  });
});


// ✅ Dismiss (Delete) a Notification
app.delete("/api/notifications/:id", (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM notifications WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting notification:", err);
      return res.status(500).json({ error: "Error deleting notification." });
    }
    res.status(200).json({ message: "✅ Notification dismissed successfully!" });
  });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
const CustomerEdit=require("./routes/customer");
app.use("/",CustomerEdit)