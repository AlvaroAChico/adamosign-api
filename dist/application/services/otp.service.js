"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOtpExpired = isOtpExpired;
// Función auxiliar para verificar si el OTP ha expirado.
function isOtpExpired(expiresAt) {
    return expiresAt < new Date();
}
