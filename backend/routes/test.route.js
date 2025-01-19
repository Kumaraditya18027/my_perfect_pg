const express = require("express");
const { addAdmin } = require("../controllers/test.controller");
const router = express.Router();

//local imports
// const { getAllUser } = require("../controllers/test.controller");

router.route("/add-admin").post(addAdmin);

module.exports = router;
