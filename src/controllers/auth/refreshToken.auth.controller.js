import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";

export const refreshToken = async (req, res, next) => {
  try {
    // Get refresh token from cookies (preferred) or header fallback
    const oldRefreshToken =
      req.cookies?.refreshToken || req.header("x-refresh-token");

    if (!oldRefreshToken) {
      throw new ApiError(401, "Refresh token missing");
    }

    // Verify refresh token
    let decoded;
    try {
      decoded = jwt.verify(oldRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded._id);
    if (!user || user.refreshToken !== oldRefreshToken) {
      throw new ApiError(401, "Invalid refresh session. Please log in again.");
    }

    // Generate new tokens
    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    // Save new refresh token to DB (rotation)
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

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (err) {
    next(err);
  }
};
