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

// Routes
const CustomerAuthRouter = require("./routes/CustomerSignupAuth");
app.use("/auth/customer", CustomerAuthRouter);  // Now it's a distinct route for customers

const VendorAuthRouter = require("./routes/VendorSignupAuth");
app.use("/auth/vendor", VendorAuthRouter);  // Now it's a distinct route for vendors

const SigninAuthRouter = require("./routes/SigninAuth");
app.use("/auth/signin", SigninAuthRouter);  // Separate signin route

const ForgotPassword = require("./routes/forgotPasswordOtp");
app.use("/forgotpassword", ForgotPassword);  // Forgot password routes are independent

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
