import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import crypto from 'node:crypto';
import app from '../../backend/src/app';
import User from '../../backend/src/models/userModel';
import RefreshToken from '../../backend/src/models/refreshTokenModel';
import {consumeRefreshToken, issueRefreshToken, revokeRefreshToken, revokeUserRefreshTokens} from '../../backend/src/services/refreshTokenService';

jest.setTimeout(60_000);
process.env.JWT_SECRET = 'refresh-token-test-secret';

describe('sessões com refresh token rotativo', () => {
  let mongo: MongoMemoryServer;
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
  });
  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });
  afterEach(async () => {
    await Promise.all([User.deleteMany({}), RefreshToken.deleteMany({})]);
  });

  it('emite um segredo opaco, persiste somente seu hash e rotaciona uma única vez', async () => {
    const user = await User.create({nome: 'Ana', email: 'ana@example.com', senha: 'senhaForte123', tipo: 'cliente'});
    const token = await issueRefreshToken(String(user._id), user.authVersion ?? 0);
    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/);
    const stored = await RefreshToken.findOne({userId: user._id}).select('+tokenHash');
    expect(stored?.tokenHash).toBe(crypto.createHash('sha256').update(token).digest('hex'));
    expect(stored?.tokenHash).not.toBe(token);
    const rotated = await consumeRefreshToken(token);
    expect(rotated?.userId).toBe(String(user._id));
    expect(rotated?.token).not.toBe(token);
    expect(await consumeRefreshToken(token)).toBeNull();
    expect(await consumeRefreshToken(rotated?.token)).toMatchObject({userId: String(user._id)});
  });

  it('rejeita entradas malformadas e refresh expirado/revogado', async () => {
    expect(await consumeRefreshToken({$ne: null})).toBeNull();
    expect(await consumeRefreshToken('short')).toBeNull();
    const user = await User.create({nome: 'Bia', email: 'bia@example.com', senha: 'senhaForte123', tipo: 'cliente'});
    const expired = await issueRefreshToken(String(user._id));
    await RefreshToken.updateOne({userId: user._id}, {$set: {expiresAt: new Date(Date.now() - 1000)}});
    expect(await consumeRefreshToken(expired)).toBeNull();
    const revoked = await issueRefreshToken(String(user._id));
    await revokeRefreshToken(revoked);
    expect(await consumeRefreshToken(revoked)).toBeNull();
    await revokeUserRefreshTokens(String(user._id));
    expect(await RefreshToken.countDocuments({userId: user._id, revokedAt: null})).toBe(0);
  });

  it('renova a sessão somente com refresh token válido e exige o token anterior apenas uma vez', async () => {
    const user = await User.create({nome: 'Caio', email: 'caio@example.com', senha: 'senhaForte123', tipo: 'cliente'});
    const login = await request(app).post('/api/auth/login').send({email: user.email, senha: 'senhaForte123'});
    expect(login.status).toBe(200);
    expect(login.body.refreshToken).toBeDefined();
    const refresh = await request(app).post('/api/auth/refresh').send({refreshToken: login.body.refreshToken});
    expect(refresh.status).toBe(200);
    expect(refresh.body.token).toBeDefined();
    expect(refresh.body.refreshToken).not.toBe(login.body.refreshToken);
    expect((await request(app).post('/api/auth/refresh').send({refreshToken: login.body.refreshToken})).status).toBe(401);
    expect((await request(app).post('/api/auth/refresh').send({refreshToken: {$ne: null}})).status).toBe(400);
    expect((await request(app).post('/api/auth/logout').set('Authorization', `Bearer ${refresh.body.token}`)).status).toBe(204);
    expect((await request(app).post('/api/auth/refresh').send({refreshToken: refresh.body.refreshToken})).status).toBe(401);
  });

  it('nega refresh quando a versão de autenticação do usuário mudou', async () => {
    const user = await User.create({nome: 'Duda', email: 'duda@example.com', senha: 'senhaForte123', tipo: 'cliente'});
    const refreshToken = await issueRefreshToken(String(user._id), 0);
    await User.updateOne({_id: user._id}, {$inc: {authVersion: 1}});
    const response = await request(app).post('/api/auth/refresh').send({refreshToken});
    expect(response.status).toBe(401);
    expect(await RefreshToken.countDocuments({userId: user._id, revokedAt: null})).toBe(0);
  });
});
