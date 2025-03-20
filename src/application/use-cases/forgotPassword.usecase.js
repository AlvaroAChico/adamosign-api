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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForgotPasswordUseCase = void 0;
const otp_entity_1 = require("../../domain/models/otp.entity");
const generateOTP_1 = require("../../utils/generateOTP");
const email_service_1 = require("../services/email.service");
const forgotPassword_validator_1 = require("../../validators/forgotPassword.validator");
class ForgotPasswordUseCase {
    constructor(userRepository, otpRepository) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
    }
    execute(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield forgotPassword_validator_1.forgotPasswordSchema.validate({ email });
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error("User does not exist");
            }
            const otpCode = (0, generateOTP_1.generateOTP)();
            const expiresAt = new Date(Date.now() + parseInt(process.env.OTP_EXPIRATION_MINUTES || "15") * 60000);
            const otp = new otp_entity_1.Otp(null, user._id, otpCode, 1, expiresAt, new Date());
            yield this.otpRepository.upsert(otp);
            yield (0, email_service_1.sendOtpEmail)(email, otpCode);
        });
    }
}
exports.ForgotPasswordUseCase = ForgotPasswordUseCase;
