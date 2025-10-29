import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger-output.json" assert { type: "json" };
import serverless from "serverless-http";

const app = express();

// Middleware padrão
app.use(express.json());

// Rota Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Exemplo de rota base
app.get("/", (req, res) => {
  res.send("🚀 API PetJoyful rodando no Vercel!");
});

// Exporta como função Serverless
export const handler = serverless(app);
