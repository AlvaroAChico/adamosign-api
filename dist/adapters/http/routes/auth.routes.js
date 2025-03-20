"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const asyncHandler_1 = require("../../../utils/asyncHandler");
const router = (0, express_1.Router)();
router.post("/register", (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.register));
router.post("/login", (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.login));
router.post("/forgot-password", (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.forgotPassword));
router.post("/verify-otp", (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.verifyOtp));
router.post("/resend-otp", (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.resendOtp));
router.post("/change-password", (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.changePassword));
router.post("/change-password-auth", (0, asyncHandler_1.asyncHandler)(auth_controller_1.AuthController.changePasswordWithToken));
exports.default = router;
