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

//uploads directory 
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Uploads directory created.");
}

//  image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

/* ========================= PRODUCTS API ========================= */

//Add a new one
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

//  Get all products
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

// Get 
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

    res.status(200).json(result[0]); // Send single product details
  });
});

// Update
app.put("/api/products/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, price, brand, company, category, description } = req.body;
  const newImage = req.file ? req.file.filename : null;

  db.query("SELECT image FROM products WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error fetching product:", err);
      return res.status(500).json({ error: "Error fetching product." });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const oldImage = result[0].image;
    const finalImage = newImage || oldImage;

    const query = `UPDATE products SET name = ?, price = ?, brand = ?, company = ?, category = ?, description = ?, image = ? WHERE id = ?`;

    db.query(query, [name, price, brand, company, category, description, finalImage, id], (err) => {
      if (err) {
        console.error("❌ Error updating product:", err);
        return res.status(500).json({ error: "Error updating product." });
      }
      res.status(200).json({ message: "✅ Product updated successfully!" });
    });
  });
});

//  Delete 
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT image FROM products WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error fetching product:", err);
      return res.status(500).json({ error: "Error fetching product." });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const imagePath = result[0].image ? path.join(__dirname, "uploads", result[0].image) : null;

    db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
      if (err) {
        console.error("❌ Error deleting product:", err);
        return res.status(500).json({ error: "Error deleting product." });
      }

      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      res.status(200).json({ message: "✅ Product deleted successfully!" });
    });
  });
});

/* ========================= NOTIFICATIONS API ========================= */

// ✅ Notify Vendor
app.post("/api/notifyVendor", (req, res) => {
  const { cart } = req.body;

  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty" });
  }

  const query = "INSERT INTO notifications (product_id, company, message, read_status) VALUES ?";
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
  const { company } = req.params.trim();
  const query = "SELECT * FROM notifications WHERE LOWER(company) = LOWER(?) ORDER BY created_at DESC";

  db.query(query, [company], (err, results) => {
    if (err) {
      console.error("❌ Error fetching notifications:", err);
      return res.status(500).json({ error: "Error fetching notifications." });
    }
    res.status(200).json(results);
  });
});

// ✅ Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
