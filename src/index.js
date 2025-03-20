"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_config_1 = __importDefault(require("./config/swagger.config"));
const auth_routes_1 = __importDefault(require("./adapters/http/routes/auth.routes"));
const mongo_connection_1 = require("./infrastructure/database/mongo-connection");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3600;
(0, mongo_connection_1.loadConfigDatabase)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_config_1.default));
app.use("/api/auth", auth_routes_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
