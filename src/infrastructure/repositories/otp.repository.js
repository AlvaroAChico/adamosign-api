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
exports.OtpRepository = void 0;
const otp_entity_1 = require("../../domain/models/otp.entity");
const mongoose_1 = __importStar(require("mongoose"));
const OtpSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.String, ref: "User", required: true },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });
const OtpModel = mongoose_1.default.model("Otp", OtpSchema);
class OtpRepository {
    create(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const created = yield OtpModel.create({
                userId: new mongoose_1.default.Types.ObjectId(otp.userId),
                code: otp.code,
                attempts: otp.attempts,
                expiresAt: otp.expiresAt,
            });
            return new otp_entity_1.Otp(created._id.toString(), created.userId.toString(), created.code, created.attempts, created.expiresAt, created.createdAt);
        });
    }
    findByUserIdAndCode(userId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const otpRecord = yield OtpModel.findOne({ userId, code });
            if (!otpRecord)
                return null;
            return new otp_entity_1.Otp(otpRecord._id.toString(), otpRecord.userId.toString(), otpRecord.code, otpRecord.attempts, otpRecord.expiresAt, otpRecord.createdAt);
        });
    }
    update(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield OtpModel.findByIdAndUpdate(otp.id, {
                userId: otp.userId,
                code: otp.code,
                expiresAt: otp.expiresAt,
            }, { new: true });
            if (!updated)
                throw new Error("OTP not found");
            return new otp_entity_1.Otp(updated._id.toString(), updated.userId.toString(), updated.code, updated.attempts, updated.expiresAt, updated.createdAt);
        });
    }
    deleteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield OtpModel.findByIdAndDelete(id);
        });
    }
    upsert(otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield OtpModel.findOneAndUpdate({ userId: otp.userId }, { code: otp.code, expiresAt: otp.expiresAt }, { upsert: true, new: true, setDefaultsOnInsert: true });
            if (!updated)
                throw new Error("Failed to upsert OTP");
            return new otp_entity_1.Otp(updated._id.toString(), updated.userId.toString(), updated.code, updated.attempts, updated.expiresAt, updated.createdAt);
        });
    }
}
exports.OtpRepository = OtpRepository;
