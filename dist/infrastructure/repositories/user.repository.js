"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.UserRepository = void 0;
const user_entity_1 = require("../../domain/models/user.entity");
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: { type: String, required: true },
    firstLogin: { type: Boolean, default: true },
    temporaryPassword: { type: String, required: false },
    temporaryPasswordExpiresAt: { type: Date, required: false },
}, { timestamps: true });
const UserModel = mongoose_1.default.model("User", UserSchema);
class UserRepository {
    create(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = (yield UserModel.create({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
                firstLogin: user.firstLogin,
                temporaryPassword: user.temporaryPassword,
                temporaryPasswordExpiresAt: user.temporaryPasswordExpiresAt,
            }));
            return new user_entity_1.User(created._id.toString(), created.firstName, created.lastName, created.email, created.password, created.firstLogin, created.temporaryPassword, created.temporaryPasswordExpiresAt, created.createdAt, created.updatedAt);
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel.findOne({ email });
            if (!user)
                return null;
            return new user_entity_1.User(user._id.toString(), user.firstName, user.lastName, user.email, user.password, user.firstLogin, user.temporaryPassword, user.temporaryPasswordExpiresAt, user.createdAt, user.updatedAt);
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserModel.findById(id);
            if (!user)
                return null;
            return new user_entity_1.User(user._id.toString(), user.firstName, user.lastName, user.email, user.password, user.firstLogin, user.temporaryPassword, user.temporaryPasswordExpiresAt, user.createdAt, user.updatedAt);
        });
    }
    update(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield UserModel.findByIdAndUpdate(user._id, {
                email: user.email,
                password: user.password,
                firstLogin: user.firstLogin,
                temporaryPassword: user.temporaryPassword,
                temporaryPasswordExpiresAt: user.temporaryPasswordExpiresAt,
            }, { new: true });
            if (!updated)
                throw new Error("User not found");
            return new user_entity_1.User(updated._id.toString(), updated.firstName, updated.lastName, updated.email, updated.password, updated.firstLogin, updated.temporaryPassword, updated.temporaryPasswordExpiresAt, updated.createdAt, updated.updatedAt);
        });
    }
}
exports.UserRepository = UserRepository;
