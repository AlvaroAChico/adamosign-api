"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
class Otp {
    constructor(id, userId, code, attempts, expiresAt, createdAt) {
        this.id = id;
        this.userId = userId;
        this.code = code;
        this.attempts = attempts;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
    }
}
exports.Otp = Otp;
