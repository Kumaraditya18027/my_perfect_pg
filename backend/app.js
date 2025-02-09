const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//internal imports
const defaultErrorHandler = require("./middlewares/defaultErrorHandler");
const userRouter = require("./routes/user.route");
const testRouter = require("./routes/test.route");
const adminRouter = require("./routes/admin.route");
const customerRouter = require("./routes/customer.route");
const pgownerRouter = require("./routes/pgowner.route");
const employeeRouter = require("./routes/employee.route");

const app = express();

//cors
app.use(
  cors({
    origin: "http://localhost:3000", // Allowing specific origin
    credentials: true, // Enable sending cookies/credentials
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers
  })
);

//request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//set static folder
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//parse cookies
app.use(cookieParser());

//routes
app.use("/api/v1", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1", customerRouter);
app.use("/api/v1", pgownerRouter);
app.use("/api/v1/employee", employeeRouter);
app.use("/test", testRouter);

//errors handler
app.use(defaultErrorHandler);

module.exports = app;
