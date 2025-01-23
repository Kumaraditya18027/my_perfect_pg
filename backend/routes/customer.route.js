const express = require("express");
const router = express.Router();
const authHandler = require("../middlewares/authHandler.js");
const { logoutUser } = require("../controllers/user/auth.controller");
const {
  getAllPgs,
  getPgDetails,
} = require("../controllers/customer/pg.controller.js");

//authentication
router.route("/customer-logout").post(authHandler(), logoutUser);

//pg
router.route("/customer/get-all-pgs").get(authHandler(), getAllPgs);
router.route("/customer/get-pg-details/:pgId").get(authHandler(), getPgDetails);

module.exports = router;
