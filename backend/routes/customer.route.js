const express = require("express");
const router = express.Router();
const authHandler = require("../middlewares/authHandler.js");
const upload = require("../utils/uploader.js");
const { logoutUser } = require("../controllers/user/auth.controller");
const {
  getAllPgs,
  getPgDetails,
  getNearbyPGs,
} = require("../controllers/customer/pg.controller.js");
const {
  bookmarkPg,
  editProfile,
  getBookmarkedPgs,
  getMyBookings,
} = require("../controllers/customer/profile.controller.js");

//authentication
router.route("/customer-logout").post(authHandler(), logoutUser);

//pg
router.route("/customer/get-all-pgs").get(authHandler(), getAllPgs);
router.route("/customer/get-nearby-pg").get(authHandler(), getNearbyPGs);
router.route("/customer/get-pg-details/:pgId").get(authHandler(), getPgDetails);
router.route("/customer/bookmark-pg").post(authHandler(), bookmarkPg);
router.route("/customer/get-my-bookings").get(authHandler(), getMyBookings);

//profile
router.route("/customer/edit-profile").patch(authHandler(), editProfile);
router
  .route("/customer/upload-avatar")
  .patch(authHandler(), upload.single("avatar"), editProfile);

module.exports = router;
