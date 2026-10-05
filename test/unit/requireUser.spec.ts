import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import request from 'supertest';
import requireUser from '../../services/messages-service/src/middlewares/requireUser';
import type {AuthenticatedRequest} from '../../services/messages-service/src/middlewares/requireUser';

const secret = 'require-user-test-secret';

describe('Autoria dos posts', () => {
  const app = express();
  app.get('/protected', requireUser as unknown as express.RequestHandler, (req, res) => {
    res.json({userId: (req as unknown as AuthenticatedRequest).userId});
  });

  beforeAll(() => {
    process.env.JWT_SECRET = secret;
  });

  it('usa o ID assinado no token', async () => {
    const userId = new mongoose.Types.ObjectId().toString();
    const token = jwt.sign({userId}, secret);
    const response = await request(app).get('/protected').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({userId});
  });

  it('recusa token ausente ou sem ID de usuário', async () => {
    expect((await request(app).get('/protected')).status).toBe(401);
    const token = jwt.sign({email: 'teste@email.com'}, secret);
    expect((await request(app).get('/protected').set('Authorization', `Bearer ${token}`)).status).toBe(401);
  });
});
