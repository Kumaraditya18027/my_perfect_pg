const asyncHandler = require("../../utils/asyncHandler");
const Pg = require("../../models/pg.model");
const { ApiError } = require("../../utils/customErrorHandler");
const ResponseHandler = require("../../utils/responseHandler");
const uploadFileOnCloudinary = require("../../utils/cloudinary");

//add pg
const addPg = asyncHandler(async (req, res) => {
  const {
    name,
    address,
    gender,
    rooms,
    services,
    description,
    location,
    timings,
    profession,
  } = req.body;

  const owner = req.user._id;

  // Validate required fields
  if (
    !name ||
    !address ||
    !gender ||
    !rooms ||
    !services ||
    !description ||
    !location ||
    !timings ||
    !owner ||
    !profession
  ) {
    throw new ApiError(400, "All required fields must be provided!");
  }

  // multiple files for pictures
  const pictureFiles = req.files;

  if (!pictureFiles || pictureFiles.length === 0) {
    throw new ApiError(400, "At least one picture must be uploaded!");
  }

  // Upload pictures to Cloudinary and collect the URLs
  const pictureUrls = [];

  for (const file of pictureFiles) {
    const uploadedUrl = await uploadFileOnCloudinary(file.path); // Upload each file
    if (uploadedUrl) {
      pictureUrls.push(uploadedUrl); // Add the uploaded URL to the pictures array
    }
  }

  // Create a new PG document with the uploaded picture URLs
  const pg = new Pg({
    name,
    address,
    gender,
    rooms,
    services,
    description,
    location,
    timings,
    pictures: pictureUrls,
    owner,
    profession,
  });

  // Save the PG to the database
  await pg.save();

  return res
    .status(201)
    .json(new ResponseHandler(201, "PG added successfully!", pg));
});

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

  const pg = await Pg.find({ owner }).select("-_id");

  if (!pg) {
    return res.status(200).json(new ResponseHandler(200, "No PG listed!"));
  }

  return res
    .status(200)
    .json(new ResponseHandler(200, "PG fetched successfully!", pg));
});

module.exports = { addPg, editPg, removePg, getPg };
