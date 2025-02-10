//register user - pgowner
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
//local imports
const { ApiError } = require("../../utils/customErrorHandler");
const ResponseHandler = require("../../utils/responseHandler");
const asyncHandler = require("../../utils/asyncHandler");
const User = require("../../models/user.model");
const uploadFileOnCloudinary = require("../../utils/cloudinary");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  //checking if any field is unfilled
  if (!name || !email || !phone) {
    throw new ApiError(400, "All fields are required !");
  }

  //checking if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  let newUUID;
  let existingUUID;

  //checking if same uuid exists
  do {
    newUUID = uuidv4();
    existingUUID = await User.findOne({ uuid: newUUID });
  } while (existingUUID);

  console.log(req.files);
  // Pdf file for adhaar
  const adhaarFile = req.file || null;

  if (!adhaarFile) {
    throw new ApiError(400, "Adhaar card must be uploaded!");
  }
  let adhaarUrl;
  const uploadedUrl = await uploadFileOnCloudinary(adhaarFile.path); // Upload file
  if (uploadedUrl) {
    adhaarUrl = uploadedUrl; // Add the uploaded URL to the adhaar url
  }

  //creating new user
  const user = await User.create({
    uuid: newUUID,
    name,
    email,
    password: "pgpgpgpg#1212&212121",
    phone,
    adhaar: adhaarUrl,
  });

  //checking if user is created successfully
  const createdUser = await User.findById(user._id).select("-_id -password");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong!");
  }
  return res
    .status(200)
    .json(
      new ResponseHandler(
        201,
        "PG owner's account is created successfully",
        createdUser
      )
    );
});

module.exports = { registerUser };
