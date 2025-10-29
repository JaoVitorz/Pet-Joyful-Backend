import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import fs from 'fs';




const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rotas principais
app.use("/api", routes);

// Rota base (teste)
app.get("/", (req, res) => {
  res.send("🚀 API Pet Joyful funcionando!");
});


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'swagger-output.json'), 'utf8')
);

;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Tentativa de habilitar Swagger UI se a dependência estiver instalada
// Tentativa de habilitar Swagger UI se a dependência estiver instalada
(async () => {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const { fileURLToPath } = await import("url");
    const swaggerUi = (await import("swagger-ui-express")).default;

    // Determina o caminho para backend/src/config/swagger.json
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const swaggerPath = path.join(__dirname, "config", "swagger.json");

    // Serve Swagger UI, but read the JSON file on each request so updates
    // to `backend/src/config/swagger.json` appear immediately without
    // restarting the server.
    app.use("/api-docs", swaggerUi.serve, async (req, res, next) => {
      try {
        const swaggerRaw = fs.readFileSync(swaggerPath, "utf8");
        const swaggerDocument = JSON.parse(swaggerRaw);
        return swaggerUi.setup(swaggerDocument)(req, res, next);
      } catch (e) {
        console.error(
          "Erro ao ler swagger.json:",
          e && e.message ? e.message : e
        );
        return next(e);
      }
    });
    console.log(
      "✅ Swagger UI disponível em /api-docs (serving dynamic swagger.json)"
    );
  } catch (err) {
    console.warn(
      "⚠️ Swagger não habilitado (execute: npm install swagger-ui-express)"
    );
    console.warn(err && err.message ? err.message : err);
  }
})();

export default app;
