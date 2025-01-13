const Pg = require("../../models/pg.model");
const asyncHandler = require("../../utils/asyncHandler");
const ResponseHandler = require("../../utils/responseHandler");

//get all pgs
const getAllPgs = asyncHandler(async (req, res) => {
  const pgs = await Pg.find({
    $and: [{ isAdminVerified: true }, { deleted: false }],
  }).select("-_id");

  if (!pgs || pgs.length === 0) {
    return res
      .status(200)
      .json(new ResponseHandler(200, "No PGs listed currently!"));
  }

  return res
    .status(200)
    .json(
      new ResponseHandler(200, "All listed PGs fetched successfully!", pgs)
    );
});

//book a pg visit
const bookPgVisit = asyncHandler(async (req, res) => {});

module.exports = {
  getAllPgs,
  bookPgVisit,
};
