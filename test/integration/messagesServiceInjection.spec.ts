import express from 'express';
import type {RequestHandler} from 'express';
import request from 'supertest';
import serviceInputGuard, {validatePostBody} from '../../services/messages-service/src/middlewares/inputGuard';

const serviceApp = express();
serviceApp.use(express.json());
serviceApp.use(serviceInputGuard as unknown as RequestHandler);
serviceApp.post('/posts', validatePostBody as unknown as RequestHandler, (_req, res) => res.sendStatus(204));

describe('guarda de entradas do serviço de posts', () => {
  it('bloqueia operadores e chaves de protótipo', async () => {
    expect((await request(serviceApp).post('/posts').send({titulo: {$ne: null}})).status).toBe(400);
    expect((await request(serviceApp).post('/posts').send({titulo: 'ok', constructor: {prototype: {admin: true}}})).status).toBe(400);
  });

  it('só permite título e descrição nos tamanhos aceitos', async () => {
    expect((await request(serviceApp).post('/posts').send({titulo: 'Um post', descricao: 'Descrição'})).status).toBe(204);
    expect((await request(serviceApp).post('/posts').send({titulo: '  '})).status).toBe(400);
    expect((await request(serviceApp).post('/posts').send({titulo: 'Post', userId: 'falso'})).status).toBe(400);
  });

  it('preserva cifrões e apóstrofos em texto normal', async () => {
    expect((await request(serviceApp).post('/posts').send({titulo: "Toby's $5", descricao: "Texto d'água $10"})).status).toBe(204);
  });
});
