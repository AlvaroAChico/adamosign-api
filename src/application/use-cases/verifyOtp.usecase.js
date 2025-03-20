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
exports.VerifyOtpUseCase = void 0;
const verityOtp_validator_1 = require("../../validators/verityOtp.validator");
const generateOTP_1 = require("../../utils/generateOTP");
class VerifyOtpUseCase {
    constructor(userRepository, otpRepository) {
        this.userRepository = userRepository;
        this.otpRepository = otpRepository;
    }
    execute(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            yield verityOtp_validator_1.verifyOtpSchema.validate({ email, code });
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error("User does not exist");
            }
            const otpRecord = yield this.otpRepository.findByUserIdAndCode(user._id, code);
            if (!otpRecord) {
                throw new Error("Invalid OTP");
            }
            if (otpRecord.expiresAt < new Date()) {
                throw new Error("OTP has expired");
            }
            yield this.otpRepository.deleteById(otpRecord.id);
            const temporaryPassword = (0, generateOTP_1.generateOTP)(8);
            const temporaryPasswordExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
            user.temporaryPassword = temporaryPassword;
            user.temporaryPasswordExpiresAt = temporaryPasswordExpiresAt;
            // Actualiza el usuario en la base de datos
            yield this.userRepository.update(user);
            return { temporaryPassword, temporaryPasswordExpiresAt };
        });
    }
}
exports.VerifyOtpUseCase = VerifyOtpUseCase;
