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
exports.ChangePasswordWithTokenUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const changePasswordWithToken_validator_1 = require("../../validators/changePasswordWithToken.validator");
class ChangePasswordWithTokenUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(userId, password, confirmPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield changePasswordWithToken_validator_1.changePasswordWithTokenSchema.validate({
                password,
                confirmPassword,
            });
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            user.password = hashedPassword;
            user.temporaryPassword = "";
            user.temporaryPasswordExpiresAt = undefined;
            user.firstLogin = false;
            yield this.userRepository.update(user);
        });
    }
}
exports.ChangePasswordWithTokenUseCase = ChangePasswordWithTokenUseCase;
