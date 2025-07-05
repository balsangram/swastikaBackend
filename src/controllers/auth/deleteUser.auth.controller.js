import User from "../../models/user.model.js"; // Adjust path if needed
import { ApiError } from "../../utils/ApiError.js";

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user?._id; // assuming user is authenticated via middleware like verifyJWT

    if (!userId) {
      throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    await User.findByIdAndDelete(userId);

    // Optionally: clear tokens from cookies
    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    res.status(200).json({ success: true, message: "User account deleted successfully" });
  } catch (err) {
    next(err);
  }
};
