const express = require("express");
const db = require("../db");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Get all POs for a vendor with complete address information
router.get("/vendor/:vendorId", async (req, res) => {
  const { vendorId } = req.params;

  try {
    const [orders] = await db.query(
      `SELECT 
        po.id,
        po.po_number,
        po.customer_name,
        po.customer_company,
        po.customer_email,
        po.customer_address,
        po.customer_city,
        po.customer_state,
        po.customer_country,
        po.customer_postal_code,
        po.ship_to_address,
        po.ship_to_city,
        po.ship_to_state,
        po.ship_to_country,
        po.ship_to_postal_code,
        po.order_date,
        po.status,
        po.total_amount,
        GROUP_CONCAT(
          JSON_OBJECT(
            'product_name', poi.product_name,
            'description', poi.product_description,
            'vendor_name', poi.vendor_name,
            'vendor_company', poi.vendor_company,
            'vendor_email', poi.vendor_email,
            'vendor_address', poi.vendor_address,
            'vendor_city', poi.vendor_city,
            'vendor_state', poi.vendor_state,
            'vendor_country', poi.vendor_country,
            'vendor_postal_code', poi.vendor_postal_code,
            'quantity', poi.quantity,
            'unit_price', poi.unit_price,
            'total_price', poi.total_price,
            'product_id', poi.product_id
          )
        ) as items
      FROM purchase_orders po
      JOIN purchase_order_items poi ON po.id = poi.po_id
      WHERE poi.vendor_id = ?
      GROUP BY po.id
      ORDER BY po.order_date DESC`,
      [vendorId]
    );

    // Parse the JSON items
    const formattedOrders = orders.map((order) => ({
      ...order,
      items: JSON.parse(`[${order.items}]`),
    }));

    res.json({ purchaseOrders: formattedOrders });
  } catch (error) {
    console.error("Error fetching vendor purchase orders:", error);
    res.status(500).json({ error: "Failed to fetch purchase orders" });
  }
});




const stateCodes = require("../utils/stateCodes");
const PDFDocument = require("pdfkit");
const { convertToWords } = require("../utils/convertToWords");
router.get("/generate-pdf/:poId", async (req, res) => {
  const { poId } = req.params;

  try {
    const [poDetails] = await db.query(
      `SELECT 
        po.id,
        po.po_number,
        po.customer_name,
        po.customer_company,
        po.customer_email,
        po.customer_address,
        po.customer_city,
        po.customer_state,
        po.customer_country,
        po.customer_postal_code,
        po.customer_gst_number,
        po.order_date,
        po.status,
        po.total_amount,
        po.ship_to_address,
        po.ship_to_city,
        po.ship_to_state,
        po.ship_to_country,
        po.ship_to_postal_code,
        po.ship_to_gst_number,
        poi.product_name,
        poi.product_description,
        poi.vendor_name,
        poi.vendor_company,
        poi.vendor_email,
        poi.vendor_address,
        poi.vendor_city,
        poi.vendor_state,
        poi.vendor_country,
        poi.vendor_postal_code,
        poi.vendor_gst_number,
        poi.quantity,
        poi.unit_price,
        poi.total_price,
        poi.hsn_code
      FROM purchase_orders po
      JOIN purchase_order_items poi ON po.id = poi.po_id
      WHERE po.id = ?`,
      [poId]
    );

    if (!poDetails.length) {
      return res.status(404).json({ error: "PO not found" });
    }

    const doc = new PDFDocument({ margin: 40, size: "A4", bufferPages: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=PO_${poDetails[0].po_number}.pdf`
    );

    doc.pipe(res);

    const left = 50;
    const right = 550;
    const drawLine = (y) => {
      doc.moveTo(left, y).lineTo(right, y).stroke();
    };
    const formatDate = (dateStr) =>
      new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    const data = poDetails[0];
    const cgstRate = 9;
    const sgstRate = 9;

    // Header
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Purchase Order", left + 200, 50);
    drawLine(70);

    // Company Details
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(data.customer_company, left + 320, 80);
    doc
      .fontSize(10)
      .font("Helvetica")
      .text(data.customer_address, left + 320, 95);
    doc.text(
      `${data.customer_city}, ${data.customer_state} - ${data.customer_postal_code}`,
      left + 320,
      110
    );
    doc.text(`Email: ${data.customer_email}`, left + 320, 125);
    drawLine(140);

    // GSTIN / CIN
    doc
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("GSTIN:", left, 150)
      .text(data.customer_gst_number || "N/A", left + 40, 150)
      .text("CIN NO:", left + 350, 150)
      .text(data.customer_company_registrationNo || "N/A", left + 385, 150);
    drawLine(165);

    // PO Info
    doc
      .fontSize(10)
      .text("Purchase Order No:", left, 175)
      .text(data.po_number, left + 100, 175)
      .text("Order Date:", left + 350, 175)
      .text(formatDate(data.order_date), left + 410, 175);
    drawLine(190);

    //Table Head
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Vendor Details:", left+5, 200)
      .text("Billing Details:", left + 155, 200)
      .text("Shipping Details:", left + 325, 200);
    drawLine(220);

    //table content
    doc
      .font("Helvetica")
      .text(`${data.vendor_company}`, left+5, 230)
      .text(`${data.vendor_address}`, left+5, 245)
      .text(
        `${data.vendor_city}, ${data.vendor_state} - ${data.vendor_postal_code}`,
        left+5,
        260
      )
      .font("Helvetica-Bold")
      .text(
        `GST: ${data.ship_to_gst_number || data.customer_gst_number || "N/A"} `,
        left+5,
        290
      )
      .text(
        `State Code: ${
          stateCodes[data.ship_to_state || data.customer_state] || "00"
        }`,
        left+5,
        305
      )
      .font("Helvetica")
      .text(`${data.customer_company}`, left + 155, 230)
      .text(`${data.customer_address}`, left + 155, 245)
      .text(
        `${data.customer_city}, ${data.customer_state} - ${data.customer_postal_code}`,
        left + 155,
        260
      )
      .font("Helvetica-Bold")
      .text(
        `GST: ${data.ship_to_gst_number || data.customer_gst_number || "N/A"} `,
        left + 155,
        290
      )
      .text(
        `State Code: ${
          stateCodes[data.ship_to_state || data.customer_state] || "00"
        }`,
        left + 155,
        305
      )
      .font("Helvetica")
      .text(`${data.customer_company}`, left + 325, 230)
      .text(`${data.ship_to_address || data.customer_address}`, left + 325, 245)
      .text(
        `${data.ship_to_city || data.customer_city}, ${
          data.ship_to_state || data.customer_state
        } - ${data.ship_to_postal_code || data.customer_postal_code}`,
        left + 325,
        260
      )
      .font("Helvetica-Bold")
      .text(
        `GST: ${data.ship_to_gst_number || data.customer_gst_number || "N/A"} `,
        left + 325,
        290
      )
      .text(
        `State Code: ${
          stateCodes[data.ship_to_state || data.customer_state] || "00"
        }`,
        left + 325,
        305
      );
    // Table Header
    const tableTop = 330;
    doc.fontSize(9).font("Helvetica-Bold");
    doc.text("Sr.No", left, tableTop);
    doc.text("Item", left + 35, tableTop);
    doc.text("HSN", left + 160, tableTop);
    doc.text("Qty", left + 210, tableTop);
    doc.text("UOM", left + 240, tableTop);
    doc.text("Rate", left + 280, tableTop);
    doc.text("CGST", left + 340, tableTop);
    doc.text("SGST", left + 390, tableTop);
    doc.text("Total", left + 430, tableTop);
    drawLine(tableTop + 15);

    // Items
    let y = tableTop + 25;
    let subtotal = 0;
    let totalCgst = 0;
    let totalSgst = 0;

    poDetails.forEach((item, idx) => {
      if (y > 720) {
        doc.addPage();
        y = 50;
      }

      const itemTotal = parseFloat(item.total_price);
      const cgst = itemTotal * (cgstRate / 100);
      const sgst = itemTotal * (sgstRate / 100);

      subtotal += itemTotal;
      totalCgst += cgst;
      totalSgst += sgst;

      doc
        .font("Helvetica")
        .text(idx + 1, left, y)
        .text(item.product_name, left + 35, y, { width: 120 })
        .text(item.hsn_code || "-", left + 160, y)
        .text(item.quantity.toString(), left + 210, y)
        .text("NOS", left + 240, y)
        .text(parseFloat(item.unit_price).toFixed(2), left + 280, y)
        .text(`${cgstRate}%`, left + 340, y)
        .text(`${sgstRate}%`, left + 390, y)
        .text(itemTotal.toFixed(2), left + 430, y);

      y += 20;
    });

    drawLine(y);
    y += 10;

    // Assuming subtotal, totalCgst, totalSgst are already calculated
    const totalGst = totalCgst + totalSgst;
    const grandTotal = subtotal + totalGst;

    // Move down a bit from the previous content
    y += 5;

    // Sub Total
    doc.font("Helvetica-Bold").text("Sub Total:", left + 310, y);
    doc.text(subtotal.toFixed(2), left + 440, y);

    // Total GST
    y += 20;
    doc.text("Total GST (CGST + SGST):", left + 310, y);
    doc.text(totalGst.toFixed(2), left + 440, y);

    // Grand Total
    y += 20;
    doc.fontSize(12).text("Grand Total:", left + 310, y);
    doc.text(grandTotal.toFixed(2), left + 440, y);

    y += 25;
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Total Amount in Words:", left, 385)
      .text("GST Amount in Words:", left, 420)
      .font("Helvetica")
      .text(`Rupees ${convertToWords(Math.round(grandTotal))} Only`, left, 400)

      .font("Helvetica")
      .text(`Rupees ${convertToWords(Math.round(totalGst))} Only`, left, 435);

    y += 10;
    drawLine(y);

    let statusYPos = doc.y;

    // Label for Status
    doc.font("Helvetica-Bold").text("Status:", left + 350, statusYPos + 30);

    // Value for Status, aligned to the right of the label
    doc
      .font("Helvetica")
      .text(poDetails[0].status || "PENDING", left + 390, statusYPos + 30);

    // Move to the next line for Description, adjusting yPos accordingly
    statusYPos += 20;

    // Label for Product Description
    doc
      .font("Helvetica-Bold")
      .text("Product Description:", left, statusYPos +10);

    // Value for Product Description, aligned to the right of the label
    doc
      .font("Helvetica")
      .text(poDetails[0].product_description, left + 100, statusYPos+10 );

    doc
      .font("Helvetica-Bold")
      .text("Terms & Conditions :", left, statusYPos + 115);

    // Value for Product Description, aligned to the right of the label
    doc.font("Helvetica").text("", left + 100, statusYPos + 35);

    // --- Footer ---
    drawLine(doc.page.height - 60);

    doc
      .font("Helvetica")
      .fontSize(9)
      .text("Authorized Signatory", right - 100, y + 300);
      drawLine(325);
    //Vertical Line

    doc
      .moveTo(48, 35) // Start point
      .lineTo(50, 780) // End point (same X, different Y)
      .stroke();
    doc.moveTo(200, 190).lineTo(200, 375).stroke();

    doc.moveTo(370, 190).lineTo(370, 375).stroke();
   
    doc.moveTo(550, 35).lineTo(550, 780).stroke();
    
    doc.moveTo(50, 35).lineTo(550, 35).stroke();
   
    doc.moveTo(350,375).lineTo(350,465).stroke();

    doc.moveTo(480,375).lineTo(480,465).stroke();
    doc.end();
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  router.put("/update/:poId", async (req, res) => {
    const { poId } = req.params;
    const { status, billing_address } = req.body;
  
    try {
      // Validate at least one field is being updated
      if (!status && !billing_address) {
        return res.status(400).json({ error: "No fields to update" });
      }
  
      // Build the update query dynamically
      let updateFields = [];
      let queryParams = [];
  
      if (status) {
        updateFields.push("status = ?");
        queryParams.push(status);
      }
  
      if (billing_address) {
        updateFields.push("billing_address = ?");
        queryParams.push(billing_address);
      }
  
      queryParams.push(poId);
  
      const query = `UPDATE purchase_orders SET ${updateFields.join(", ")} WHERE id = ?`;
  
      await db.query(query, queryParams);
  
      res.json({ message: "PO updated successfully" });
    } catch (error) {
      console.error("Error updating PO:", error);
      res.status(500).json({ error: "Failed to update PO" });
    }
  });
  
  

  router.get("/vendor/admin/:vendorId", async (req, res) => {
    const { vendorId } = req.params;
    console.log("Received request for vendorId:", vendorId);
    
    try {
      // First get the vendor company name from vendorsignup table
      const [vendor] = await db.query(
        `SELECT companyName FROM vendorsignup WHERE id = ?`,
        [vendorId]
      );
  
      console.log("Vendor query result:", vendor);
  
      if (!vendor || vendor.length === 0) {
        console.log("No vendor found for vendorId:", vendorId);
        return res.status(404).json({ 
          success: false,
          error: "Vendor not found" 
        });
      }
  
      const companyName = vendor[0].companyName; // Changed to companyName
      console.log("Found company:", companyName);
  
      // Get all POs for this vendor
      const [orders] = await db.query(
        `SELECT 
          po.id,
          po.po_number,
          po.customer_name,
          po.customer_company,
          po.customer_email,
          po.customer_address,
          po.customer_city,
          po.customer_state,
          po.customer_country,
          po.customer_postal_code,
          po.ship_to_address,
          po.ship_to_city,
          po.ship_to_state,
          po.ship_to_country,
          po.ship_to_postal_code,
          po.order_date,
          po.status,
          po.total_amount,
          GROUP_CONCAT(
            JSON_OBJECT(
              'product_name', poi.product_name,
              'description', poi.product_description,
              'vendor_name', poi.vendor_name,
              'vendor_company', poi.vendor_company,
              'vendor_email', poi.vendor_email,
              'vendor_address', poi.vendor_address,
              'vendor_city', poi.vendor_city,
              'vendor_state', poi.vendor_state,
              'vendor_country', poi.vendor_country,
              'vendor_postal_code', poi.vendor_postal_code,
              'quantity', poi.quantity,
              'unit_price', poi.unit_price,
              'total_price', poi.total_price,
              'product_id', poi.product_id
            )
          ) as items
        FROM purchase_orders po
        JOIN purchase_order_items poi ON po.id = poi.po_id
        WHERE po.id IN (
          SELECT po_id
          FROM purchase_order_items
          GROUP BY po_id
          HAVING SUM(vendor_company != ?) = 0
        )
        AND poi.vendor_company = ?
        GROUP BY po.id
        ORDER BY po.order_date DESC`,
        [companyName, companyName] // Both parameters use companyName
      );
  
      console.log("Orders found:", orders.length);
  
      // Parse the JSON items with safety check
      const formattedOrders = orders.map((order) => ({
        ...order,
        items: order.items ? JSON.parse(`[${order.items}]`) : [],
      }));
  
      console.log("Sending response with", formattedOrders.length, "orders");
      
      res.json({
        success: true,
        companyName, // Consistent naming in response
        purchaseOrders: formattedOrders
      });
      
    } catch (error) {
      console.error("Error in /vendor/admin route:", error);
      res.status(500).json({ 
        success: false,
        error: "Failed to fetch purchase orders",
        details: error.message 
      });
    }
});
  

module.exports = router;


