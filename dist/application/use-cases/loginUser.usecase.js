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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUseCase = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const loginUser_validator_1 = require("../../validators/loginUser.validator");
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
class LoginUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            yield loginUser_validator_1.loginUserSchema.validate({ email, password });
            const user = yield this.userRepository.findByEmail(email);
            if (!user) {
                throw new Error("Invalid credentials");
            }
            const isMatch = yield bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new Error("Invalid credentials");
            }
            const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, JWT_SECRET, {
                expiresIn: "1h",
            });
            // Excluir campos sensibles como contraseña y temporales
            const { password: _, temporaryPassword, temporaryPasswordExpiresAt } = user, userData = __rest(user, ["password", "temporaryPassword", "temporaryPasswordExpiresAt"]);
            return { token, user: userData };
        });
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
