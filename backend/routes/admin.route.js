const express = require("express");
const router = express.Router();
const authHandler = require("../middlewares/authHandler.js");
const {
  loginUser,
  logoutUser,
} = require("../controllers/user/auth.controller");
const {
  createBooking,
  getAllBookings,
  getAllPgsListed,
  getPgVerifyRequests,
  removePg,
  toggleVerifyPg,
  updateBookingStatus,
} = require("../controllers/admin/pg.controller.js");

//authentication
router.route("/admin-login").post(loginUser);
router.route("/admin-logout").post(authHandler, logoutUser);

//pg verification
router
  .route("/admin/get-pgVerification-requests")
  .get(authHandler, getPgVerifyRequests);
router.route("/admin/toggle-pgVerfication").post(authHandler, toggleVerifyPg);

//pg bookings
router.route("/admin/create-booking").post(authHandler, createBooking);
router.route("/admin/get-all-bookings").post(authHandler, getAllBookings);
router
  .route("/admin/update-bookingStatus")
  .patch(authHandler, updateBookingStatus);

//pg operation
router.route("/admin/get-all-pgs").get(authHandler, getAllPgsListed);
router.route("/admin/remove-pg").delete(authHandler, removePg);

module.exports = router;
