// routes/auth.router.js
import { Router } from "express";

// Middlewares
import { verifyJWT, verifyRefreshToken } from "../../middlewares/auth.middleware.js";

// Controllers - Auth Flow
import { registerUser } from "../../controllers/auth/register.auth.controller.js";
import { loginUser } from "../../controllers/auth/login.auth.controller.js";
import { logoutUser } from "../../controllers/auth/logoutUser.auth.controller.js";
import { refreshToken } from "../../controllers/auth/refreshToken.auth.controller.js";

// Controllers - User Profile
import { changePassword } from "../../controllers/auth/changePassword.auth.controller.js";
import { updateUser } from "../../controllers/auth/updateUser.auth.controller.js";
import { deleteUser } from "../../controllers/auth/deleteUser.auth.controller.js";

// Controllers - Password Recovery Flow
import { verifyCaptchaAndSendOTP } from "../../controllers/auth/verifyCaptchaAndSendOTP.auth.controller.js";
import { verifyOtp } from "../../controllers/auth/verifyOtp.auth.controller.js";
import { resetPassword } from "../../controllers/auth/resetPassword.auth.controller.js";

const router = Router();

/* 🔐 Public Routes */
router.post("/register", registerUser);
router.post("/login", loginUser);

/* 🔁 Token Handling */
router.post("/refresh-token", verifyRefreshToken, refreshToken);
router.post("/logout", verifyJWT, logoutUser);

/* 👤 User Actions (Protected) */
router.post("/change-password", verifyJWT, changePassword);
router.patch("/update", verifyJWT, updateUser);
router.post("/delete", verifyJWT, deleteUser);

/* 🔒 Forgot Password Flow */
router.post("/verify-captcha-and-send-otp", verifyCaptchaAndSendOTP); // Step 1
router.post("/verify-otp", verifyOtp);                               // Step 2
router.post("/reset-password", resetPassword);                       // Step 3

export default router;
