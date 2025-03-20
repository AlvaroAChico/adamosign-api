"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auth API",
            version: "1.0.0",
            description: "API for user authentication, password recovery via OTP, and first login password change",
        },
        servers: [
            {
                url: "http://localhost:3500",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        "./src/adapters/http/routes/*.ts",
        "./src/adapters/http/controllers/*.ts",
    ],
};
const swaggerSpec = (0, swagger_jsdoc_1.default)(swaggerOptions);
exports.default = swaggerSpec;
