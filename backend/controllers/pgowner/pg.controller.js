const asyncHandler = require("../../utils/asyncHandler");
const Pg = require("../../models/pg.model");
const User = require("../../models/user.model");
const Booking = require("../../models/booking.model");
const {
  ApiError,
  NotFoundError,
  ValidationError,
} = require("../../utils/customErrorHandler");
const ResponseHandler = require("../../utils/responseHandler");
const uploadFileOnCloudinary = require("../../utils/cloudinary");
const mongoose = require("mongoose");

//add pg
const addPg = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    gender,
    rooms,
    services,
    rating,
    description,
    latitude,
    longitude,
    timings,
    profession,
    ownerName,
    ownerPhone,
    ownerEmail,
    ownerAddress,
  } = req.body;

  const owner = req.user._id;

  // Validate required fields
  if (
    !name ||
    !address ||
    !gender ||
    !description ||
    !latitude ||
    !longitude ||
    !timings ||
    !owner ||
    !profession
  ) {
    throw new ApiError(400, "All required fields must be provided!");
  }

  // Check for the owner id
  const ownerUser = await User.findById(owner);
  if (!ownerUser) {
    throw new NotFoundError("User not found!");
  }

  // Multiple files for pictures
  const pictureFiles = req.files || null;

  if (!pictureFiles || pictureFiles.length === 0) {
    throw new ApiError(400, "At least one picture must be uploaded!");
  }

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Upload pictures to Cloudinary and collect the URLs
    const pictureUrls = [];
    for (const file of pictureFiles) {
      const uploadedUrl = await uploadFileOnCloudinary(file.path); // Upload each file
      if (uploadedUrl) {
        pictureUrls.push(uploadedUrl); // Add the uploaded URL to the pictures array
      }
    }

    const parsedServices = services && JSON.parse(services);
    const parsedRooms = rooms && JSON.parse(rooms);

    // Create a new PG document with the uploaded picture URLs
    const pg = new Pg({
      name,
      address,
      gender,
      rooms: parsedRooms || [],
      services: parsedServices || {},
      rating: rating || 0,
      description,
      location: {
        latitude,
        longitude,
      },
      pictures: pictureUrls,
      timings,
      owner,
      profession,
    });

    // Save the PG to the database within the session
    await pg.save({ session });

    // Update the owner's details
    if (ownerName) ownerUser.name = ownerName;
    if (ownerPhone) ownerUser.phone = ownerPhone;
    if (ownerEmail) ownerUser.email = ownerEmail;
    if (ownerAddress) ownerUser.address = ownerAddress;

    // Save the updated owner within the session
    await ownerUser.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json(new ResponseHandler(201, "PG added successfully!", pg));
  } catch (error) {
    // If any operation fails, abort the transaction and roll back
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    throw new ApiError(500, "Failed to add PG. Please try again.");
  }
});

//add rooms
const addRoom = asyncHandler(async (req, res) => {
  const { pgId, type, features, rates, availability } = req.body;

  // Validate required fields
  if (!pgId || !type || !features || !rates || !availability) {
    throw new ApiError(400, "All required fields must be provided!");
  }

  // Validate PG existence
  const pg = await Pg.findOne({ uuid: pgId });
  if (!pg) {
    throw new ApiError(404, "PG not found!");
  }

  // Start a session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // If pictures are uploaded, upload them to Cloudinary
    const pictureFiles = req.files || null;
    const pictureUrls = [];
    if (pictureFiles && pictureFiles.length > 0) {
      for (const file of pictureFiles) {
        const uploadedUrl = await uploadFileOnCloudinary(file.path); // Implement your Cloudinary uploader
        if (uploadedUrl) {
          pictureUrls.push(uploadedUrl);
        }
      }
    }

    // Add the new room
    const newRoom = {
      type,
      features: JSON.parse(features),
      rates: JSON.parse(rates),
      availability: JSON.parse(availability),
      pictures:
        pictureUrls.length > 0 ? pictureUrls : JSON.parse(pictures || "[]"),
    };

    pg.rooms.push(newRoom);

    // Save the PG with the updated rooms
    await pg.save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res
      .status(201)
      .json(new ResponseHandler(201, "Room added successfully!", newRoom));
  } catch (error) {
    // If any operation fails, abort the transaction
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
    throw new ApiError(500, "Failed to add room. Please try again.");
  }
});

const addPgImages = asyncHandler(async (req, res) => {});

//edit pg
const editPg = asyncHandler(async (req, res) => {
  const { pgId } = req.body;
  const {
    name,
    address,
    gender,
    rooms,
    services,
    description,
    location,
    timings,
    pictures,
    profession,
  } = req.body;

  const owner = req.user._id;

  if (!owner) {
    throw new ApiError(404, "Owner ID not found!");
  }

  // Find the PG by ID
  const pg = await Pg.findOne({ $and: [{ uuid: pgId }, owner] });

  if (!pg) {
    throw new ApiError(404, "PG not found!");
  }

  // Update fields only if they are provided in the request body
  if (name) pg.name = name;
  if (address) pg.address = address;
  if (gender) pg.gender = gender;
  if (rooms) pg.rooms = rooms;
  if (services) pg.services = services;
  if (description) pg.description = description;
  if (location) pg.location = location;
  if (timings) pg.timings = timings;
  if (pictures) pg.pictures = pictures;
  if (profession) pg.profession = profession;

  // Save the updated PG document
  await pg.save();

  return res
    .status(200)
    .json(new ResponseHandler(200, "PG updated successfully!", pg));
});

//remove pg
const removePg = asyncHandler(async (req, res) => {
  const { pgId } = req.body;
  const owner = req.user._id;

  if (!owner) {
    throw new ApiError(404, "Owner ID not found!");
  }

  // Find the PG by ID
  const pg = await Pg.findOne({ $and: [{ uuid: pgId }, owner] });

  if (!pg) {
    throw new ApiError(404, "PG not found!");
  }

  // Mark PG as deleted (soft delete) rather than removing from DB (to preserve data)
  pg.deleted = true;
  await pg.save();

  return res
    .status(200)
    .json(
      new ResponseHandler(200, `PG with UUID ${pgId} removed successfully!`)
    );
});

//get pg
const getPg = asyncHandler(async (req, res) => {
  const owner = req.user._id;

  if (!owner) {
    throw new ApiError(404, "Owner ID not found!");
  }

  const pg = await Pg.find({ owner }).select(
    "-_id uuid name address isAdminVerified rating pictures"
  );

  if (!pg) {
    return res.status(200).json(new ResponseHandler(200, "No PG listed!"));
  }

  return res
    .status(200)
    .json(new ResponseHandler(200, "PG fetched successfully!", pg));
});

//get rooms
const getRooms = asyncHandler(async (req, res) => {
  const owner = req.user._id;
  const { pgId } = req.params;
  console.log(pgId);
  if (!owner || !pgId) {
    throw new ValidationError("Owner ID and PG ID required!");
  }

  const room = await Pg.findOne({ $and: [{ owner }, { uuid: pgId }] }).select(
    "-_id name rooms"
  );

  if (!room) {
    return res.status(200).json(new ResponseHandler(200, "No Rooms found!"));
  }

  return res
    .status(200)
    .json(new ResponseHandler(200, "Rooms fetched successfully!", room));
});

//get all bookings
const getAllBookings = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  if (!userId) {
    throw new ValidationError("User ID is required!");
  }

  // Fetch the PGs owned by the user
  const pg = await Pg.find({ owner: userId }).select("_id");
  if (!pg || pg.length === 0) {
    return res
      .status(200)
      .json(new ResponseHandler(200, "You have not added any PG yet!"));
  }

  // Fetch bookings based on the PG IDs
  const bookings = await Booking.find({
    pg: { $in: pg.map((p) => p._id) },
    status: "approved",
  })
    .populate("user", "name email")
    .populate("pg", "name address gender");

  if (bookings.length === 0) {
    return res.status(200).json(new ResponseHandler(200, "No bookings found."));
  }

  return res
    .status(200)
    .json(new ResponseHandler(200, "Bookings fetched successfully.", bookings));
});

module.exports = {
  addPg,
  addRoom,
  editPg,
  removePg,
  getPg,
  getRooms,
  getAllBookings,
};
