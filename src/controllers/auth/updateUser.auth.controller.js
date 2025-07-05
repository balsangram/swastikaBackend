import Joi from "joi";
import User from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";

// Joi schema for allowed fields
const updateSchema = Joi.object({
  name: Joi.string().trim(),
  userName: Joi.string().trim(),
  email: Joi.string().email().trim().lowercase(),
  phoneNo: Joi.string().trim(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
  color: Joi.string().valid('red', 'green', 'pink', 'none'),
  xander: Joi.string(),
}).min(1); // at least one field must be present

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.user?._id; // assuming JWT auth middleware sets req.user

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const updates = await updateSchema.validateAsync(req.body);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password -refreshToken -tokens");

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({ success: false, message: error.message });
    }
    next(error);
  }
};
