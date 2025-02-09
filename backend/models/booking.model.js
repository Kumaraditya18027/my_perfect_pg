//Schema for booking
const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    pg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pg",
      required: true,
    },
    roomType: {
      type: String,
      enum: ["single", "double", "triple"],
      required: true,
    },
    foodingType: {
      type: String,
      enum: ["veg", "non-veg", "N/A"],
      required: true,
    },
    ac: {
      type: Boolean,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
