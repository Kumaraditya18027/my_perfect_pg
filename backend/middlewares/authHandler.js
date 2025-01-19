const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils/customErrorHandler");
const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");

const authHandler = () =>
  asyncHandler(async (req, res, next) => {
    try {
      // Retrieve the access token from headers
      const accessToken =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
      if (!accessToken) {
        throw new ApiError(401, "No access token provided.");
      }

      // Decode the token without verifying to check expiration
      const decodedToken = jwt.decode(accessToken);
      if (!decodedToken || !decodedToken.exp) {
        throw new ApiError(401, "Invalid access token format.");
      }

      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();

      // If the token is expired, respond with an error
      if (currentTime >= expirationTime) {
        throw new ApiError(401, "Access token has expired.");
      }

      // Verify the token
      const verifiedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
      );

      // Fetch the user details (excluding sensitive information)
      const user = await User.findById(verifiedToken._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Invalid access token.");
      }

      // Attach the user to the request object
      req.user = user;

      // Proceed to the next middleware
      next();
    } catch (error) {
      // Handle JWT-specific errors
      if (error instanceof jwt.JsonWebTokenError) {
        return next(new ApiError(401, "Invalid or expired access token."));
      }
      // For any other errors, propagate them
      next(error);
    }
  });

module.exports = authHandler;
