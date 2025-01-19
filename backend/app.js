const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./routes/user.route");
const adminRouter = require("./routes/admin.route");
const customerRouter = require("./routes/customer.route");
const pgownerRouter = require("./routes/pgowner.route");
const testRouter = require("./routes/test.route");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Middleware
app.use(express.json());
const cors = require("cors");
const defaultErrorHandler = require("./middlewares/defaultErrorHandler");
app.use(
  cors({
    origin: "*", // Allowing specific origin
    credentials: true, // Enable sending cookies/credentials
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allow necessary headers));
  })
);
// Routes
app.use("/api/v1", userRouter);
app.use("/api/v1", adminRouter);
app.use("/api/v1", customerRouter);
app.use("/api/v1", pgownerRouter);
app.use("/test", testRouter);

app.use(defaultErrorHandler);

// MongoDB Connection
const MONGO_URI = "mongodb://localhost:27017/perfectpg"; // Replace 'pg-management' with your database name

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
