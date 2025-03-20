import { Request, Response } from "express";
import { RegisterUserUseCase } from "../../../application/use-cases/registerUser.usecase";
import { LoginUserUseCase } from "../../../application/use-cases/loginUser.usecase";
import { ForgotPasswordUseCase } from "../../../application/use-cases/forgotPassword.usecase";
import { VerifyOtpUseCase } from "../../../application/use-cases/verifyOtp.usecase";
import { ResendOtpUseCase } from "../../../application/use-cases/resendOtp.usecase";
import { ChangePasswordUseCase } from "../../../application/use-cases/changePassword.usecase";
import { ChangePasswordWithTokenUseCase } from "../../../application/use-cases/changePasswordWithToken.usecase";
import { UserRepository } from "../../../infrastructure/repositories/user.repository";
import { OtpRepository } from "../../../infrastructure/repositories/otp.repository";
import jwt from "jsonwebtoken";

const userRepository = new UserRepository();
const otpRepository = new OtpRepository();

export class AuthController {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               firstName:
   *                 type: string
   *               lastName:
   *                 type: string
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               confirmPassword:
   *                 type: string
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Bad request
   */
  static async register(req: Request, res: Response) {
    const { firstName, lastName, email, password, confirmPassword } = req.body;
    const useCase = new RegisterUserUseCase(userRepository);
    try {
      const user = await useCase.execute(
        firstName,
        lastName,
        email,
        password,
        confirmPassword
      );
      return res
        .status(201)
        .json({ message: "User registered successfully", user });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login a user
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Login successful
   *       400:
   *         description: Invalid credentials
   */
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const useCase = new LoginUserUseCase(userRepository);
    try {
      const result = await useCase.execute(email, password);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /auth/forgot-password:
   *   post:
   *     summary: Send OTP for password recovery
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: OTP sent to email
   *       400:
   *         description: Error sending OTP
   */
  static async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const useCase = new ForgotPasswordUseCase(userRepository, otpRepository);
    try {
      await useCase.execute(email);
      return res.status(200).json({ message: "OTP sent to email" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /auth/verify-otp:
   *   post:
   *     summary: Verify OTP and generate temporary password for password change.
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               otp:
   *                 type: string
   *     responses:
   *       200:
   *         description: OTP verified successfully and temporary password generated.
   *       400:
   *         description: Invalid OTP or error.
   */
  static async verifyOtp(req: Request, res: Response) {
    const { email, otp } = req.body;
    const useCase = new VerifyOtpUseCase(userRepository, otpRepository);
    try {
      const result = await useCase.execute(email, otp);
      return res.status(200).json({
        message: "OTP verified successfully",
        temporaryPassword: result.temporaryPassword,
        temporaryPasswordExpireAt: result.temporaryPasswordExpiresAt,
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /auth/resend-otp:
   *   post:
   *     summary: Resend OTP
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *     responses:
   *       200:
   *         description: New OTP sent to email
   *       400:
   *         description: Error resending OTP
   */
  static async resendOtp(req: Request, res: Response) {
    const { email } = req.body;
    const useCase = new ResendOtpUseCase(userRepository, otpRepository);
    try {
      await useCase.execute(email);
      return res.status(200).json({ message: "New OTP sent to email" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /auth/change-password:
   *   post:
   *     summary: Change user password using OTP and temporary password.
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               temporaryPassword:
   *                 type: string
   *               password:
   *                 type: string
   *               confirmPassword:
   *                 type: string
   *     responses:
   *       200:
   *         description: Password changed successfully
   *       400:
   *         description: Error changing password
   */
  static async changePassword(req: Request, res: Response) {
    const { email, temporaryPassword, password, confirmPassword } = req.body;
    const useCase = new ChangePasswordUseCase(userRepository);
    try {
      await useCase.execute(
        email,
        temporaryPassword,
        password,
        confirmPassword
      );
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * @swagger
   * /auth/change-password-token:
   *   post:
   *     summary: Change user password using token authentication.
   *     tags:
   *       - Auth
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               password:
   *                 type: string
   *               confirmPassword:
   *                 type: string
   *     responses:
   *       200:
   *         description: Password changed successfully
   *       400:
   *         description: Error changing password
   *       401:
   *         description: Unauthorized
   */
  static async changePasswordWithToken(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Missing authorization header" });
      }
      const token = authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Missing token" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      const userId = (decoded as any).id;
      if (!userId) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const { password, confirmPassword } = req.body;
      const useCase = new ChangePasswordWithTokenUseCase(userRepository);
      await useCase.execute(userId, password, confirmPassword);
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error: any) {
      if (
        error.name === "JsonWebTokenError" ||
        error.name === "TokenExpiredError"
      ) {
        return res
          .status(401)
          .json({ message: "Unauthorized: " + error.message });
      }
      return res.status(400).json({ message: error.message });
    }
  }
}
