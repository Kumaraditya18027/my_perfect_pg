const Pg = require("../../models/pg.model");
const asyncHandler = require("../../utils/asyncHandler");
const ResponseHandler = require("../../utils/responseHandler");
const Booking = require("../../models/booking.model");
const User = require("../../models/user.model");

const getDashboardStats = asyncHandler(async (req, res) => {
  // Total Booking Count
  const totalBookingCount = await Booking.countDocuments({});

  // Total Booked PG Count: Count distinct PG IDs from bookings with status "assigned"
  const distinctBookedPgIds = await Booking.distinct("pg", {
    status: "assigned",
  });
  const totalBookedPgCount = distinctBookedPgIds.length;

  // Total PG Count (only PGs not marked as deleted)
  const totalPgCount = await Pg.countDocuments({ deleted: false });

  // Total Employee Count: Users with role "employee"
  const totalEmployeeCount = await User.countDocuments({ role: "employee" });

  // Total Room Count: Sum the length of the rooms array in each PG (only non-deleted PGs)
  const roomsAggregation = await Pg.aggregate([
    { $match: { deleted: false } },
    { $group: { _id: null, totalRooms: { $sum: { $size: "$rooms" } } } },
  ]);
  const totalRoomCount =
    roomsAggregation.length > 0 ? roomsAggregation[0].totalRooms : 0;

  // Construct the dashboard statistics object
  const dashboardStats = {
    totalBookingCount,
    totalBookedPgCount,
    totalPgCount,
    totalEmployeeCount,
    totalRoomCount,
  };

  return res
    .status(200)
    .json(
      new ResponseHandler(
        200,
        "Dashboard statistics fetched successfully",
        dashboardStats
      )
    );
});

module.exports = { getDashboardStats };
