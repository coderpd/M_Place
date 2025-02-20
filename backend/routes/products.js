const express = require("express");
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});
const upload = multer({ storage });

// Add Product (with image upload)
router.post("/add-product", upload.single("productImage"), async (req, res) => {
  const { vendor_id, productName, brand, category, price, seller, description } = req.body;
  const productImage = req.file ? req.file.filename : null;

  try {
    const [result] = await db.query(
      `INSERT INTO products (vendor_id, productName, brand, category, price, seller, productImage, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [vendor_id, productName, brand, category, price, seller, productImage, description]
    );

    res.status(201).json({ message: "Product added successfully", productId: result.insertId });
  } catch (error) {
    console.error("Add Product Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get Products by Vendor ID
router.get("/get-products/:vendorId", async (req, res) => {
  const { vendorId } = req.params;

  try {
    const [products] = await db.query(`SELECT * FROM products WHERE vendor_id = ?`, [vendorId]);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Product
router.delete('/delete-product/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [productId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Product not found!' });
    }

    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Update Product (with optional image upload)
router.put("/update-product/:id", upload.single("productImage"), async (req, res) => {
  const productId = req.params.id;
  const { productName, brand, category, price, seller, description } = req.body;

  console.log("Received fields:", req.body);
  console.log("Received file:", req.file);

  try {
    // Fetch existing product for the current image
    const [existingProduct] = await db.query(`SELECT * FROM products WHERE id = ?`, [productId]);

    if (existingProduct.length === 0) {
      return res.status(404).json({ message: "Product not found!" });
    }

    const productImage = req.file ? req.file.filename : existingProduct[0].productImage;

    const [result] = await db.execute(
      `UPDATE products 
       SET productName = ?, brand = ?, category = ?, price = ?, seller = ?, description = ?, productImage = ? 
       WHERE id = ?`,
      [productName, brand, category, price, seller, description, productImage, productId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({ message: "Product updated successfully!" });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Get Product by ID
router.get("/get-product/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [product] = await db.query(`SELECT * FROM products WHERE id = ?`, [id]);

    if (product.length === 0) {
      return res.status(404).json({ message: "Product not found!" });
    }

    res.status(200).json({ product: product[0] });
  } catch (error) {
    console.error("Fetch Product by ID Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
