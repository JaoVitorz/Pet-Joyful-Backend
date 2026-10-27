import express from 'express';
import mongoose from 'mongoose';
import './config/mongooseSecurity.js';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import swaggerUi from 'swagger-ui-express';
import routes from './routes/index.js';
import chatRoutes from './routes/chatRoutes.js';
import {requestLogger} from './middlewares/requestLogger.js';
import {logger} from './logger/logger.js';
import errorHandler from './middlewares/errorHandler.js';
import {apiLimiter} from './middlewares/rateLimiter.js';
import {allowedOrigins} from './config/allowedOrigins.js';
import inputGuard from './middlewares/inputGuard.js';

const app = express();

const resolveSwaggerPath = () => {
  const candidates = [
    path.resolve(process.cwd(), 'backend/src/config/swagger-output.json'),
    path.resolve(process.cwd(), 'dist/backend/src/config/swagger-output.json'),
    path.resolve(process.cwd(), 'backend/src/config/swagger.json'),
  ];

  return (
    candidates.find(candidate => fs.existsSync(candidate)) ?? candidates[0]
  );
};

// Middlewares globais
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"], // Swagger UI usa CSS embutido.
        imgSrc: ["'self'", 'data:'],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
      },
    },
    frameguard: {action: 'sameorigin'},
  }),
);
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'accept'],
  }),
);
app.use(express.json());
app.use(inputGuard);

app.use(requestLogger);

app.get('/health/live', (_req, res) => res.status(200).json({status: 'ok'}));
app.get('/health/ready', async (_req, res) => {
  const dependencies: Record<string, 'ok' | 'unavailable'> = {
    database: mongoose.connection.readyState === 1 ? 'ok' : 'unavailable',
  };
  const postsServiceUrl = process.env.POSTS_SERVICE_URL;
  if (postsServiceUrl) {
    try {
      const response = await fetch(new URL('/health/ready', postsServiceUrl), {signal: AbortSignal.timeout(2000)});
      dependencies.postsService = response.ok ? 'ok' : 'unavailable';
    } catch {
      dependencies.postsService = 'unavailable';
    }
  }
  const ready = Object.values(dependencies).every(status => status === 'ok');
  res.status(ready ? 200 : 503).json({status: ready ? 'ready' : 'unavailable', dependencies});
});

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
// Rotas principais
app.use("/api", apiLimiter);
app.use('/api/chat', chatRoutes);
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
