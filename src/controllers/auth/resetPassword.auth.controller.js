import bcrypt from "bcrypt";

export const resetPassword = async (req, res, next) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) throw new ApiError(400, "Missing data");

    const { email } = jwt.verify(resetToken, process.env.RESET_PASSWORD_SECRET);

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
};
