const express = require("express");
const router = express.Router();
const authHandler = require("../middlewares/authHandler.js");
const upload = require("../utils/uploader.js");
const {
  loginUser,
  logoutUser,
} = require("../controllers/user/auth.controller");
const {
  addPg,
  editPg,
  removePg,
  getPg,
} = require("../controllers/pgowner/pg.controller.js");
const {
  getAllBookings,
  updateBookingStatus,
} = require("../controllers/admin/pg.controller.js");

//authentication
router.route("/user-login").post(loginUser);
router.route("/user-logout").post(authHandler(), logoutUser);

//pg
router
  .route("/pgowner/add-pg")
  .post(authHandler(), upload.array("pictureFiles"), addPg);
router.route("/pgowner/edit-pg").patch(authHandler(), editPg);
router.route("/pgowner/remove-pg").delete(authHandler(), removePg);
router.route("/pgowner/get-pg").get(authHandler(), getPg);

//pg booking
router.route("/pgowner/get-all-bookings").post(authHandler(), getAllBookings);
router
  .route("/pgowner/update-bookingStatus")
  .patch(authHandler(), updateBookingStatus);

module.exports = router;
