const express = require("express");
const router = express.Router();
const authHandler = require("../middlewares/authHandler.js");
const {
  loginUser,
  logoutUser,
} = require("../controllers/user/auth.controller");
const {
  getAllBookings,
  getAllPgsListed,
  getPgVerifyRequests,
  removePg,
  toggleVerifyPg,
  updateBookingStatus,
} = require("../controllers/admin/pg.controller.js");
const {
  addUser,
  removeUser,
  editUser,
  getAllPgOwners,
  verifyPGOwner,
  getEmployees,
  assignEmployee,
} = require("../controllers/admin/user.controller.js");

//authentication
router.route("/admin-login").post(loginUser);
router.route("/admin-logout").post(authHandler(), logoutUser);

//user management
router.route("/add-user").post(authHandler(), addUser);
router.route("/remove-user").delete(authHandler(), removeUser);
router.route("/edit-user").patch(authHandler(), editUser);
router.route("/get-pgowners").get(authHandler(), getAllPgOwners);
router.route("/verify-pgowner").patch(authHandler(), verifyPGOwner);
router.route("/get-employee").get(authHandler(), getEmployees);
router.route("/assign-employee").patch(authHandler(), assignEmployee);

//pg verification
router
  .route("/get-pgVerification-requests")
  .get(authHandler(), getPgVerifyRequests);
router.route("/toggle-pgVerfication").post(authHandler(), toggleVerifyPg);

//pg bookings
router.route("/get-all-bookings").get(authHandler(), getAllBookings);
router.route("/update-bookingStatus").patch(authHandler(), updateBookingStatus);

//pg operation
router.route("/get-all-pgs").get(authHandler(), getAllPgsListed);
router.route("/remove-pg").delete(authHandler(), removePg);

module.exports = router;
