const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const db = require("../db");


// Add product to cart
router.post("/add", (req, res) => {
  const { customerId, productId, quantity } = req.body;

  if (!customerId || !productId || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, ?)`;

  db.query(query, [customerId, productId, quantity], (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Failed to add product to cart" });
    }
    res.status(200).json({ success: true, message: "Product added to cart" });
  });
});

module.exports = router;
