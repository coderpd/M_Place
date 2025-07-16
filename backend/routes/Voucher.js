// routes/vouchers.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { body, validationResult } = require('express-validator');

// Get vouchers by customer admin ID
router.get('/vouchers/:adminId', async (req, res) => {
  const adminId = req.params.adminId;

  try {
    const [vouchers] = await db.query(
      `SELECT id, code, discount_percent, valid_from, valid_to, is_used, created_at
       FROM vouchers
       WHERE created_by_admin_id = ?`,
      [adminId]
    );

    res.json(vouchers);
  } catch (error) {
    console.error('Error fetching vouchers:', error);
    res.status(500).json({ message: 'Server error fetching vouchers' });
  }
});

// Get vouchers for specific customer user
router.get('/vouchers/customeruser/:customerUserId', async (req, res) => {
  const customerUserId = req.params.customerUserId;

  try {
    // Get the admin ID from customerusersignup table
    const [adminResult] = await db.query(
      'SELECT adminID FROM customerusersignup WHERE id = ?',
      [customerUserId]
    );

    if (adminResult.length === 0) {
      return res.status(404).json({ message: 'Customer user not found' });
    }

    const adminId = adminResult[0].adminID;

    // Fetch vouchers for that admin and mark which are used by the customer user
    const [vouchers] = await db.query(
      `SELECT v.id, v.code, v.discount_percent, v.valid_from, v.valid_to, v.created_at,
              CASE WHEN COUNT(vu.id) > 0 THEN 1 ELSE 0 END AS is_used
       FROM vouchers v
       LEFT JOIN voucher_usage vu 
         ON v.id = vu.voucher_id AND vu.customer_user_id = ?
       WHERE v.created_by_admin_id = ?
         AND NOW() BETWEEN v.valid_from AND v.valid_to
       GROUP BY v.id, v.code, v.discount_percent, v.valid_from, v.valid_to, v.created_at`,
      [customerUserId, adminId]
    );

    res.json(vouchers);
  } catch (error) {
    console.error('Error fetching vouchers for customer user:', error);
    res.status(500).json({ message: 'Server error fetching vouchers' });
  }
});

// Apply voucher to a purchase order
router.post('/apply-voucher', [
  body('customer_user_id').isInt().withMessage('Invalid customer user ID'),
  body('voucher_code').isString().trim().notEmpty().withMessage('Voucher code is required'),
  body('po_id').isInt().withMessage('Invalid purchase order ID')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { customer_user_id, voucher_code, po_id } = req.body;

  try {
    // 1. Get adminID of this customer user
    const [adminResult] = await db.query(
      'SELECT adminID FROM customerusersignup WHERE id = ?',
      [customer_user_id]
    );
    if (adminResult.length === 0) {
      return res.status(404).json({ message: 'Customer user not found' });
    }
    const adminID = adminResult[0].adminID;

    // 2. Get voucher by code created by that admin
    const [voucherResult] = await db.query(
      `SELECT * FROM vouchers 
       WHERE code = ? AND created_by_admin_id = ? 
       AND NOW() BETWEEN valid_from AND valid_to`,
      [voucher_code, adminID]
    );
    if (voucherResult.length === 0) {
      return res.status(400).json({ message: 'Invalid or expired voucher' });
    }
    const voucher = voucherResult[0];

    // 3. Check if voucher already used by this customer user
    const [usedResult] = await db.query(
      `SELECT * FROM voucher_usage WHERE voucher_id = ? AND customer_user_id = ?`,
      [voucher.id, customer_user_id]
    );
    if (usedResult.length > 0) {
      return res.status(400).json({ message: 'Voucher already used' });
    }

    // 4. Get PO details to calculate discount
    const [poResult] = await db.query(
      `SELECT total_amount FROM purchase_orders WHERE id = ? AND customer_id = ?`,
      [po_id, customer_user_id]
    );
    if (poResult.length === 0) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    const po = poResult[0];

    // Calculate discount amount
    const discountAmount = (po.total_amount * voucher.discount_percent) / 100;
    const newTotal = po.total_amount - discountAmount;

    // 5. Update PO with discount
    await db.query(
      `UPDATE purchase_orders 
       SET voucher_code = ?, discount_amount = ?, discount_percent = ?, total_amount = ?
       WHERE id = ?`,
      [voucher.code, discountAmount, voucher.discount_percent, newTotal, po_id]
    );

    // 6. Insert into voucher_usage
    await db.query(
      `INSERT INTO voucher_usage (voucher_id, customer_user_id, po_id, used_at) 
       VALUES (?, ?, ?, NOW())`,
      [voucher.id, customer_user_id, po_id]
    );

    // 7. Send back updated PO details
    res.json({ 
      message: 'Voucher applied successfully',
      discount_percent: voucher.discount_percent,
      discount_amount: discountAmount,
      new_total: newTotal
    });

  } catch (err) {
    console.error('Error applying voucher:', err);
    res.status(500).json({ message: 'Server error applying voucher' });
  }
});


// routes/vouchers.js - Update the remove-voucher endpoint
router.post('/remove-voucher/:po_id', async (req, res) => {
  const po_id = req.params.po_id;

  try {
    // 1. Get PO details
    const [poResult] = await db.query(
      `SELECT id, voucher_code, discount_amount, total_amount, customer_id 
       FROM purchase_orders WHERE id = ?`,
      [po_id]
    );
    
    if (poResult.length === 0) {
      return res.status(404).json({ message: 'Purchase order not found' });
    }
    
    const po = poResult[0];
    
    if (!po.voucher_code) {
      return res.status(400).json({ message: 'No voucher applied to this order' });
    }

    // 2. Revert the discount - Ensure proper number formatting
    const originalTotal = (parseFloat(po.total_amount) + parseFloat(po.discount_amount)).toFixed(2)


    // 3. Update PO
    await db.query(
      `UPDATE purchase_orders 
       SET voucher_code = NULL, discount_amount = 0, discount_percent = 0, total_amount = ?
       WHERE id = ?`,
      [originalTotal, po_id]
    );

    // 4. Remove voucher usage record
    await db.query(
      `DELETE FROM voucher_usage WHERE po_id = ?`,
      [po_id]
    );

    res.json({ 
      message: 'Voucher removed successfully',
      original_total: originalTotal
    });

  } catch (err) {
    console.error('Error removing voucher:', err);
    res.status(500).json({ message: 'Server error removing voucher' });
  }
});

module.exports = router;