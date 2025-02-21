const express = require("express"); // ✅ Use `require` instead of `import`
const multer = require("multer");
const path = require("path");
const db = require("../db");



const router = express.Router();

// Upload directory setup
const uploadDir = path.join(__dirname, "../uploads");

// Configure Multer for image uploads
const storage =multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ Add a new product
router.post("/", upload.single("image"), (req, res) => {
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

// ✅ Get all products
router.get("/products", (req, res) => {
  db.query("SELECT * FROM products", (err, result) => {
    if (err) {
      console.error("❌ Error fetching products:", err);
      return res.status(500).json({ error: "Error fetching products." });
    }
    res.status(200).json(result);
  });
});

// ✅ Get product by ID
router.get("/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM products WHERE id = ?", [id], (err, result) => {
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

module.exports=router;
