const express = require("express");
const db = require("../db");

const router = express.Router();

// 🛒 Add to Cart (Customer-Specific)
router.post("/add-to-cart", async (req, res) => {
  const { customer_id, product_id, quantity } = req.body;

  try {
    // Check if the product already exists in the customer's cart
    const [existingItem] = await db.query(
      "SELECT * FROM cart WHERE customer_id = ? AND product_id = ?",
      [customer_id, product_id]
    );

    if (existingItem.length > 0) {
      // If product exists, update quantity
      await db.execute(
        "UPDATE cart SET quantity = quantity + ? WHERE customer_id = ? AND product_id = ?",
        [quantity, customer_id, product_id]
      );
      return res.status(200).json({ message: "Cart updated successfully!" });
    } else {
      // If product does not exist, add new entry
      await db.execute(
        "INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, ?)",
        [customer_id, product_id, quantity]
      );
      return res.status(201).json({ message: "Product added to cart!" });
    }
  } catch (error) {
    console.error("Add to Cart Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🛍 Get Cart Items for a Specific Customer
router.get("/get-cart/:customerId", async (req, res) => {
  try {
    const [cartItems] = await db.query(
      `SELECT cart.id, cart.quantity, 
              products.productName, products.price, products.productImage 
       FROM cart 
       JOIN products ON cart.product_id = products.id 
       WHERE cart.customer_id = ?`,
      [req.params.customerId]
    );

    res.status(200).json({ cart: cartItems });
  } catch (error) {
    console.error("Fetch Cart Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ❌ Remove Item from Cart
router.delete("/remove-from-cart/:customerId/:productId", async (req, res) => {
  try {
    const { customerId, productId } = req.params;
    await db.execute("DELETE FROM cart WHERE customer_id = ? AND product_id = ?", [customerId, productId]);
    res.status(200).json({ message: "Item removed from cart!" });
  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🔄 Update Cart Item Quantity
router.put("/update-cart", async (req, res) => {
  const { customer_id, product_id, quantity } = req.body;

  try {
    await db.execute(
      "UPDATE cart SET quantity = ? WHERE customer_id = ? AND product_id = ?",
      [quantity, customer_id, product_id]
    );
    res.status(200).json({ message: "Cart item updated successfully!" });
  } catch (error) {
    console.error("Update Cart Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 🗑 Clear Cart for a Customer
router.delete("/clear-cart/:customerId", async (req, res) => {
  try {
    await db.execute("DELETE FROM cart WHERE customer_id = ?", [req.params.customerId]);
    res.status(200).json({ message: "Cart cleared successfully!" });
  } catch (error) {
    console.error("Clear Cart Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
