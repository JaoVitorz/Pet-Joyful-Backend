import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import swaggerUi from "swagger-ui-express";

const app = express();

// Middlewares globais
app.use(cors({
  origin: ['https://pet-joyful-backend-1.onrender.com', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'accept']
}));
app.use(express.json());

// Pre-flight requests
// Pre-flight requests removed to avoid path-to-regexp issues

// Rotas principais
app.use("/api", routes);
app.use("/auth", routes); // Rota direta para autenticação

// Rota base (teste)
app.get("/", (req, res) => {
  res.send("🚀 API Pet Joyful funcionando!");
});

// --- Swagger (fix para Vercel) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let swaggerDocument = {};

try {
  const swaggerPath = path.join(__dirname, "swagger-output.json");
  const swaggerData = fs.readFileSync(swaggerPath, "utf8");
  swaggerDocument = JSON.parse(swaggerData);
  console.log("✅ Swagger carregado com sucesso!");
} catch (err) {
  console.error("❌ Erro ao carregar swagger-output.json:", err.message);
}

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
