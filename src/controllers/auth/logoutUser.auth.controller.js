import User from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const logoutUser = async (req, res, next) => {
    console.log("logOut");
  try {
    // Get tokens from cookies
    const token = req.cookies?.accessToken;
    console.log("🚀 ~ logoutUser ~ token:", token)
    const refreshToken = req.cookies?.refreshToken;
    console.log("🚀 ~ logoutUser ~ refreshToken:", refreshToken)

    if (!token && !refreshToken) {
      throw new ApiError(401, "Access or refresh token missing from cookies");
    }

    // Decode the access token to get user ID
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userId = decoded?._id;

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    // Remove the matching access token
    user.tokens = user.tokens.filter(entry => entry.token !== token);

    // Remove refresh token
    if (user.refreshToken === refreshToken) {
      user.refreshToken = null;
    }

    await user.save();

    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({ success: true, message: "User logged out successfully" });

  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
    next(err);
  }
};
