"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const registerUser_usecase_1 = require("../../../application/use-cases/registerUser.usecase");
const loginUser_usecase_1 = require("../../../application/use-cases/loginUser.usecase");
const forgotPassword_usecase_1 = require("../../../application/use-cases/forgotPassword.usecase");
const verifyOtp_usecase_1 = require("../../../application/use-cases/verifyOtp.usecase");
const resendOtp_usecase_1 = require("../../../application/use-cases/resendOtp.usecase");
const changePassword_usecase_1 = require("../../../application/use-cases/changePassword.usecase");
const changePasswordWithToken_usecase_1 = require("../../../application/use-cases/changePasswordWithToken.usecase");
const user_repository_1 = require("../../../infrastructure/repositories/user.repository");
const otp_repository_1 = require("../../../infrastructure/repositories/otp.repository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userRepository = new user_repository_1.UserRepository();
const otpRepository = new otp_repository_1.OtpRepository();
class AuthController {
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
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password, confirmPassword } = req.body;
            const useCase = new registerUser_usecase_1.RegisterUserUseCase(userRepository);
            try {
                const user = yield useCase.execute(firstName, lastName, email, password, confirmPassword);
                return res
                    .status(201)
                    .json({ message: "User registered successfully", user });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
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
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const useCase = new loginUser_usecase_1.LoginUserUseCase(userRepository);
            try {
                const result = yield useCase.execute(email, password);
                return res.status(200).json(result);
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
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
    static forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const useCase = new forgotPassword_usecase_1.ForgotPasswordUseCase(userRepository, otpRepository);
            try {
                yield useCase.execute(email);
                return res.status(200).json({ message: "OTP sent to email" });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
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
    static verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, otp } = req.body;
            const useCase = new verifyOtp_usecase_1.VerifyOtpUseCase(userRepository, otpRepository);
            try {
                const result = yield useCase.execute(email, otp);
                return res.status(200).json({
                    message: "OTP verified successfully",
                    temporaryPassword: result.temporaryPassword,
                    temporaryPasswordExpireAt: result.temporaryPasswordExpiresAt,
                });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
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
    static resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            const useCase = new resendOtp_usecase_1.ResendOtpUseCase(userRepository, otpRepository);
            try {
                yield useCase.execute(email);
                return res.status(200).json({ message: "New OTP sent to email" });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
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
    static changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, temporaryPassword, password, confirmPassword } = req.body;
            const useCase = new changePassword_usecase_1.ChangePasswordUseCase(userRepository);
            try {
                yield useCase.execute(email, temporaryPassword, password, confirmPassword);
                return res.status(200).json({ message: "Password changed successfully" });
            }
            catch (error) {
                return res.status(400).json({ message: error.message });
            }
        });
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
    static changePasswordWithToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                const userId = decoded.id;
                if (!userId) {
                    return res.status(401).json({ message: "Invalid token" });
                }
                const { password, confirmPassword } = req.body;
                const useCase = new changePasswordWithToken_usecase_1.ChangePasswordWithTokenUseCase(userRepository);
                yield useCase.execute(userId, password, confirmPassword);
                return res.status(200).json({ message: "Password changed successfully" });
            }
            catch (error) {
                if (error.name === "JsonWebTokenError" ||
                    error.name === "TokenExpiredError") {
                    return res
                        .status(401)
                        .json({ message: "Unauthorized: " + error.message });
                }
                return res.status(400).json({ message: error.message });
            }
        });
    }
}
exports.AuthController = AuthController;
