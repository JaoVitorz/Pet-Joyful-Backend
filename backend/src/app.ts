import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index.js';
import chatRoutes from './routes/chatRoutes.js'; // ← 1. importa o chatRoutes

const app = express();

// Middlewares globais
app.use(
  cors({
    origin: [
      'https://pet-joyful-backend-1.onrender.com',
      'http://localhost:5000',
      'http://localhost:3000', // Next.js local
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'accept'],
  }),
);
app.use(express.json());

// Rotas principais
app.use('/api', routes);
app.use('/api/chat', chatRoutes); // ← 2. registra as rotas do chat

// Rota base (teste)
app.get('/', (_req, res) => {
  res.send('🚀 API Pet Joyful funcionando!');
});

// Swagger
let swaggerDocument: object = {};

try {
  console.log('✅ Swagger carregado com sucesso!');
} catch (err) {
  console.error(
    '❌ Erro ao carregar swagger-output.json:',
    (err as Error).message,
  );
}

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;