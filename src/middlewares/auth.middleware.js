import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) {
      throw new ApiError(401, "Unauthorized request");
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // Access token expired. Attempt to refresh.
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
          throw new ApiError(401, "Session expired. Please log in again.");
        }

        const decodedRefreshToken = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decodedRefreshToken._id);
        if (!user || user.refreshToken !== refreshToken) {
          throw new ApiError(401, "Invalid refresh token");
        }

        // Generate new tokens
        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        // Save new refresh token in the database
        user.refreshToken = newRefreshToken;
        await user.save();

        // Set new tokens in cookies
        res.cookie("accessToken", newAccessToken, {
          // httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          path: '/',
          secure: false, // Disable Secure for local development
          sameSite: 'Strict',
        });
        res.cookie("refreshToken", newRefreshToken, {
          // httpOnly: true,
          // secure: process.env.NODE_ENV === "production",
          path: '/',
          secure: false, // Disable Secure for local development
          sameSite: 'Strict',
        });

        decodedToken = jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SECRET);
      } else {
        throw new ApiError(401, "Invalid access token");
      }
    }

    req.user = await User.findById(decodedToken._id).select("-password -refreshToken");
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Unauthorized");
  }
});

export const verifyRefreshToken = asyncHandler(async (req, res, next) => {
  const refreshToken =
    req.cookies?.refreshToken || req.header("x-refresh-token");

  if (!refreshToken) {
    throw new ApiError(403, "Session Expired. Login Again");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(403, "User not found");
    }

    // optional strict check
    if (user.refreshToken !== refreshToken) {
      console.log("Mismatch between sent and stored refresh token");
      throw new ApiError(403, "Token invalid or session expired. Please log in again.");
    }

    req.user = user; // attach user to request
    next();
  } catch (err) {
    console.error("🔴 Refresh token verification failed:", err);
    throw new ApiError(401, "Refresh token invalid or expired");
  }
});