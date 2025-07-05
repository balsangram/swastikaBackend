import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { sendEmail } from "../../utils/sendEmail.js"; // You must create this

const otpMap = new Map(); // Use Redis or DB in production

export const verifyCaptchaAndSendOTP = async (req, res, next) => {
  try {
    const { captchaToken, email } = req.body;

    if (!captchaToken || !email) throw new ApiError(400, "Email and captchaToken required");

    // Verify reCAPTCHA
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: captchaToken,
        },
      }
    );

    if (!response.data.success || response.data.score < 0.5) {
      throw new ApiError(403, "Captcha verification failed");
    }

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found");

    // Generate OTP (6 digit)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpMap.set(email, { otp, expiresAt });

    // Send OTP via email
    await sendEmail(email, "Your OTP", `Your OTP is: ${otp}`);

    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (err) {
    next(err);
  }
};
