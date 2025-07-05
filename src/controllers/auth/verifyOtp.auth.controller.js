export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const data = otpMap.get(email);
    if (!data) throw new ApiError(400, "OTP expired or invalid");

    if (Date.now() > data.expiresAt) {
      otpMap.delete(email);
      throw new ApiError(400, "OTP expired");
    }

    if (data.otp !== otp) throw new ApiError(400, "Incorrect OTP");

    // OTP is valid – create a short token to allow password reset
    const resetToken = jwt.sign({ email }, process.env.RESET_PASSWORD_SECRET, {
      expiresIn: "15m",
    });

    otpMap.delete(email); // Remove used OTP

    res.status(200).json({
      success: true,
      message: "OTP verified",
      resetToken, // send this to frontend for next step
    });
  } catch (err) {
    next(err);
  }
};
