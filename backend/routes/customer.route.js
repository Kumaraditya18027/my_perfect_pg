const express = require("express");
const router = express.Router();
const authHandler = require("../middlewares/authHandler.js");
const { logoutUser } = require("../controllers/user/auth.controller");
const { getAllPgs } = require("../controllers/customer/pg.controller.js");

//authentication
router.route("/customer-logout").post(authHandler, logoutUser);

//pg
router.route("/customer/get-all-pgs").post(authHandler, getAllPgs);

module.exports = router;
