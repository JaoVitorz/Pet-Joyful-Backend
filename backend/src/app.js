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
  origin: ['https://pet-joyful-backend.onrender.com', 'http://localhost:10000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));
app.use(express.json());

// Rotas principais
app.use("/api", routes);

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
