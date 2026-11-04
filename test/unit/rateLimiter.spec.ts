import express from 'express';
import request from 'supertest';
import {apiLimiter, loginLimiter} from '../../backend/src/middlewares/rateLimiter.js';

describe('limites de requisições', () => {
  it('bloqueia a sexta tentativa de login do mesmo IP', async () => {
    const app = express();
    app.post('/login', loginLimiter, (_req, res) => res.sendStatus(204));

    for (let attempt = 0; attempt < 5; attempt++) {
      expect((await request(app).post('/login')).status).toBe(204);
    }
    expect((await request(app).post('/login')).status).toBe(429);
  });

  it('bloqueia a 31ª requisição à API do mesmo IP', async () => {
    const app = express();
    app.get('/api/ping', apiLimiter, (_req, res) => res.sendStatus(204));

    for (let attempt = 0; attempt < 30; attempt++) {
      expect((await request(app).get('/api/ping')).status).toBe(204);
    }
    expect((await request(app).get('/api/ping')).status).toBe(429);
  });

  it('não aplica o limite geral às rotas do chat montadas antes dele', async () => {
    const app = express();
    const chatRoutes = express.Router();
    chatRoutes.get('/conversations', (_req, res) => res.sendStatus(204));
    app.use('/api/chat', chatRoutes);
    app.use('/api', apiLimiter);

    for (let attempt = 0; attempt < 31; attempt++) {
      expect((await request(app).get('/api/chat/conversations')).status).toBe(204);
    }
  });
});
