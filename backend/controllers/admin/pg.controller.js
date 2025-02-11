const Pg = require("../../models/pg.model");
const asyncHandler = require("../../utils/asyncHandler");
const { ApiError, ValidationError } = require("../../utils/customErrorHandler");
const ResponseHandler = require("../../utils/responseHandler");
const Booking = require("../../models/booking.model");
const User = require("../../models/user.model");

//get pg verify requests
const getPgVerifyRequests = asyncHandler(async (req, res) => {
  const requests = await Pg.find({ isAdminVerified: false })
    .select("-_id")
    .populate("owner", "uuid name email phone address");

  if (!requests || requests.length === 0) {
    return res
      .status(200)
      .json(new ResponseHandler(200, "No requests available!"));
  }

  return res
    .status(200)
    .json(
      new ResponseHandler(200, "All requests fetched successfully!", requests)
    );
});

//toggle verify pg
const toggleVerifyPg = asyncHandler(async (req, res) => {
  const { pgId } = req.body;
  const adminId = req.user._id;

  if (!adminId) {
    throw new ValidationError("Admin ID not found!");
  }

  const admin = await User.findOne({
    $and: [{ _id: adminId }, { role: "admin" }],
  }).select("uuid role");

  if (!admin) {
    throw new NotFoundError("Admin not found!");
  }

  if (!pgId) {
    throw new ValidationError("PG ID is required!");
  }

  // Find the PG by ID
  const pg = await Pg.findOne({ uuid: pgId });

  if (!pg) {
    throw new ApiError(404, "PG not found!");
  }

  // Toggle the verification status
  pg.isAdminVerified = !pg.isAdminVerified;
  await pg.save();

  return res
    .status(200)
    .json(
      new ResponseHandler(
        200,
        `PG verification status updated successfully! Verified: ${pg.isAdminVerified}`,
        pg
      )
    );
});

//get all pgs listed
const getAllPgsListed = asyncHandler(async (req, res) => {
  const pgs = await Pg.find().select("-_id");

  if (!pgs || pgs.length === 0) {
    return res
      .status(200)
      .json(new ResponseHandler(200, "No PGs listed currently!"));
  }

  return res
    .status(200)
    .json(
      new ResponseHandler(200, "All listed PGs fetched successfully!", pgs)
    );
});

//update a booking
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingId } = req.params;
  const { status } = req.body;

  if (!status || !["pending", "approved", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status value.");
  }

  // Find the booking by ID
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new ApiError(404, "Booking not found.");
  }

  // Update the booking status
  booking.status = status;

  // Save the updated booking
  await booking.save();

  return res
    .status(200)
    .json(
      new ResponseHandler(200, `Booking status updated to ${status}.`, booking)
    );
});

//get all bookings
const getAllBookings = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const query = status ? { status } : {}; // If a status is passed, filter by status

  // Fetch bookings based on the query
  const bookings = await Booking.find(query)
    .populate("user", "name email phone")
    .populate("pg", "name address gender pictures")
    .populate("assignedMember", "_id name uuid email phone");

  if (bookings.length === 0) {
    return res.status(200).json(new ResponseHandler(200, "No bookings found."));
  }

  console.log(bookings);

  return res
    .status(200)
    .json(new ResponseHandler(200, "Bookings fetched successfully.", bookings));
});

//remove pg
const removePg = asyncHandler(async (req, res) => {
  const { pgId } = req.body;
  const adminId = req.user._id;

  if (!adminId) {
    throw new ValidationError("Admin ID not found!");
  }

  const admin = await User.findOne({
    $and: [{ _id: adminId }, { role: "admin" }],
  }).select("uuid role");

  if (!admin) {
    throw new NotFoundError("Admin not found!");
  }

  if (!pgId) {
    throw new ValidationError("PG ID is required!");
  }

  // Find the PG by ID
  const pg = await Pg.findOne({ uuid: pgId });

  if (!pg) {
    throw new ApiError(404, "PG not found!");
  }

  // Remove the PG
  await Pg.deleteOne({ _id: pg._id });

  return res
    .status(200)
    .json(new ResponseHandler(200, `PG with ID ${pgId} removed successfully!`));
});

module.exports = {
  getPgVerifyRequests,
  getAllPgsListed,
  removePg,
  toggleVerifyPg,
  updateBookingStatus,
  getAllBookings,
};
