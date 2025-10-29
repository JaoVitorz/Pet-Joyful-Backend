// api/index.js
import express from "express";
import serverless from "serverless-http";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger-output.json" assert { type: "json" };
import dotenv from "dotenv";
import connectDB from "../backend/src/database/connection.js";
import app from "../backend/src/app.js";

dotenv.config();

const router = express.Router();

// Conecta com o banco (só se ainda não estiver conectado)
connectDB().then(() => console.log("✅ MongoDB conectado no ambiente Vercel"));

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use("/", app); // usa suas rotas já configuradas no app.js

export const handler = serverless(router);
export default handler;
