import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../backend/src/app';
import messagesServiceApp from '../../services/messages-service/src/app';

describe('health checks', () => {
  it('separa liveness de prontidão e informa banco indisponível', async () => {
    const previous = process.env.POSTS_SERVICE_URL;
    delete process.env.POSTS_SERVICE_URL;
    try {
      expect((await request(app).get('/health/live')).status).toBe(200);
      if (mongoose.connection.readyState !== 1) {
        const readiness = await request(app).get('/health/ready');
        expect(readiness.status).toBe(503);
        expect(readiness.body.dependencies.database).toBe('unavailable');
      }
    } finally {
      if (previous === undefined) delete process.env.POSTS_SERVICE_URL;
      else process.env.POSTS_SERVICE_URL = previous;
    }
  });

  it('serviço de posts distingue vida de disponibilidade do banco', async () => {
    expect((await request(messagesServiceApp).get('/health/live')).status).toBe(200);
    if (mongoose.connection.readyState !== 1) {
      expect((await request(messagesServiceApp).get('/health/ready')).status).toBe(503);
    }
  });
});
