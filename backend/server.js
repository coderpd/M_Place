const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const { sendOTP } = require("./utils/mailer"); 
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;


// app.use(cors());
// const cors = require("cors");
app.use(cors({ 
  origin: "http://localhost:3000", // Allow requests from frontend
  methods: "GET,POST,PUT,DELETE,OPTIONS", 
  allowedHeaders: "Content-Type, Authorization" 
}));

app.use(express.json());
app.use(bodyParser.json());
// Routes
const CustomerAuthRouter = require("./routes/CustomerSignupAuth");
app.use("/auth/customer", CustomerAuthRouter);  // Now it's a distinct route for customers

const VendorAuthRouter = require("./routes/VendorSignupAuth");
app.use("/auth/vendor", VendorAuthRouter);  

const SigninAuthRouter = require("./routes/SigninAuth");
app.use("/auth/signin", SigninAuthRouter);  // Separate signin route

const ForgotPassword = require("./routes/forgotPasswordOtp");
app.use("/forgotpassword", ForgotPassword);  

const Products = require("./routes/products");
app.use("/products", Products);  

const VendorNotification = require("./routes/notification");
app.use("/notification", VendorNotification);  

const ProfileRouter = require("./routes/CustomerProfileFetch");  
app.use("/customer-profile", ProfileRouter);


const CustomerEdit = require("./routes/customer");
app.use("/customer-edit", CustomerEdit);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
