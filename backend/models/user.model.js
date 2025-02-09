//user databse mongoose schema
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: uuidv4, unique: true },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Enter an valid email"],
    },
    address: { type: String },
    phone: { type: String },
    avatar: { type: String },
    password: {
      type: String,
      required: true,
      minLength: [8, "Password must be of at least 8 characters"],
    },
    role: {
      type: String,
      enum: ["admin", "customer", "pgowner", "employee"],
      default: "customer",
    },
    bio: { type: String },
    bookmarkedPg: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Pg",
      },
    ],
    refreshToken: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//password validity checking method
userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

//access token generating method
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

//refresh token generating method
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

module.exports = mongoose.model("User", userSchema);
