import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

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

// Tentativa de habilitar Swagger UI se a dependência estiver instalada
// Tentativa de habilitar Swagger UI se a dependência estiver instalada
(async () => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const swaggerUi = (await import('swagger-ui-express')).default;

    // Determina o caminho para backend/src/config/swagger.json
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const swaggerPath = path.join(__dirname, 'config', 'swagger.json');

    const swaggerRaw = fs.readFileSync(swaggerPath, 'utf8');
    const swaggerDocument = JSON.parse(swaggerRaw);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('✅ Swagger UI disponível em /api-docs');
  } catch (err) {
    console.warn('⚠️ Swagger não habilitado (execute: npm install swagger-ui-express)');
    console.warn(err && err.message ? err.message : err);
  }
})();

export default app;
