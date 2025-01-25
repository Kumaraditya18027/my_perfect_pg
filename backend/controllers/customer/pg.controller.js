const Pg = require("../../models/pg.model");
const Booking = require("../../models/booking.model");
const User = require("../../models/user.model");
const asyncHandler = require("../../utils/asyncHandler");
const { NotFoundError, ApiError } = require("../../utils/customErrorHandler");
const ResponseHandler = require("../../utils/responseHandler");

//get all pgs
const getAllPgs = asyncHandler(async (req, res) => {
  const pgs = await Pg.find({
    $and: [{ isAdminVerified: true }, { deleted: false }],
  }).select(
    "-_id uuid name address gender rooms services description rating timings pictures location.latitude location.longitude"
  );

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

//get specific pg details
const getPgDetails = asyncHandler(async (req, res) => {
  const { pgId } = req.params;
  const userId = req.user._id;

  // Find the PG by UUID
  const pg = await Pg.findOne({
    uuid: pgId,
  });

  // Check if the PG exists
  if (!pg) {
    return res
      .status(404)
      .json(new ResponseHandler(404, "PG not found or not available!"));
  }

  console.log(userId);
  console.log(pg._id);

  // Check if user has requested any booking earlier
  const booking = await Booking.find({
    $and: [{ user: userId }, { pg: pg._id }],
  }).select("-_id roomType");
  if (booking) {
    console.log("Bookings:", booking);
  }

  // Return success response
  return res.status(200).json(
    new ResponseHandler(200, "PG details fetched successfully!", {
      pg,
      booking,
    })
  );
});

//create a booking
const createBooking = asyncHandler(async (req, res) => {
  const { pgId, roomType, foodingType, ac } = req.body;
  const userId = req.user._id;

  if (!userId || !pgId || !roomType || !foodingType || ac === undefined) {
    throw new ApiError(400, "All fields are required.");
  }

  // Check if the PG exists
  const pg = await Pg.findOne({ uuid: pgId });
  if (!pg) {
    throw new ApiError(404, "PG not found.");
  }

  // Check if the user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  // Check room availability
  const room = pg.rooms.find(
    (room) => room.type === roomType && room.features.ac === ac
  );

  if (!room || room.availability.count <= room.availability.booked) {
    return res
      .status(200)
      .json(new ResponseHandler(200, "Room type is not available!"));
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

// Search PGs by name, address, or gender
const searchPg = asyncHandler(async (req, res) => {
  const { query } = req.query; // Get search query from query parameter

  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    // Find PGs matching the query in name, address, or gender
    const searchResults = await Pg.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { address: { $regex: query, $options: "i" } },
        { gender: { $regex: query, $options: "i" } },
      ],
      deleted: false,
    }).exec();

    if (searchResults.length === 0) {
      return res
        .status(404)
        .json({ message: "No PGs found matching the search criteria" });
    }

    return res.status(200).json(searchResults);
  } catch (error) {
    console.error("Search Error:", error);
    return res
      .status(500)
      .json({ message: "Server error, please try again later" });
  }
});

//book a pg visit
const bookPgVisit = asyncHandler(async (req, res) => {});

module.exports = {
  getAllPgs,
  bookPgVisit,
  getPgDetails,
  createBooking,
  searchPg,
};
