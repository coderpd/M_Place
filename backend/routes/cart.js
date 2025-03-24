const express = require("express");
const db = require("../db");
const router = express.Router();

// Fetch cart items
router.get("/:customerId", async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const query = `
      SELECT cart.id, cart.product_id, cart.quantity, products.productName, products.price, products.productImage, products.vendor_id
      FROM cart
      JOIN products 
      ON cart.product_id = products.id
      WHERE cart.customer_id = ?
    `;
    const [cartItems] = await db.query(query, [customerId]);
    res.status(200).json({ cartItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ error: "Failed to fetch cart items" });
  }
});

// Add item to cart
router.post("/add", async (req, res) => {
  const { customerId, productId, quantity } = req.body;

  if (!customerId || !productId || !quantity) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // Check if product exists in cart
    const [existingItem] = await db.query(
      "SELECT * FROM cart WHERE customer_id = ? AND product_id = ?",
      [customerId, productId]
    );

    if (existingItem.length > 0) {
      const newQuantity = existingItem[0].quantity + quantity;
      await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [newQuantity, existingItem[0].id]);
      return res.status(200).json({ success: true, message: "Cart updated successfully" });
    }

    // Insert new item
    await db.query("INSERT INTO cart (customer_id, product_id, quantity) VALUES (?, ?, ?)", 
      [customerId, productId, quantity]);

    res.status(201).json({ success: true, message: "Item added to cart" });

  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// Update cart item quantity
router.put("/update", async (req, res) => {
  const { cartId, action } = req.body;

  try {
    const [cartItem] = await db.query("SELECT * FROM cart WHERE id = ?", [
      cartId,
    ]);

    if (!cartItem.length)
      return res.status(404).json({ message: "Item not found" });

    let updatedQuantity = cartItem[0].quantity;
    if (action === "increment") updatedQuantity += 1;
    if (action === "decrement" && updatedQuantity > 1) updatedQuantity -= 1;

    await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [
      updatedQuantity,
      cartId,
    ]);
    res.status(200).json({ success: true, message: "Cart item updated." });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete cart item
router.delete("/delete/:cartId", async (req, res) => {
  const { cartId } = req.params;

  try {
    const [cartItem] = await db.query("SELECT * FROM cart WHERE id = ?", [
      cartId,
    ]);

    if (!cartItem.length)
      return res.status(404).json({ message: "Item not found" });

    await db.query("DELETE FROM cart WHERE id = ?", [cartId]);
    res.status(200).json({ success: true, message: "Item removed." });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;