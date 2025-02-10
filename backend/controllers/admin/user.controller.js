const User = require("../../models/user.model");
const asyncHandler = require("../../utils/asyncHandler");
const {
  ValidationError,
  ApiError,
  NotFoundError,
} = require("../../utils/customErrorHandler");
const ResponseHandler = require("../../utils/responseHandler");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");

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

//get unverified pgowner list
const getAllPgOwners = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "pgowner" }).select("-_id");

  if (!users || users.length === 0) {
    return res
      .status(200)
      .json(new ResponseHandler(200, "No PG Owners available currently!"));
  }

  return res
    .status(200)
    .json(
      new ResponseHandler(200, "PG owners list fetched successfully!", users)
    );
});

//verify pgowner
const verifyPGOwner = asyncHandler(async (req, res) => {
  const { userId, username, password } = req.body;
  const verificationBodyId = req.user._id;

  if (!verificationBodyId || !userId || !username || !password) {
    throw new ApiError(
      400,
      "Admin ID, User ID, username, and password are required!"
    );
  }

  // Find the user by ID
  const user = await User.findOne({ uuid: userId });
  if (!user) {
    throw new NotFoundError("User not found!");
  }

  // Ensure the user is a PG owner
  if (user.role !== "pgowner") {
    throw new ApiError(400, "User is not a PG owner!");
  }

  // Ensure verification body is either employee or admin
  const verificationBody = await User.findById(verificationBodyId);
  console.log(verificationBody.role);
  if (!["admin", "employee"].includes(verificationBody.role)) {
    throw new ApiError(400, "You must be an Admin or Employee!");
  }

  // Set username, hashed password, and mark the PG owner as verified
  user.username = username;
  user.password = password;
  user.isPGOwnerVerified = true;
  await user.save();

  // Create a Nodemailer transporter using environment variables
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Define the email options
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: user.email,
    subject: "Your PG Owner Account is Verified",
    text: `Dear ${user.name},

Your PG Owner account has been verified successfully.

Your login details are:
  Username: ${username}
  Password: ${password}

Please keep these details secure and change your password after logging in.

Thank you,
Team MyPerfectPG`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);

  // Respond with success
  res.status(200).json({
    message: "PG owner verified successfully and email sent.",
    user,
  });
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
  verifyPGOwner,
  getAllPgOwners,
};
