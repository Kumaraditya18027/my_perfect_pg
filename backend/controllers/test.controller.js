const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const { ValidationError, ApiError } = require("../utils/customErrorHandler");
const { v4: uuidv4 } = require("uuid");
const ResponseHandler = require("../utils/responseHandler");

//add user (pgowner/employee/user)
const addAdmin = asyncHandler(async (req, res) => {
  const { name, email, username, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ValidationError("All fields are required !");
  }

  let newUUID;
  let existingUUID;

  //checking if same uuid exists
  do {
    newUUID = uuidv4();
    existingUUID = await User.findOne({ uuid: newUUID });
  } while (existingUUID);

  const user = await User.create({
    uuid: newUUID,
    name,
    email,
    username,
    password,
    role,
  });

  if (!user) {
    throw new ApiError(500, "Something went wrong! PG Owner not added!");
  }

  return res
    .status(200)
    .json(
      new ResponseHandler(201, `User - ${user.role} added successfully`, user)
    );
});

module.exports = {
  addAdmin,
};
