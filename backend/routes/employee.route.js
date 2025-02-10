const express = require("express");
const router = express.Router();
const authHandler = require("../middlewares/authHandler.js");
const {
  loginUser,
  logoutUser,
} = require("../controllers/user/auth.controller");
const {
  getAllBookings,
  getPgVerifyRequests,
  toggleVerifyPg,
  updateBookingStatus,
} = require("../controllers/admin/pg.controller.js");
const {
  getAllPgOwners,
  verifyPGOwner,
  getEmployees,
  assignEmployee,
} = require("../controllers/admin/user.controller.js");

//authentication
router.route("/login").post(loginUser);
router.route("/logout").post(authHandler(), logoutUser);

//manage pg owner
router.route("/get-pgowners").get(authHandler(), getAllPgOwners);
router.route("/verify-pgowner").patch(authHandler(), verifyPGOwner);

//manage employees
router.route("/get-employees").get(authHandler(), getEmployees);
router.route("/assign-employee").patch(authHandler(), assignEmployee);

//pg verification
router
  .route("/get-pgVerification-requests")
  .get(authHandler(), getPgVerifyRequests);
router.route("/toggle-pgVerfication").post(authHandler(), toggleVerifyPg);

//pg bookings
router.route("/get-all-bookings").get(authHandler(), getAllBookings);
router.route("/update-bookingStatus").patch(authHandler(), updateBookingStatus);

module.exports = router;
