const express = require("express");
const db = require("../db");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Setup multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Add Product
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
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get Products (ALL)
router.get("/get-products/all", async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products");

    console.log("🛠️ Retrieved Products:", products); // Debugging

    if (products.length === 0) {
      console.warn("⚠️ No products found in the database!");
      return res.status(200).json({ products: [] }); // Send empty array instead of undefined
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error("🚨 Fetch All Products Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get Products by Vendor ID
router.get("/get-products/:vendorId", async (req, res) => {
  try {
    const [products] = await db.query("SELECT * FROM products WHERE vendor_id = ?", [req.params.vendorId]);

    if (products.length === 0) {
      console.warn(`⚠️ No products found for vendor ${req.params.vendorId}`);
      return res.status(200).json({ products: [] });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error("Fetch Products Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete Product
router.delete("/delete-product/:id", async (req, res) => {
  try {
    const [existingProduct] = await db.query("SELECT productImage FROM products WHERE id = ?", [req.params.id]);
    if (existingProduct.length === 0) return res.status(404).json({ message: "Product not found!" });

    if (existingProduct[0].productImage) {
      fs.unlinkSync(path.join("uploads", existingProduct[0].productImage));
    }

    const [result] = await db.execute("DELETE FROM products WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Product not found!" });
    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Update Product
router.put("/update-product/:id", upload.single("productImage"), async (req, res) => {
  try {
    const { productName, brand, category, price, seller, description } = req.body;
    const [existingProduct] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (existingProduct.length === 0) return res.status(404).json({ message: "Product not found!" });

    let productImage = existingProduct[0].productImage;
    if (req.file) {
      if (productImage) fs.unlinkSync(path.join("uploads", productImage));
      productImage = req.file.filename;
    }

    await db.execute(
      `UPDATE products SET productName = ?, brand = ?, category = ?, price = ?, seller = ?, description = ?, productImage = ? WHERE id = ?`,
      [productName, brand, category, price, seller, description, productImage, req.params.id]
    );
    res.status(200).json({ message: "Product updated successfully!" });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// Get Product by ID
router.get("/get-product/:id", async (req, res) => {
  try {
    const [product] = await db.query("SELECT * FROM products WHERE id = ?", [req.params.id]);
    if (product.length === 0) return res.status(404).json({ message: "Product not found!" });
    res.status(200).json({ product: product[0] });
  } catch (error) {
    console.error("Fetch Product by ID Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;