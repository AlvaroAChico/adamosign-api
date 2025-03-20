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
exports.ChangePasswordUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const changePassword_validator_1 = require("../../validators/changePassword.validator");
const email_service_1 = require("../services/email.service");
class ChangePasswordUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(email, temporaryPassword, password, confirmPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield changePassword_validator_1.changePasswordSchema.validate({
                email,
                temporaryPassword,
                password,
                confirmPassword,
            });
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error("User does not exist");
            }
            if (!user.temporaryPassword || !user.temporaryPasswordExpiresAt) {
                throw new Error("Temporary password not set. Please verify OTP first");
            }
            if (user.temporaryPassword !== temporaryPassword) {
                throw new Error("Invalid temporary password");
            }
            if (new Date() > user.temporaryPasswordExpiresAt) {
                throw new Error("Temporary password has expired");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            user.password = hashedPassword;
            user.temporaryPassword = "";
            user.temporaryPasswordExpiresAt = undefined;
            user.firstLogin = false;
            yield this.userRepository.update(user);
            yield (0, email_service_1.sendPasswordUpdatedEmail)(email);
        });
    }
}
exports.ChangePasswordUseCase = ChangePasswordUseCase;
