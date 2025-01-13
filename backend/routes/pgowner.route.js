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

//authentication
router.route("/user-login").post(loginUser);
router.route("/user-logout").post(authHandler, logoutUser);

//pg
router
  .route("/pgowner/add-pg")
  .post(authHandler, upload.array("pictures", 10), addPg);
router.route("/pgowner/edit-pg").patch(authHandler, editPg);
router.route("/pgowner/remove-pg").delete(authHandler, removePg);
router.route("/pgowner/get-pg").get(authHandler, getPg);

module.exports = router;
