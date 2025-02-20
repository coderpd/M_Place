const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const { sendOTP } = require("./utils/mailer");
const cors = require("cors");
const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));


// Vendor Auth Routes
const VendorAuthRouter = require("./routes/VendorSignupAuth");
app.use("/auth", VendorAuthRouter);

const Signin = require("./routes/SigninAuth");
app.use("/auth", Signin);

const getvendor = require("./routes/getvendor");
app.use("/auth", getvendor);

// Product Routes (added under /auth/products)
const productsRouter = require("./routes/products");
app.use("/auth/products", productsRouter);


// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
