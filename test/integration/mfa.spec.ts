import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import express from 'express';
import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../backend/src/app';
import userModel from '../../backend/src/models/userModel';
import {encryptSecret, generateSecret, hashRecoveryCode} from '../../backend/src/services/mfaService';
import postsRoutes from '../../services/messages-service/src/routes/postsRoutes';
import ServicePost from '../../services/messages-service/src/models/postModel';

process.env.JWT_SECRET = 'mfa-integration-test-secret';
process.env.MFA_ENCRYPTION_KEY = 'a'.repeat(64);
process.env.MONGOMS_DOWNLOAD_DIR = `${process.cwd()}/node_modules/.cache/mongodb-binaries`;
jest.setTimeout(60_000);

function codeFor(secret: string, time: number): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const character of secret) {
    value = (value << 5) | alphabet.indexOf(character);
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(Math.floor(time / 30_000)));
  const digest = crypto.createHmac('sha1', Buffer.from(bytes)).update(counter).digest();
  const offset = digest[digest.length - 1] & 15;
  return String((digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).padStart(6, '0');
}

describe('MFA via TOTP', () => {
  let mongo: MongoMemoryServer;
  const mediaApp = express();
  mediaApp.use('/api/posts', postsRoutes as unknown as express.Router);
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create({instance: {launchTimeout: 30_000}});
    await mongoose.connect(mongo.getUri());
    if (ServicePost.db !== mongoose.connection) {
      await ServicePost.db.openUri(mongo.getUri());
    }
  });
  afterAll(async () => {
    if (ServicePost.db !== mongoose.connection) await ServicePost.db.close();
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
  });
  afterEach(async () => {
    jest.restoreAllMocks();
    await userModel.deleteMany({});
  });

  it('ativa MFA, bloqueia token antigo e exige TOTP ou recuperação no login', async () => {
    await userModel.create({nome: 'Teste', email: 'mfa@email.com', senha: 'senha-forte', tipo: 'cliente'});
    const firstLogin = await request(app).post('/api/auth/login').send({email: 'mfa@email.com', senha: 'senha-forte'});
    expect(firstLogin.status).toBe(200);
    const oldToken = firstLogin.body.token as string;

    const setup = await request(app).post('/api/auth/mfa/setup')
      .set('Authorization', `Bearer ${oldToken}`).send({password: 'senha-forte'});
    expect(setup.status).toBe(200);
    expect(setup.body.otpauthUrl).toContain('otpauth://totp/');
    const secret = setup.body.secret as string;
    const start = Date.now();
    const confirmed = await request(app).post('/api/auth/mfa/confirm')
      .set('Authorization', `Bearer ${oldToken}`).send({code: codeFor(secret, start)});
    expect(confirmed.status).toBe(200);
    expect(confirmed.body.recoveryCodes).toHaveLength(10);
    const enabledToken = confirmed.body.token as string;
    const enabledStatus = await request(app).get('/api/auth/mfa')
      .set('Authorization', `Bearer ${enabledToken}`);
    expect(enabledStatus.body.enabled).toBe(true);
    expect((await request(app).post('/api/auth/mfa/setup')
      .set('Authorization', `Bearer ${enabledToken}`)
      .send({password: 'senha-forte'})).status).toBe(401);
    expect((await request(app).post('/api/auth/mfa/disable')
      .set('Authorization', `Bearer ${enabledToken}`)
      .send({recoveryCode: confirmed.body.recoveryCodes[0]})).status).toBe(400);
    expect((await request(app).post('/api/auth/mfa/disable')
      .set('Authorization', `Bearer ${enabledToken}`)
      .send({password: 'senha-errada', recoveryCode: confirmed.body.recoveryCodes[0]})).status).toBe(401);
    expect((await request(app).post('/api/auth/mfa/disable')
      .set('Authorization', `Bearer ${enabledToken}`)
      .send({password: 'senha-forte'})).status).toBe(400);
    expect((await request(app).get('/api/auth/me').set('Authorization', `Bearer ${oldToken}`)).status).toBe(401);
    expect((await request(app).get('/api/auth/session').set('Authorization', `Bearer ${oldToken}`)).status).toBe(401);
    expect((await request(mediaApp).delete('/api/posts/me/media')
      .set('Authorization', `Bearer ${oldToken}`)).status).toBe(401);
    const profile = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${enabledToken}`);
    expect(profile.status).toBe(200);
    expect(profile.body.user.mfaSecret).toBeUndefined();
    expect(profile.body.user.mfaRecoveryCodes).toBeUndefined();
    const exported = await request(app).get(`/api/users/${profile.body.user._id}/data-export`)
      .set('Authorization', `Bearer ${enabledToken}`);
    expect(exported.status).toBe(200);
    expect(JSON.stringify(exported.body)).not.toContain(secret);
    expect(JSON.stringify(exported.body)).not.toContain(confirmed.body.recoveryCodes[0]);

    const login = await request(app).post('/api/auth/login').send({email: 'mfa@email.com', senha: 'senha-forte'});
    expect(login.body.mfaRequired).toBe(true);
    expect(login.body.token).toBeUndefined();
    const challengeToken = login.body.challengeToken as string;
    expect(() => jwt.verify(challengeToken, process.env.JWT_SECRET as string)).toThrow();
    expect((await request(mediaApp).delete('/api/posts/me/media')
      .set('Authorization', `Bearer ${challengeToken}`)).status).toBe(401);
    expect((await request(app).get('/api/auth/session').set('Authorization', `Bearer ${challengeToken}`)).status).toBe(401);
    expect((await request(app).get('/api/auth/me').set('Authorization', `Bearer ${challengeToken}`)).status).toBe(401);
    expect((await request(app).post('/api/auth/mfa/verify').send({challengeToken, code: '000000'})).status).toBe(401);

    const later = start + 31_000;
    jest.spyOn(Date, 'now').mockReturnValue(later);
    const completed = await request(app).post('/api/auth/mfa/verify')
      .send({challengeToken, code: codeFor(secret, later)});
    expect(completed.status).toBe(200);
    expect(completed.body.token).toBeDefined();
    expect((await request(app).post('/api/auth/mfa/verify')
      .send({challengeToken, code: codeFor(secret, later)})).status).toBe(401);

    const recoveryLogin = await request(app).post('/api/auth/login').send({email: 'mfa@email.com', senha: 'senha-forte'});
    const recovery = confirmed.body.recoveryCodes[0] as string;
    const recovered = await request(app).post('/api/auth/mfa/verify')
      .send({challengeToken: recoveryLogin.body.challengeToken, recoveryCode: recovery});
    expect(recovered.status).toBe(200);
    const again = await request(app).post('/api/auth/login').send({email: 'mfa@email.com', senha: 'senha-forte'});
    expect((await request(app).post('/api/auth/mfa/verify')
      .send({challengeToken: again.body.challengeToken, recoveryCode: recovery})).status).toBe(401);

    const regenerated = await request(app).post('/api/auth/mfa/recovery-codes')
      .set('Authorization', `Bearer ${recovered.body.token}`)
      .send({password: 'senha-forte', recoveryCode: confirmed.body.recoveryCodes[1]});
    expect(regenerated.status).toBe(200);
    expect(regenerated.body.recoveryCodes).toHaveLength(10);
    expect((await request(app).get('/api/auth/me')
      .set('Authorization', `Bearer ${recovered.body.token}`)).status).toBe(401);
    const disabled = await request(app).post('/api/auth/mfa/disable')
      .set('Authorization', `Bearer ${regenerated.body.token}`)
      .send({password: 'senha-forte', recoveryCode: regenerated.body.recoveryCodes[0]});
    expect(disabled.status).toBe(200);
    expect((await request(app).get('/api/auth/me')
      .set('Authorization', `Bearer ${recovered.body.token}`)).status).toBe(401);
    expect((await request(app).get('/api/auth/me')
      .set('Authorization', `Bearer ${disabled.body.token}`)).status).toBe(200);
  });

  it('limita tentativas e consome códigos de recuperação atomicamente', async () => {
    const recoveryCode = crypto.randomBytes(16).toString('base64url');
    await userModel.create({nome: 'Protegida', email: 'protegida@email.com',
      senha: 'senha-forte', tipo: 'cliente', mfaEnabled: true, authVersion: 1,
      mfaSecret: encryptSecret(generateSecret()),
      mfaRecoveryCodes: [hashRecoveryCode(recoveryCode)]});
    const login = async () => request(app).post('/api/auth/login')
      .send({email: 'protegida@email.com', senha: 'senha-forte'});
    const first = await login();
    const challengeToken = first.body.challengeToken as string;
    const attempts = await Promise.all([1, 2, 3, 4, 5].map(() =>
      request(app).post('/api/auth/mfa/verify').send({challengeToken, code: '000000'})));
    expect(attempts.every(result => result.status === 401)).toBe(true);
    expect((await request(app).post('/api/auth/mfa/verify')
      .send({challengeToken, recoveryCode})).status).toBe(429);
    await userModel.updateOne({email: 'protegida@email.com'},
      {$unset: {mfaLockedUntil: ''}, $set: {mfaFailedAttempts: 0}});
    const second = await login();
    const concurrent = await Promise.all([1, 2].map(() =>
      request(app).post('/api/auth/mfa/verify')
        .send({challengeToken: second.body.challengeToken, recoveryCode})));
    expect(concurrent.map(result => result.status).sort()).toEqual([200, 401]);
  });

  it('rejeita configuração inválida, cancelada ou expirada', async () => {
    await userModel.create({nome: 'Configuração', email: 'config@email.com',
      senha: 'senha-forte', tipo: 'cliente'});
    const login = await request(app).post('/api/auth/login')
      .send({email: 'config@email.com', senha: 'senha-forte'});
    const authorization = `Bearer ${login.body.token}`;
    const setupRequest = () => request(app).post('/api/auth/mfa/setup')
      .set('Authorization', authorization);
    const confirmRequest = (code: string) => request(app).post('/api/auth/mfa/confirm')
      .set('Authorization', authorization).send({code});

    const initialStatus = await request(app).get('/api/auth/mfa')
      .set('Authorization', authorization);
    expect(initialStatus.status).toBe(200);
    expect(initialStatus.body.enabled).toBe(false);
    expect((await setupRequest().send({})).status).toBe(400);
    expect((await setupRequest().send({password: 'senha-errada'})).status).toBe(401);
    expect((await confirmRequest('123456')).status).toBe(400);

    const setup = await setupRequest().send({password: 'senha-forte'});
    expect(setup.status).toBe(200);
    expect((await confirmRequest('invalid')).status).toBe(400);
    expect((await request(app).delete('/api/auth/mfa/setup')
      .set('Authorization', authorization)).status).toBe(204);
    expect((await confirmRequest(codeFor(setup.body.secret, Date.now()))).status).toBe(400);

    const renewed = await setupRequest().send({password: 'senha-forte'});
    expect(renewed.status).toBe(200);
    jest.spyOn(Date, 'now').mockReturnValue(new Date(renewed.body.expiresAt).getTime() + 1);
    expect((await confirmRequest(codeFor(renewed.body.secret, Date.now()))).status).toBe(400);
    const finalStatus = await request(app).get('/api/auth/mfa')
      .set('Authorization', authorization);
    expect(finalStatus.body.enabled).toBe(false);
  });
});
