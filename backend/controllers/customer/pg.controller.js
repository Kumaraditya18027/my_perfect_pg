const Pg = require("../../models/pg.model");
const asyncHandler = require("../../utils/asyncHandler");
const { NotFoundError } = require("../../utils/customErrorHandler");
const ResponseHandler = require("../../utils/responseHandler");

//get all pgs
const getAllPgs = asyncHandler(async (req, res) => {
  const pgs = await Pg.find({
    $and: [{ isAdminVerified: true }, { deleted: false }],
  }).select(
    "-_id uuid name address gender rooms services description rating timings pictures location.latitude location.longitude"
  );

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

//get specific pg details
const getPgDetails = asyncHandler(async (req, res) => {
  const { pgId } = req.params;

  // Find the PG by UUID
  const pg = await Pg.findOne({
    uuid: pgId,
  }).select("-_id");

  // Check if the PG exists
  if (!pg) {
    return res
      .status(404)
      .json(new ResponseHandler(404, "PG not found or not available!"));
  }

  // Return success response
  return res
    .status(200)
    .json(new ResponseHandler(200, "PG details fetched successfully!", pg));
});

//book a pg visit
const bookPgVisit = asyncHandler(async (req, res) => {});

module.exports = {
  getAllPgs,
  bookPgVisit,
  getPgDetails,
};
