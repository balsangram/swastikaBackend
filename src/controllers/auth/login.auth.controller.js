import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import User from "../../models/user.model.js";

const DUMMY_DEVICE_TOKEN = "dummy-device-token";

// ✅ Login schema
export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().optional(),
  phoneNo: Joi.string().pattern(/^[0-9]{10}$/).optional(),
  userName: Joi.string().alphanum().min(3).max(30).optional(),
  password: Joi.string().min(6).required(),
  token: Joi.string().optional(),
}).or("email", "phoneNo", "userName");

// ✅ Token generators
const generateAccessToken = (user) =>
  jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (user) =>
  jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

// ✅ Main Login Controller
export const loginUser = asyncHandler(async (req, res) => {
  console.log("📥 Login Request:", req.body);

  const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((e) => e.message).join(", ");
    throw new ApiError(400, `Validation error: ${message}`);
  }

  const { email, phoneNo, userName, password, token } = value;

  const user = await User.findOne({
    $or: [
      email ? { email } : null,
      phoneNo ? { phoneNo } : null,
      userName ? { userName } : null,
    ].filter(Boolean), // Removes null conditions
  });

  if (!user) throw new ApiError(404, "User not found");

  console.log("👤 Found:", user.userName);

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    console.log("❌ Password mismatch");
    throw new ApiError(401, "Invalid credentials");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const deviceToken = token || DUMMY_DEVICE_TOKEN;

  user.tokens.push({
    token: deviceToken,
    device: req.headers["user-agent"] || "unknown",
  });
  user.refreshToken = refreshToken;
  await user.save();

  // 🍪 Set cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // 🔐 true in production
    sameSite: "Strict",
    path: "/",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: user.toJSON(),
  });
});
