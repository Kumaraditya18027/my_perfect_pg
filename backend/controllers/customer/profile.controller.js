const Pg = require("../../models/pg.model");
const User = require("../../models/user.model");
const asyncHandler = require("../../utils/asyncHandler");
const uploadFileOnCloudinary = require("../../utils/cloudinary");
const {
  NotFoundError,
  ValidationError,
} = require("../../utils/customErrorHandler");
const ResponseHandler = require("../../utils/responseHandler");

const editProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, bio } = req.body;
  const userId = req.user._id;

  console.log(userId);
  if (!userId) {
    throw new ValidationError("User ID required!");
  }

  const user = await User.findById(userId).select("-refreshToken -password");

  if (!user) {
    throw new NotFoundError("User not found!");
  }

  // Update user details
  if (name) user.name = name;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (bio) user.bio = bio;

  // Save the updated user document
  await user.save();

  // Respond with success message
  return res
    .status(200)
    .json(new ResponseHandler(200, "Profile updated successfully!", user));
});

const bookmarkPg = asyncHandler(async (req, res) => {
  const { pgId } = req.body;
  const userId = req.user._id;
  console.log(userId);

  if (!userId || !pgId) {
    throw new ValidationError("User ID and PG ID required!");
  }

  const user = await User.findById(userId).select(
    "-_id -refreshToken -password"
  );
  if (!user) {
    throw new NotFoundError("User not found!");
  }

  const pg = await Pg.findOne({ uuid: pgId });
  if (!pg) {
    throw new NotFoundError("PG not found!");
  }

  // Update user's bookmarked pg list
  user.bookmarkedPg.push(pg._id);
  await user.save();

  // Respond with success message
  return res
    .status(200)
    .json(new ResponseHandler(200, "PG bookmarked successfully!", user));
});

const uploadProfilePic = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const profilePic = req.files || null;

  if (!userId) {
    throw new ValidationError("User ID required!");
  }

  const user = await User.findById(userId).select(
    "-_id -refreshToken -password"
  );
  if (!user) {
    throw new NotFoundError("User not found!");
  }

  const uploadedUrl = await uploadFileOnCloudinary(profilePic.path); // Upload each file
  if (uploadedUrl) {
    user.avatar = uploadedUrl;
  }

  await user.save();

  // Respond with success message
  return res
    .status(200)
    .json(
      new ResponseHandler(
        200,
        "Profile pic uploaded successfully!",
        user.avatar
      )
    );
});

module.exports = {
  editProfile,
  bookmarkPg,
  uploadProfilePic,
};
