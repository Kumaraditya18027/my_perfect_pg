const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/user/auth.controller");
const { getAllPgs } = require("../controllers/customer/pg.controller.js");
const authHandler = require("../middlewares/authHandler.js");
const { createBooking } = require("../controllers/admin/pg.controller.js");

//authentication
router.route("/user-register").post(registerUser);
router.route("/user-login").post(loginUser);
router.route("/user-logout").post(authHandler(), logoutUser);

//get all pgs
router.route("/user/get-all-pgs").get(getAllPgs);

//pg bookings
router.route("/user/create-booking").post(authHandler(), createBooking);

module.exports = router;
