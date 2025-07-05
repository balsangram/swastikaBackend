import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  console.log("🔐 Verifying access token");

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
      console.log("🕓 Access token expired. Trying refresh...");

      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
        throw new ApiError(401, "Session expired. Please log in again.");
      }

      // Validate refresh token
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

      // Update stored refresh token
      user.refreshToken = newRefreshToken;
      await user.save();

      // Set cookies
      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        path: "/",
      });

      // Decode new token for downstream use
      decodedToken = jwt.verify(newAccessToken, process.env.ACCESS_TOKEN_SECRET);
    } else {
      throw new ApiError(401, "Invalid access token");
    }
  }

  req.user = await User.findById(decodedToken._id).select("-password -refreshToken");
  next();
});

export const verifyRefreshToken = asyncHandler(async (req, res, next) => {
  console.log("verifyRefreshToken");
  
  const refreshToken =
    req.cookies?.refreshToken || req.header("x-refresh-token");

  if (!refreshToken) {
    throw new ApiError(403, "Session expired. Login again");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(403, "User not found");
    }

    if (user.refreshToken !== refreshToken) {
      console.log("🚨 Refresh token mismatch");
      throw new ApiError(403, "Invalid session. Please log in again.");
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("🔴 Refresh token verification failed:", err.message);
    throw new ApiError(401, "Invalid or expired refresh token");
  }
});
