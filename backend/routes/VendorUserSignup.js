const express = require("express");
const router = express.Router();
const db = require("../db"); // your database pool
const bcrypt = require("bcryptjs");

// Add user
router.post("/add-user", async (req, res) => {
  const { companyName, personName, phoneNumber, Email, password, confirmPassword, vendorId } = req.body;

  if (!companyName || !personName || !phoneNumber || !Email || !password || !confirmPassword || !vendorId) {
    return res.status(400).json({ message: "All fields are required." });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match." });
  }

  try {
    const [existing] = await db.query("SELECT * FROM vendorusersignup WHERE Email = ?", [Email]);
    if (existing.length > 0) {
      return res.status(409).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      `INSERT INTO vendorusersignup 
      (companyName, personName, phoneNumber, Email, password, vendorId) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [companyName, personName, phoneNumber, Email, hashedPassword, vendorId]
    );

    res.status(201).json({ message: "Vendor user added successfully!" });
  } catch (error) {
    console.error("Error inserting vendor user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/users", async (req, res) => {
  const { vendorId } = req.body;

  if (!vendorId) {
    return res.status(400).json({ message: "vendorId is required" });
  }

  try {
    // Updated SQL query to include 'id'
    const [users] = await db.query(
      "SELECT id, companyName, personName, phoneNumber, Email, status,updated_at, created_at AS createdAt FROM vendorusersignup WHERE vendorId = ?",
      [vendorId]
    );
    
    // Return the fetched users with 'id'
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching vendor users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Update user
// Update user endpoint - ensure it matches frontend expectations
router.put("/update-user/:id", async (req, res) => {
  const { id } = req.params;
  const { companyName, personName, phoneNumber, Email, status } = req.body;

  if (!companyName || !personName || !phoneNumber || !Email) {
    return res.status(400).json({ 
      success: false,
      message: "All fields are required" 
    });
  }

  try {
    // Convert ID to number
    const userId = parseInt(id);
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    // Check if user exists
    const [user] = await db.query(
      "SELECT id FROM vendorusersignup WHERE id = ?",
      [userId]
    );
    
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update user
    await db.query(
      `UPDATE vendorusersignup 
       SET companyName = ?, 
           personName = ?, 
           phoneNumber = ?, 
           Email = ?,
           status = ?
       WHERE id = ?`,
      [companyName, personName, phoneNumber, Email, status, userId]
    );

    // Get updated user data
    const [updatedUser] = await db.query(
      `SELECT id, companyName, personName, phoneNumber, Email, status 
       FROM vendorusersignup 
       WHERE id = ?`,
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser[0]
    });

  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});

// Delete user endpoint
router.post("/delete-user", async (req, res) => {
  const { vendorId, userId } = req.body;

  if (!vendorId || !userId) {
    return res.status(400).json({ 
      success: false,
      message: "vendorId and userId are required" 
    });
  }

  try {
    // First check if user exists and belongs to vendor
    const [user] = await db.query(
      "SELECT id FROM vendorusersignup WHERE id = ? AND vendorId = ?",
      [userId, vendorId]
    );
    
    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found or doesn't belong to this vendor"
      });
    }

    // Then delete
    const [result] = await db.query(
      "DELETE FROM vendorusersignup WHERE id = ?",
      [userId]
    );

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    console.error("Delete error:", error);
    
    let message = "Failed to delete user";
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      message = "Cannot delete user with associated records";
    }

    res.status(500).json({
      success: false,
      message: message
    });
  }
});// Get single user by ID
router.get("/get-user/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const [result] = await db.query("SELECT * FROM vendorusersignup WHERE id = ?", [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




router.get("/get-vendors", async (req, res) => {
  try {
    const [vendors] = await db.query(`
      SELECT 
    companyName,personName,phoneNumber,Email,status,created_at AS createdAt
      FROM vendorusersignup`);
    res.status(200).json(vendors);
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/recent-activity", async (req, res) => {
  try {
    // Add authentication check
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Optionally verify the token here

    const [activity] = await db.query(`
      SELECT 
        id,
        companyName,
        personName,
        status,
        created_at as timestamp,  // Changed from createdAt to created_at
        'status_change' as actionType
      FROM vendorusersignup
      ORDER BY created_at DESC    // Changed from updatedAt to created_at
      LIMIT 5
    `);
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching activity:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Add this endpoint to your backend router
router.get("/company-name/:adminID", async (req, res) => {
  try {
    const { adminID } = req.params;

    const [rows] = await db.query(
      "SELECT companyName FROM Vendorsignup WHERE id = ?",
      [adminID]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ companyName: rows[0].companyName });
  } catch (error) {
    console.error("Error fetching admin details:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;