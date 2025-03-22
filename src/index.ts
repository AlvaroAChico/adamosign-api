import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.config";
import authRoutes from "./adapters/http/routes/auth.routes";
import { loadConfigDatabase } from "./infrastructure/database/mongo-connection";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
loadConfigDatabase();

app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
