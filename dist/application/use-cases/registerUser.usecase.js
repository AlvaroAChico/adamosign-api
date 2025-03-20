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
exports.RegisterUserUseCase = void 0;
const user_entity_1 = require("../../domain/models/user.entity");
const registerUser_validator_1 = require("../../validators/registerUser.validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class RegisterUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(firstName, lastName, email, password, confirmPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            yield registerUser_validator_1.registerUserSchema.validate({
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
            });
            const existingUser = yield this.userRepository.findByEmail(email);
            if (existingUser) {
                throw new Error("User already exists");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = new user_entity_1.User(null, firstName, lastName, email, hashedPassword, true, "", undefined, new Date(), new Date());
            return yield this.userRepository.create(user);
        });
    }
}
exports.RegisterUserUseCase = RegisterUserUseCase;
