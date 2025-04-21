const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const router = express.Router();

// Existing POST endpoint for creating users
router.post("/customerUser", async (req, res) => {
  try {
    const { companyName, personName, contactNumber, Email, password, adminID } =
      req.body;

    // Validate required fields
    if (!adminID) {
      return res.status(400).json({ message: "Admin ID is required" });
    }

    const [rows] = await db.query(
      "SELECT * FROM customerusersignup WHERE Email = ?",
      [Email]
    );

    if (rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO customerusersignup (companyName, personName, contactNumber, Email, password, adminID) VALUES (?, ?, ?, ?, ?, ?)`,
      [companyName, personName, contactNumber, Email, hashedPassword, adminID]
    );

    return res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Existing GET endpoint for user profiles
router.post("/user-profile", async (req, res) => {
  const { adminID } = req.body;

  if (!adminID) {
    return res.status(400).json({ message: "vendorId is required" });
  }

  try {
    const [users] = await db.query(
      `SELECT id, companyName, personName, Email, contactNumber, status, 
   created_at AS createdAt
   FROM customerusersignup 
   WHERE adminID = ?`,
      [adminID]
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching vendor users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Existing DELETE endpoint
router.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM customerusersignup WHERE id = ?", [id]);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
});

// NEW PUT endpoint for editing users
router.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { companyName, personName, Email, contactNumber, status } = req.body; // Added status

    // Validate required fields
    if (!companyName || !personName || !Email || !contactNumber || !status) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if email is already taken by another user
    const [existingUser] = await db.query(
      "SELECT * FROM customerusersignup WHERE Email = ? AND id != ?",
      [Email, id]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Email already in use by another user" });
    }

    // Update user - added status to the query
    await db.query(
      `UPDATE customerusersignup 
       SET companyName = ?, personName = ?, Email = ?, contactNumber = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [companyName, personName, Email, contactNumber, status, id]
    );

    // Get the updated user to return
    const [updatedUser] = await db.query(
      "SELECT * FROM customerusersignup WHERE id = ?",
      [id]
    );

    if (updatedUser.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser[0],
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Server error while updating user",
      error: error.message,
    });
  }
});

router.get("/recent-activity", async (req, res) => {
  const { adminID } = req.query;

  if (!adminID) {
    return res.status(400).json({ message: "adminID is required" });
  }

  try {
    const [activity] = await db.query(
      `SELECT id, companyName, personName, Email, contactNumber, status, 
              created_at, updated_at,
              COALESCE(updated_at, created_at) AS activity_time 
       FROM customerusersignup 
       WHERE adminID = ? 
       ORDER BY activity_time DESC 
       LIMIT 7`,
      [adminID]
    );
    res.status(200).json(activity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({
      message: "Failed to fetch recent activity",
      error: error.message,
    });
  }
});

router.get("/new-users-summary", async (req, res) => {
  const { adminID } = req.query;

  if (!adminID) {
    return res.status(400).json({ message: "adminID is required" });
  }

  try {
    const [result] = await db.query(
      `SELECT
         COUNT(*) AS total,
         SUM(YEARWEEK(created_at, 1) = YEARWEEK(CURDATE(), 1)) AS weekCount,
         SUM(YEAR(created_at) = YEAR(CURDATE()) AND MONTH(created_at) = MONTH(CURDATE())) AS monthCount
       FROM customerusersignup
       WHERE adminID = ?`,
      [adminID]
    );

    res.status(200).json({
      total: result[0].total,
      week: result[0].weekCount,
      month: result[0].monthCount,
    });
  } catch (error) {
    console.error("Error fetching user summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/monthly-new-users", async (req, res) => {
  const { adminID } = req.query;

  if (!adminID) {
    return res.status(400).json({ message: "adminID is required" });
  }

  try {
    const [rows] = await db.query(
      `SELECT 
        MONTH(created_at) AS month, 
        COUNT(*) AS count
       FROM customerusersignup
       WHERE adminID = ?
       GROUP BY MONTH(created_at)
       ORDER BY month ASC`,
      [adminID]
    );

    // Extract months and counts
    const months = rows.map(row => row.month);
    const counts = rows.map(row => row.count);

    res.status(200).json({ 
      monthlyCounts: counts,
      months: months
    });
  } catch (error) {
    console.error("Error fetching monthly new users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Add this endpoint to your backend router
router.get("/company-name/:adminID", async (req, res) => {
  try {
    const { adminID } = req.params;

    const [rows] = await db.query(
      "SELECT companyName FROM customersignup WHERE id = ?",
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
