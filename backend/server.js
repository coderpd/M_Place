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
app.use("/auth", CustomerAuthRouter);

const VendorAuthRouter=require("./routes/VendorSignupAuth")
app.use("/auth",VendorAuthRouter)

const SigninAuthRouter=require("./routes/SigninAuth")
app.use("/auth",SigninAuthRouter)

const ForgotPassword=require("./routes/forgotPasswordOtp")
app.use("/auth",ForgotPassword)


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
