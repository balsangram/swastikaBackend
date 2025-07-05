// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, text, html = null) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS, // app-specific password (not your Gmail password)
      },
    });

    // Email options
    const mailOptions = {
      from: `"Swastic Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html, // optional HTML content
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw error;
  }
};
