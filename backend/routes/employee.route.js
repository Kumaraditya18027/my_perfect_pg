const express = require("express");
const router = express.Router();
const authHandler = require("../middlewares/authHandler.js");
const {
  loginUser,
  logoutUser,
} = require("../controllers/user/auth.controller");

//authentication
router.route("/login").post(loginUser);
router.route("/logout").post(authHandler(), logoutUser);

module.exports = router;
