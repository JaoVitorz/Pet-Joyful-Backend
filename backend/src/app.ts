import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index.js';
import chatRoutes from './routes/chatRoutes.js';
import {requestLogger} from './middlewares/requestLogger.js';
import {logger} from './logger/logger.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

const resolveSwaggerPath = () => {
  const candidates = [
    path.resolve(process.cwd(), 'backend/src/config/swagger.json'),
    path.resolve(process.cwd(), 'dist/backend/src/config/swagger.json'),
  ];

  return (
    candidates.find(candidate => fs.existsSync(candidate)) ?? candidates[0]
  );
};

// Middlewares globais
app.use(
  cors({
    origin: [
      'https://pet-joyful-backend-1.onrender.com',
      'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'accept'],
  }),
);
app.use(express.json());

app.use(requestLogger);

// Rota protegida de exemplo
app.get('/api/protected', (req, res) => {
  // Simula acesso negado
  res.status(401).json({
    error: 'Acesso não autorizado. Token inválido ou ausente.',
  });
});

app.get('/api/slow', async (_req, res) => {
  await new Promise(resolve => setTimeout(resolve, 2000)); // espera 2 segundos
  res.json({message: 'Resposta lenta'});
});

/*app.get('/api/fail', (_req, _res) => {
  // Simula um erro interno
  throw new Error('Erro forçado para teste');
});
*/
app.use('/api/chat', chatRoutes);
// Rotas principais
app.use('/api', routes);

// Rota base (teste)
app.get('/', (_req, res) => {
  logger.info('Health check');
  res.send('🚀 API Pet Joyful funcionando!');
});

// Swagger
let swaggerDocument: object = {};

try {
  const swaggerPath = resolveSwaggerPath();
  const swaggerData = fs.readFileSync(swaggerPath, 'utf8');
  swaggerDocument = JSON.parse(swaggerData) as object;
  console.log('✅ Swagger carregado com sucesso!');
} catch (err) {
  console.error('❌ Erro ao carregar swagger.json:', (err as Error).message);
}
app.use(errorHandler);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
