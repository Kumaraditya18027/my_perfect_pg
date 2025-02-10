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
  getAllBookings,
  addRoom,
  getRooms,
} = require("../controllers/pgowner/pg.controller.js");
const { registerUser } = require("../controllers/pgowner/auth.controller.js");

//authentication
router
  .route("/pgowner-register")
  .post(upload.single("adhaarFile"), registerUser);
router.route("/user-login").post(loginUser);
router.route("/user-logout").post(authHandler(), logoutUser);

//pg
router
  .route("/pgowner/add-pg")
  .post(authHandler(), upload.array("pictureFiles"), addPg);
router.route("/pgowner/edit-pg").patch(authHandler(), editPg);
router.route("/pgowner/remove-pg").delete(authHandler(), removePg);
router.route("/pgowner/get-pg").get(authHandler(), getPg);
router
  .route("/pgowner/add-room")
  .post(authHandler(), upload.array("pictureFiles"), addRoom);
router.route("/pgowner/:pgId/get-rooms").get(authHandler(), getRooms);

//pg booking
router.route("/pgowner/get-all-bookings").get(authHandler(), getAllBookings);

module.exports = router;
