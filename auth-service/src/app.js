import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import verifyApiKey from "./middlewares/verifyApiKey.js";

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota pública
app.get("/", (req, res) => {
  res.json({ 
    service: "Auth Service",
    version: "1.0.0",
    status: "running",
    port: process.env.PORT || 5000
  });
});

// Rota de health check
app.get("/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date() });
});

// Aplicar API Key em todas as rotas /api
app.use("/api", verifyApiKey, routes);

// Swagger UI
(async () => {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const swaggerUi = (await import('swagger-ui-express')).default;

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const swaggerPath = path.join(__dirname, 'config', 'swagger.json');

    const swaggerRaw = fs.readFileSync(swaggerPath, 'utf8');
    const swaggerDocument = JSON.parse(swaggerRaw);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log('✅ Swagger UI disponível em /api-docs');
  } catch (err) {
    console.warn('⚠️ Swagger não habilitado:', err.message);
  }
})();

export default app;