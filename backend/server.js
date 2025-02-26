const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const { sendOTP } = require("./utils/mailer"); 
const cors = require("cors");
const app = express();
const port = 5000;
app.use("/uploads",express.static("uploads"));

app.use(cors());
app.use(express.json());

// Routes
const CustomerAuthRouter = require("./routes/CustomerSignupAuth");
app.use("/auth/customer", CustomerAuthRouter); 

const VendorAuthRouter = require("./routes/VendorSignupAuth");
app.use("/auth/vendor", VendorAuthRouter);  

const Signin = require("./routes/SigninAuth");
app.use("/auth", Signin);  

const ForgotPassword = require("./routes/forgotPasswordOtp");
app.use("/forgotpassword", ForgotPassword);  

const contactUsRouter = require("./routes/ContactUs");
app.use("/contact", contactUsRouter);

const getvendor = require("./routes/getvendor");
app.use("/auth", getvendor);

const productsRouter = require("./routes/products");
app.use("/auth/products", productsRouter);

const vendorRouter = require("./routes/vendor"); 
app.use("/auth/vendor", vendorRouter); 

const CustomerEdit = require("./routes/Customer");
app.use("/customer-edit", CustomerEdit);

const Notification =require("./routes/notifications")
app.use("/api",Notification)


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
