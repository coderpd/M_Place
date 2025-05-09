const express = require("express");
const db = require("../db");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const path = require("path");
// In your route file

// Generate PO from cart
router.post("/generate", async (req, res) => {
  const { customerId, productId, quantity, shipToAddress } = req.body;

  if (!customerId || !productId || !quantity) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Start transaction
    await db.query("START TRANSACTION");

    // Get customer details and company address with GST number
    const [customer] = await db.query(
      `SELECT 
        cus.Id, 
        cus.personName, 
        cus.companyName, 
        cus.Email,
        ca.address,
        ca.city,
        ca.state,
        ca.country,
        ca.postalCode,
        ca.registrationNumber as cusCompanyRegistrationNo,
        ca.gstNumber as customerGstNumber
      FROM customerusersignup cus
      LEFT JOIN customersignup ca ON cus.companyName = ca.companyName
      WHERE cus.Id = ?`,
      [customerId]
    );

    if (!customer.length) {
      await db.query("ROLLBACK");
      return res.status(404).json({ error: "Customer not found" });
    }

    // Get product and vendor details with company address and GST number
    // Fetch product with HSN code from category
    const [product] = await db.query(
      `SELECT 
        p.id as product_id, 
        p.productName, 
        p.price,
        p.vendor_id,
        p.description,
        p.category,
        v.personName as vendorName,
        v.companyName as vendorCompany,
        v.Email as vendorEmail,
        va.address as vendorAddress,
        va.city as vendorCity,
        va.state as vendorState,
        va.country as vendorCountry,
        va.postalCode as vendorPostalCode,
        va.gstNumber as vendorGstNumber
      FROM products p
      JOIN vendorusersignup v ON p.vendor_id = v.id
      LEFT JOIN vendorsignup va ON v.companyName = va.companyName
      WHERE p.id = ?`,
      [productId]
    );

    if (!product.length) {
      await db.query("ROLLBACK");
      return res.status(404).json({ error: "Product not found" });
    }

    const productData = product[0];
    const totalAmount = productData.price * quantity;

    // Generate PO number (format: PO-YYYYMMDD-XXXX)
    const poNumber = `PO-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${uuidv4().slice(0, 4).toUpperCase()}`;

    // Create PO header with address info and GST number
    const [poResult] = await db.query(
      `INSERT INTO purchase_orders 
        (po_number, customer_id, customer_name, customer_company, 
         customer_address, customer_city, customer_state, customer_country, customer_postal_code,
         customer_gst_number, customer_company_registrationNo,
         ship_to_address, ship_to_city, ship_to_state, ship_to_country, ship_to_postal_code,
         total_amount, customer_email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        poNumber,
        customerId,
        customer[0].personName,
        customer[0].companyName,
        customer[0].address || "N/A",
        customer[0].city || "N/A",
        customer[0].state || "N/A",
        customer[0].country || "N/A",
        customer[0].postalCode || "N/A",
        customer[0].customerGstNumber || "N/A",
        customer[0].cusCompanyRegistrationNo || "N/A",
        shipToAddress?.address || customer[0].address || "N/A",
        shipToAddress?.city || customer[0].city || "N/A",
        shipToAddress?.state || customer[0].state || "N/A",
        shipToAddress?.country || customer[0].country || "N/A",
        shipToAddress?.postalCode || customer[0].postalCode || "N/A",
        totalAmount,
        customer[0].Email,
      ]
    );

    const poId = poResult.insertId;

    // Create PO item with vendor address info and GST number
    await db.query(
      `INSERT INTO purchase_order_items 
        (po_id, product_id, product_name, product_category, product_description, 
         vendor_id, vendor_name, vendor_company, 
         vendor_address, vendor_city, vendor_state, vendor_country, vendor_postal_code,
         vendor_gst_number, quantity, unit_price, total_price, vendor_email)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        poId,
        productData.product_id,
        productData.productName,
        productData.category,
        productData.description,
        productData.vendor_id,
        productData.vendorName,
        productData.vendorCompany,
        productData.vendorAddress || "N/A",
        productData.vendorCity || "N/A",
        productData.vendorState || "N/A",
        productData.vendorCountry || "N/A",
        productData.vendorPostalCode || "N/A",
        productData.vendorGstNumber || "N/A",
        quantity,
        productData.price,
        totalAmount,
        productData.vendorEmail,
      ]
    );

    // Commit transaction
    await db.query("COMMIT");

    // Get the full PO details to return
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
        po.customer_company_registrationNo,
        po.order_date,
        po.total_amount,
        po.status,
        poi.product_name,
        poi.product_category,
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
        poi.total_price
      FROM purchase_orders po
      JOIN purchase_order_items poi ON po.id = poi.po_id
      WHERE po.id = ?`,
      [poId]
    );

    res.status(201).json({
      message: "Purchase order generated successfully",
      po: {
        header: {
          poNumber: poDetails[0].po_number,
          customerName: poDetails[0].customer_name,
          customerCompany: poDetails[0].customer_company,
          customerEmail: poDetails[0].customer_email,
          customerAddress: poDetails[0].customer_address,
          customerCity: poDetails[0].customer_city,
          customerState: poDetails[0].customer_state,
          customerCountry: poDetails[0].customer_country,
          customerPostalCode: poDetails[0].customer_postal_code,
          cusCompanyRegistrationNo:
            poDetails[0].customer_company_registrationNo,
          orderDate: poDetails[0].order_date,
          totalAmount: poDetails[0].total_amount,
          status: poDetails[0].status || "PENDING",
        },
        items: poDetails.map((item) => ({
          productName: item.product_name,
          category: item.product_category,
          description: item.product_description,
          vendorName: item.vendor_name,
          vendorCompany: item.vendor_company,
          vendorEmail: item.vendor_email,
          vendorAddress: item.vendor_address,
          vendorCity: item.vendor_city,
          vendorState: item.vendor_state,
          vendorCountry: item.vendor_country,
          vendorPostalCode: item.vendor_postal_code,
          vendorGstNumber: item.vendor_gst_number,
          quantity: item.quantity,
          unitPrice: item.unit_price,
          totalPrice: item.total_price,
        })),
      },
    });
  } catch (error) {
    await db.query("ROLLBACK");
    console.error("Error generating PO:", error);
    res.status(500).json({ error: "Failed to generate purchase order" });
  }
});

// Add a new endpoint to update ship-to address
router.put("/:poId/ship-to-address", async (req, res) => {
  const { poId } = req.params;
  const { address, city, state, country, postalCode } = req.body;

  try {
    await db.query(
      `UPDATE purchase_orders 
       SET ship_to_address = ?, ship_to_city = ?, ship_to_state = ?, 
           ship_to_country = ?, ship_to_postal_code = ?
       WHERE id = ?`,
      [address, city, state, country, postalCode, poId]
    );

    res.json({ message: "Ship-to address updated successfully" });
  } catch (error) {
    console.error("Error updating ship-to address:", error);
    res.status(500).json({ error: "Failed to update ship-to address" });
  }
});

// Get all POs for a customer
router.get("/customer/:customerId", async (req, res) => {
  const { customerId } = req.params;

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
        po.order_date,
        po.status,
        po.total_amount,
        GROUP_CONCAT(
          JSON_OBJECT(
            'product_name', poi.product_name,
            'category',poi.product_category,
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
            'total_price', poi.total_price
          )
        ) as items
      FROM purchase_orders po
      JOIN purchase_order_items poi ON po.id = poi.po_id
      WHERE po.customer_id = ?
      GROUP BY po.id
      ORDER BY po.order_date DESC`,
      [customerId]
    );

    // Parse the JSON items
    const formattedOrders = orders.map((order) => ({
      ...order,
      items: JSON.parse(`[${order.items}]`),
    }));

    res.json({ purchaseOrders: formattedOrders });
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    res.status(500).json({ error: "Failed to fetch purchase orders" });
  }
});

//PDF:

const stateCodes = require("../utils/stateCodes");
const PDFDocument = require("pdfkit");
const { convertToWords } = require("../utils/convertToWords");
const hsnCodeMap = require("../utils/hsnCodeMap");
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
        po.customer_company_registrationNo,
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
        poi.product_category,
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
        poi.total_price
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

    // Define constants for layout
    const left = 15;
    const right = 575;
    const pageWidth = right - left;
    const columnLeft = left;
    const columnRight = right;

    // Helper functions
    const drawLine = (y) => {
      doc.moveTo(left, y).lineTo(right, y).stroke();
    };

    const drawVerticalLine = (x, startY, endY) => {
      doc.moveTo(x, startY).lineTo(x, endY).stroke();
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

    // Draw outer border
    doc.rect(left, 20, pageWidth, 770).stroke();

    const path = require("path");
    const logoPath = path.resolve(__dirname, "../uploads/logo/bidz.png");

    doc.image(logoPath, 30, 70, { width: 140 });

    // Header
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Purchase Order", left + 325, 35);
    doc.moveTo(210, 55).lineTo(575, 55).stroke();
    doc.moveTo(210, 20).lineTo(210, 165).stroke();

    // Set customer info block starting Y position

    const top = 65;
    const offsetWidth = doc.page.width * 0.9; // 90% of page width
    const offsetX = doc.page.width * 0.22; // left offset to push everything right

    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(data.customer_company, offsetX, top, {
        width: offsetWidth,
        align: "center",
      });

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(data.customer_address, offsetX, top + 20, {
        width: offsetWidth,
        align: "center",
      });

    doc.text(
      `${data.customer_city}, ${data.customer_state} - ${data.customer_postal_code}`,
      offsetX,
      top + 35,
      {
        width: offsetWidth,
        align: "center",
      }
    );

    doc.text(`Email: ${data.customer_email}`, offsetX, top + 55, {
      width: offsetWidth,
      align: "center",
    });

    // Draw horizontal line after customer details
    doc.moveTo(210, 140).lineTo(575, 140).stroke();

    // GSTIN / CIN
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("GSTIN:", left + 200, 150)
      .font("Helvetica")
      .text(data.customer_gst_number || "N/A", left + 233, 150)
      .font("Helvetica-Bold")
      .text("CIN NO:", left + 420, 150)
      .font("Helvetica")
      .text(data.customer_company_registrationNo || "N/A", left + 458, 150);
    drawLine(165);

    // PO Info
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .text("Purchase Order No:", left + 5, 175)
      .font("Helvetica")
      .text(data.po_number, left + 100, 175)
      .font("Helvetica-Bold")
      .text("Purchase Order Date:", left + 350, 175)
      .font("Helvetica")
      .text(formatDate(data.order_date), left + 455, 175);
    drawLine(190);

    // Vendor, Billing, Shipping Details
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .text("Vendor Details:", left + 5, 200)
      .text("Billing Details:", left + 190, 200)
      .text("Shipping Details:", left + 360, 200);
    drawLine(220);

    // Draw vertical lines for the 3-column layout
    drawVerticalLine(200, 190, 328); // After Vendor
    drawVerticalLine(370, 190, 328); // After Billing

    // Vendor details
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(`${data.vendor_company}`, left + 5, 230)
      .font("Helvetica")
      .text(`${data.vendor_address}`, left + 5, 245)
      .text(
        `${data.vendor_city}, ${data.vendor_state} - ${data.vendor_postal_code}`,
        left + 5,
        260
      )
      .font("Helvetica-Bold")
      .text(`GST: ${data.vendor_gst_number || "N/A"}`, left + 5, 290)
      .text(
        `State Code: ${stateCodes[data.vendor_state] || "00"}`,
        left + 5,
        305
      );

    // Billing details
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(`${data.customer_company}`, left + 190, 230)
      .font("Helvetica")
      .text(`${data.customer_address}`, left + 190, 245)
      .text(
        `${data.customer_city}, ${data.customer_state} - ${data.customer_postal_code}`,
        left + 190,
        260
      )
      .font("Helvetica-Bold")
      .text(`GST: ${data.customer_gst_number || "N/A"}`, left + 190, 290)
      .text(
        `State Code: ${stateCodes[data.customer_state] || "00"}`,
        left + 190,
        305
      );
    drawLine(327);
    // Shipping details
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(`${data.customer_company}`, left + 360, 230)
      .font("Helvetica")
      .text(`${data.ship_to_address || data.customer_address}`, left + 360, 245)
      .text(
        `${data.ship_to_city || data.customer_city}, ${
          data.ship_to_state || data.customer_state
        } - ${data.ship_to_postal_code || data.customer_postal_code}`,
        left + 360,
        260
      )
      .font("Helvetica-Bold")
      .text(
        `GST: ${data.ship_to_gst_number || data.customer_gst_number || "N/A"}`,
        left + 360,
        290
      )
      .text(
        `State Code: ${
          stateCodes[data.ship_to_state || data.customer_state] || "00"
        }`,
        left + 360,
        305
      );

    // Items Table
    const tableTop = 340;

    // Table Header
    doc.fontSize(10).font("Helvetica-Bold");
    doc.text("Sr.No", left + 5, tableTop);
    doc.text("Item", left + 55, tableTop);
    doc.text("Description", left + 150, tableTop); // New Description column
    doc.text("HSN", left + 260, tableTop);
    doc.text("Qty", left + 305, tableTop);
    doc.text("UOM", left + 335, tableTop);
    doc.text("Rate", left + 375, tableTop);
    doc.text("CGST", left + 420, tableTop);
    doc.text("SGST", left + 460, tableTop);
    doc.text("Amount", left + 502, tableTop);

    // Draw vertical lines for table columns
    drawVerticalLine(left + 35, tableTop - 13, tableTop + 140); // After Sr.No
    drawVerticalLine(left + 120, tableTop - 13, tableTop + 140); // After Item
    drawVerticalLine(left + 250, tableTop - 13, tableTop + 140); // After Description
    drawVerticalLine(left + 300, tableTop - 13, tableTop + 235); // After HSN
    drawVerticalLine(left + 330, tableTop - 13, tableTop + 140); // After Qty
    drawVerticalLine(left + 365, tableTop - 13, tableTop + 140); // After UOM
    drawVerticalLine(left + 415, tableTop - 13, tableTop + 140); // After Rate
    drawVerticalLine(left + 455, tableTop - 13, tableTop + 235); // After CGST
    drawVerticalLine(left + 495, tableTop - 13, tableTop + 140); // After SGST

    drawLine(tableTop + 20);

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

      doc.font("Helvetica").text(idx + 1, left + 5, y);
      doc
        .fontSize(9)
        .text(`${item.product_name} - ${item.product_category}`, left + 38, y, {
          width: 80,
        })
        .text(item.product_description, left + 123, y, { width: 120 })
        .text(hsnCodeMap[item.product_category] || "-", left + 253, y)
        .text(item.quantity.toString(), left + 310, y)
        .text("NOS", left + 340, y)
        .text(parseFloat(item.unit_price).toFixed(2), left + 370, y)
        .text(`${cgstRate}%`, left + 430, y)
        .text(`${sgstRate}%`, left + 470, y)
        .text(itemTotal.toFixed(2), left + 500, y);

      y += 115;
    });

    drawLine(y);
    y += 10;

    // Totals
    const totalGst = totalCgst + totalSgst;
    const grandTotal = subtotal + totalGst;

    // Subtotal
    doc.font("Helvetica-Bold").text("Sub Total:", left + 320, y);
    doc.text(subtotal.toFixed(2), left + 460, y, {
      align: "right",
      width: 80, // adjust width for alignment area
    });

    // GST
    y += 20;
    doc.text("Total GST (CGST + SGST):", left + 320, y);
    doc.text(totalGst.toFixed(2), left + 460, y, {
      align: "right",
      width: 80,
    });

    // Grand Total
    y += 30;
    doc.fontSize(12).text("Grand Total:", left + 320, y + 20);
    doc.text(grandTotal.toFixed(2), left + 460, y + 20, {
      align: "right",
      width: 80,
    });

    // Amount in Words
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Total Amount in Words:", left + 5, y - 50)
      .font("Helvetica")
      .text(
        `Rupees ${convertToWords(Math.round(grandTotal))} Only`,
        left + 5,
        y - 35,
        { width: 400 }
      );

    doc
      .font("Helvetica-Bold")
      .text("GST Amount in Words:", left + 5, y - 10)
      .font("Helvetica")
      .text(
        `Rupees ${convertToWords(Math.round(totalGst))} Only`,
        left + 5,
        y + 5,
        { width: 400 },

        (y += 35)
      );

    drawLine(y);

    // Status and Description
  

    y += 10;
    doc
      .font("Helvetica-Bold")
      .text("Terms & Conditions:", left + 5, y)
      .font("Helvetica")
      .text("1.Payment Terms: 100% advance against P.I.", left + 5, y + 20)
      .text("2. Validity: 30 Days.", left + 5, y + 35)
      .text("3. Mode of Transportation: Surface", left + 5, y + 50);

    // Authorized Signatory
    doc
      .font("Helvetica-Bold")
      .text("Authorized Signatory", right - 150, y + 120);

  

    doc.end();
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all POs for a company (admin view)
router.get("/company-admin/:adminId", async (req, res) => {
  const { adminId } = req.params;
  console.log("Received request for adminId:", adminId);

  try {
    // First get the company name from customersignup table
    const [company] = await db.query(
      `SELECT companyName FROM customersignup WHERE id = ?`,
      [adminId]
    );

    console.log("Company query result:", company);

    if (!company || company.length === 0) {
      console.log("No company found for adminId:", adminId);
      return res.status(404).json({
        success: false,
        error: "Admin company not found",
      });
    }

    const companyName = company[0].companyName;
    console.log("Found company:", companyName);

    // Then get all POs for users in this company
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
            'total_price', poi.total_price
          )
        ) as items
      FROM purchase_orders po
      JOIN purchase_order_items poi ON po.id = poi.po_id
      JOIN customerusersignup cus ON po.customer_id = cus.id
      WHERE cus.companyName = ?
      GROUP BY po.id
      ORDER BY po.order_date DESC`,
      [companyName]
    );

    console.log("Orders found:", orders.length);

    // Parse the JSON items
    const formattedOrders = orders.map((order) => ({
      ...order,
      items: order.items ? JSON.parse(`[${order.items}]`) : [],
    }));

    console.log("Sending response with", formattedOrders.length, "orders");

    res.json({
      success: true,
      companyName,
      purchaseOrders: formattedOrders,
    });
  } catch (error) {
    console.error("Error in /company-admin route:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch purchase orders",
      details: error.message,
    });
  }
});
module.exports = router;
