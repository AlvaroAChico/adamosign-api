import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export async function sendOtpEmail(
  email: string,
  otp: string,
  resend: boolean = false
): Promise<void> {
  const templatePath = path.join(
    __dirname,
    !resend
      ? "./templates/resetPassword.template.html"
      : "./templates/resendOtp.template.html"
  );
  let htmlContent = fs.readFileSync(templatePath, "utf8");
  htmlContent = htmlContent.replace(/{{CODE_OTP}}/g, otp);

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: "Your OTP Code for Password Recovery",
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send OTP email");
  }
}

export async function sendWelcomeEmail(
  email: string,
  firstName: string
): Promise<void> {
  const templatePath = path.join(
    __dirname,
    "./templates/welcome.template.html"
  );

  try {
    let htmlContent = fs.readFileSync(templatePath, "utf8");
    htmlContent = htmlContent.replace(/{{FIRST_NAME}}/g, firstName);

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Welcome to Our Platform!",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Failed to send welcome email");
  }
}

export async function sendPasswordUpdatedEmail(email: string): Promise<void> {
  const templatePath = path.join(
    __dirname,
    "./templates/passwordUpdated.template.html"
  );

  try {
    let htmlContent = fs.readFileSync(templatePath, "utf8");

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Your Password Has Been Updated",
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Password updated email sent: ${info.messageId}`);
  } catch (error) {
    console.error("Error sending password updated email:", error);
    throw new Error("Failed to send password updated email");
  }
}
