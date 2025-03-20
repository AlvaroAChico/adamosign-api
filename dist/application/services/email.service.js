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
exports.transporter = void 0;
exports.sendOtpEmail = sendOtpEmail;
exports.sendWelcomeEmail = sendWelcomeEmail;
exports.sendPasswordUpdatedEmail = sendPasswordUpdatedEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
exports.transporter = nodemailer_1.default.createTransport({
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
function sendOtpEmail(email_1, otp_1) {
    return __awaiter(this, arguments, void 0, function* (email, otp, resend = false) {
        const templatePath = path_1.default.join(__dirname, !resend
            ? "./templates/resetPassword.template.html"
            : "./templates/resendOtp.template.html");
        let htmlContent = fs_1.default.readFileSync(templatePath, "utf8");
        htmlContent = htmlContent.replace(/{{CODE_OTP}}/g, otp);
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Your OTP Code for Password Recovery",
            html: htmlContent,
        };
        try {
            const info = yield exports.transporter.sendMail(mailOptions);
            console.log(`Email sent: ${info.messageId}`);
        }
        catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send OTP email");
        }
    });
}
function sendWelcomeEmail(email, firstName) {
    return __awaiter(this, void 0, void 0, function* () {
        const templatePath = path_1.default.join(__dirname, "./templates/welcome.template.html");
        try {
            let htmlContent = fs_1.default.readFileSync(templatePath, "utf8");
            htmlContent = htmlContent.replace(/{{FIRST_NAME}}/g, firstName);
            const mailOptions = {
                from: process.env.SMTP_FROM,
                to: email,
                subject: "Welcome to Our Platform!",
                html: htmlContent,
            };
            const info = yield exports.transporter.sendMail(mailOptions);
            console.log(`Welcome email sent: ${info.messageId}`);
        }
        catch (error) {
            console.error("Error sending welcome email:", error);
            throw new Error("Failed to send welcome email");
        }
    });
}
function sendPasswordUpdatedEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const templatePath = path_1.default.join(__dirname, "./templates/passwordUpdated.template.html");
        try {
            let htmlContent = fs_1.default.readFileSync(templatePath, "utf8");
            const mailOptions = {
                from: process.env.SMTP_FROM,
                to: email,
                subject: "Your Password Has Been Updated",
                html: htmlContent,
            };
            const info = yield exports.transporter.sendMail(mailOptions);
            console.log(`Password updated email sent: ${info.messageId}`);
        }
        catch (error) {
            console.error("Error sending password updated email:", error);
            throw new Error("Failed to send password updated email");
        }
    });
}
