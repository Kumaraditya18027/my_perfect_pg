const Pg = require("../../models/pg.model");
const asyncHandler = require("../../utils/asyncHandler");
const { ApiError, ValidationError } = require("../../utils/customErrorHandler");
const ResponseHandler = require("../../utils/responseHandler");
const Booking = require("../../models/booking.model");
const User = require("../../models/user.model");

//get pg verify requests
const getPgVerifyRequests = asyncHandler(async (req, res) => {
  const requests = await Pg.find({ isAdminVerified: false }).select("-_id");

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

//create a booking
const createBooking = asyncHandler(async (req, res) => {
  const { userId, pgId, roomType, foodingType, ac } = req.body;

  if (!userId || !pgId || !roomType || !foodingType || ac === undefined) {
    throw new ApiError(400, "All fields are required.");
  }

  // Check if the PG exists
  const pg = await Pg.findOne({ uuid: pgId });
  if (!pg) {
    throw new ApiError(404, "PG not found.");
  }

  // Check if the user exists
  const user = await User.findOne({ uuid: userId });
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Check room availability
  const room = pg.rooms.find(
    (room) => room.type === roomType && room.features.ac === ac
  );

  if (!room || room.availability.count <= room.availability.booked) {
    throw new ApiError(400, "Room type is not available.");
  }

  // Create a new booking
  const booking = new Booking({
    user: user._id,
    pg: pg._id,
    roomType,
    foodingType,
    ac,
    status: "pending", // Default status is 'pending'
  });

  // Save the booking
  await booking.save();

  // Increment the booked room count
  room.availability.booked += 1;
  await pg.save();

  return res
    .status(201)
    .json(new ResponseHandler(201, "Booking created successfully.", booking));
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
    .populate("user", "name email")
    .populate("pg", "name address gender");

  if (bookings.length === 0) {
    return res.status(200).json(new ResponseHandler(200, "No bookings found."));
  }

  return res
    .status(200)
    .json(new ResponseHandler(200, "Bookings fetched successfully.", bookings));
});

//remove pg
const removePg = asyncHandler(async (req, res) => {
  const { pgId } = req.body;

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
  createBooking,
  updateBookingStatus,
  getAllBookings,
};
