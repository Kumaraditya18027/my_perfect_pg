const User = require("../../models/user.model");
const asyncHandler = require("../../utils/asyncHandler");
const {
  ValidationError,
  ApiError,
  NotFoundError,
} = require("../../utils/customErrorHandler");
const ResponseHandler = require("../../utils/responseHandler");

//add user (pgowner/employee/user)
const addUser = asyncHandler(async (req, res) => {
  const { name, email, username, password, role } = req.body;
  const adminId = req.user._id;

  if (!adminId || !name || !email || !password || !role) {
    throw new ValidationError("All fields are required !");
  }

  const admin = await User.findOne({
    $and: [{ _id: adminId }, { role: "admin" }],
  }).select("uuid role");

  if (!admin) {
    throw new NotFoundError("Admin not found!");
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

//remove user (pgowner/employee/user)
const removeUser = asyncHandler(async (req, res) => {
  const { uuid, userRole } = req.params; // Assuming the UUID is passed in the request params
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

  if (!uuid || !userRole) {
    throw new ValidationError("User UUID and role are required!");
  }

  // Check if the user exists
  const user = await User.findOne({ $and: [uuid, userRole] }).select(
    "-_id -password -refreshToken"
  );

  if (!user || !userRole) {
    throw new ApiError(404, "User not found!");
  }

  // Remove the user
  await User.deleteOne({ uuid });

  return res
    .status(200)
    .json(
      new ResponseHandler(200, `User with UUID ${uuid} removed successfully!`)
    );
});

//edit user
const editUser = asyncHandler(async (req, res) => {
  const { uuid, userRole } = req.params; // Assuming the UUID is passed in the request params
  const { name, email, username, password, role } = req.body;
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

  if (!uuid || !userRole) {
    throw new ValidationError("User UUID and role are required!");
  }

  // Find the user by UUID
  const user = await User.findOne({ $and: [uuid, userRole] }).select(
    "-_id -password -refreshToken"
  );

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  // Update user details
  if (name) user.name = name;
  if (email) user.email = email;
  if (username) user.username = username;
  if (password) user.password = password; // You might want to hash the password here
  if (role) user.role = role;

  // Save updated user
  await user.save();

  return res
    .status(200)
    .json(
      new ResponseHandler(
        200,
        `User ${user.username} updated successfully!`,
        user
      )
    );
});

module.exports = {
  addUser,
  removeUser,
  editUser,
};
