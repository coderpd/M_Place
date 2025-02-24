const express = require("express");
const router = express.Router();
const db = require("../db"); // Your MySQL database connection

router.get("/customer-profile", async (req, res) => {
    const { email } = req.query; // Get email from query params

    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const [rows] = await db.query("SELECT * FROM customers WHERE email = ?", [email]);
        
        if (rows.length === 0) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.json(rows[0]); // Return the customer details
    } catch (error) {
        console.error("Error fetching customer details:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
