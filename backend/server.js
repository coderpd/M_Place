const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const port = 5000;


app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "products_db",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection error: ", err);
    return;
  }
  console.log("Connected to MySQL database.");
});


const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Uploads directory created.");
}

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const upload = multer({ storage });


app.post("/api/products", upload.single("image"), (req, res) => {
  const { name, price, brand, company, category, description, stock } = req.body;
  const image = req.file ? req.file.filename : null;

  const query =
    "INSERT INTO products (name, price, brand, company, category, description, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

  db.query(query, [name, price, brand, company, category, description, image, stock], (err, result) => {
    if (err) {
      console.error("Database insertion error: ", err);
      return res.status(500).json({ error: "Error adding product." });
    }

    res.status(200).json({
      id: result.insertId,
      name,
      price,
      brand,
      company,
      category,
      description,
      image: image ? `/uploads/${image}` : null,
      stock,
    });
  });
});


app.get("/api/products", (req, res) => {
  const query = "SELECT * FROM products";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching products:", err);
      return res.status(500).json({ error: "Error fetching products." });
    }
    res.status(200).json(result);
  });
});


app.get("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM products WHERE id = ?";

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Error fetching product." });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json(result[0]);
  });
});


app.put("/api/products/:id", upload.single("image"), (req, res) => {
  const { id } = req.params;
  const { name, price, brand, company, category, description, stock } = req.body;
  const newImage = req.file ? req.file.filename : null;

  
  db.query("SELECT image FROM products WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Error fetching product." });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const oldImage = result[0].image;
    const finalImage = newImage || oldImage; 

    const query = `UPDATE products SET name = ?, price = ?, brand = ?, company = ?, category = ?, description = ?, image = ?, stock = ? WHERE id = ?`;

    db.query(query, [name, price, brand, company, category, description, finalImage, stock, id], (err) => {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ error: "Error updating product." });
      }
      res.status(200).json({ message: "Product updated successfully!" });
    });
  });
});


app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;

  
  db.query("SELECT image FROM products WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error fetching product:", err);
      return res.status(500).json({ error: "Error fetching product." });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const imagePath = result[0].image ? path.join(__dirname, "uploads", result[0].image) : null;

    const deleteQuery = "DELETE FROM products WHERE id = ?";
    db.query(deleteQuery, [id], (err) => {
      if (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({ error: "Error deleting product." });
      }

      
      if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }

      res.status(200).json({ message: "Product deleted successfully!" });
    });
  });
});

app.post("/api/send-cart", (req, res) => {
  const { cart, userId } = req.body; 

  console.log("Received cart:", cart);
  console.log("User ID:", userId);

  if (!cart || cart.length === 0) {
    return res.status(400).json({ error: "Cart is empty!" });
  }

  cart.forEach((item) => {
    const { title, quantity, price } = item;
    const totalPrice = price * quantity;

    const query = `
      INSERT INTO cart_details (user_id, product_name, quantity, price, total_price)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [userId, title, quantity, price, totalPrice], (err, result) => {
      if (err) {
        console.error("Error inserting cart item:", err);
        return res.status(500).json({ error: "Error inserting cart data." });
      }

      console.log("Cart item inserted successfully:", result);
    });
  });

  res.status(200).json({ message: "Cart sent to vendor successfully!" });
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
