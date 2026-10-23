import express from 'express';
import request from 'supertest';
import {apiLimiter, directChatLimiter, loginLimiter} from '../../backend/src/middlewares/rateLimiter.js';
import type {AuthRequest} from '../../backend/src/types/index.js';

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

  it('usa limite próprio do chat por usuário, sem bloquear após 30 chamadas no mesmo IP', async () => {
    const app = express();
    app.use((req, _res, next) => {
      (req as AuthRequest).userId = req.header('x-user-id') ?? 'user-a';
      next();
    });
    app.get('/chat', directChatLimiter, (_req, res) => res.sendStatus(204));

    for (let attempt = 0; attempt < 31; attempt++) {
      expect((await request(app).get('/chat').set('x-user-id', 'user-a')).status).toBe(204);
    }
    expect((await request(app).get('/chat').set('x-user-id', 'user-b')).status).toBe(204);
  });
});
