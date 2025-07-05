import Joi from "joi";
import User from "../../models/user.model.js"; // adjust path if needed
import bcrypt from "bcrypt";
import { ApiError } from "../../utils/ApiError.js";

// Joi schema for password change
const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "string.empty": "Old password is required",
  }),
  newPassword: Joi.string().min(6).required().messages({
    "string.empty": "New password is required",
    "string.min": "New password must be at least 6 characters long",
  }),
});

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = await changePasswordSchema.validateAsync(req.body);

    const userId = req.user._id; // assuming user is attached to request by auth middleware
    const user = await User.findById(userId);

    if (!user) throw new ApiError(404, "User not found");

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) throw new ApiError(400, "Old password is incorrect");

    user.password = newPassword; // will be hashed by pre-save middleware
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });

  } catch (err) {
    if (err.isJoi) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
  }
};
