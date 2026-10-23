import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {MongoMemoryServer} from 'mongodb-memory-server';
import app from '../../backend/src/app';
import User from '../../backend/src/models/userModel';
import DirectConversation from '../../backend/src/models/directConversationModel';
import DirectMessage from '../../backend/src/models/directMessageModel';

const secret = 'direct-chat-test-secret';
const base = '/api/chat';
jest.setTimeout(60_000);

describe('Chat individual entre usuários', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    process.env.JWT_SECRET = secret;
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Promise.all([
      User.deleteMany({}),
      DirectConversation.deleteMany({}),
      DirectMessage.deleteMany({}),
    ]);
  });

  async function createUser(email: string, nome = email.split('@')[0]) {
    const user = await User.create({nome, email, senha: 'segredo', tipo: 'cliente'});
    const token = jwt.sign({userId: String(user._id)}, secret);
    return {user, token};
  }

  it('busca usuários sem expor a própria conta ou contas em exclusão', async () => {
    const owner = await createUser('owner@email.com', 'Ana');
    const other = await createUser('other@email.com', 'Animal Feliz');
    const deleting = await createUser('deleting@email.com', 'Animal em exclusão');
    await User.updateOne({_id: deleting.user._id}, {$set: {deletionRequestedAt: new Date()}});

    expect((await request(app).get(`${base}/users`).query({q: 'animal'})).status).toBe(401);
    const response = await request(app)
      .get(`${base}/users`)
      .query({q: 'animal'})
      .set('Authorization', `Bearer ${owner.token}`);

    expect(response.status).toBe(200);
    expect(response.body.users).toEqual([expect.objectContaining({id: String(other.user._id), name: 'Animal Feliz'})]);
    expect(JSON.stringify(response.body)).not.toContain(other.user.email);
  });

  it('abre conversa única entre dois usuários e rejeita destinatários inválidos', async () => {
    const owner = await createUser('owner@email.com');
    const other = await createUser('other@email.com', 'Beto');
    const auth = {Authorization: `Bearer ${owner.token}`} as const;

    expect((await request(app).post(`${base}/conversations`).set(auth).send({userId: 'inválido'})).status).toBe(400);
    expect((await request(app).post(`${base}/conversations`).set(auth).send({userId: String(owner.user._id)})).status).toBe(400);
    expect((await request(app).post(`${base}/conversations`).set(auth).send({userId: new mongoose.Types.ObjectId().toString()})).status).toBe(404);

    const first = await request(app).post(`${base}/conversations`).set(auth).send({userId: String(other.user._id)});
    const second = await request(app).post(`${base}/conversations`).set(auth).send({userId: String(other.user._id)});
    expect(first.status).toBe(200);
    expect(first.body.conversation.user).toMatchObject({id: String(other.user._id), name: 'Beto'});
    expect(second.body.conversation.id).toBe(first.body.conversation.id);
    expect(await DirectConversation.countDocuments()).toBe(1);
    expect((await request(app).post(`${base}/conversations`).send({userId: String(other.user._id)})).status).toBe(401);
  });

  it('lista conversas e retorna lista vazia quando o usuário ainda não iniciou uma', async () => {
    const owner = await createUser('owner@email.com');
    const other = await createUser('other@email.com', 'Beto');
    const auth = {Authorization: `Bearer ${owner.token}`} as const;
    expect((await request(app).get(`${base}/conversations`).set(auth)).body.conversations).toEqual([]);

    const {body} = await request(app).post(`${base}/conversations`).set(auth).send({userId: String(other.user._id)});
    const response = await request(app).get(`${base}/conversations`).set(auth);
    expect(response.status).toBe(200);
    expect(response.body.conversations[0]).toMatchObject({
      id: body.conversation.id,
      user: {id: String(other.user._id), name: 'Beto'},
      lastMessage: '',
    });
  });

  it('envia, persiste e recupera mensagens somente para os participantes', async () => {
    const owner = await createUser('owner@email.com');
    const other = await createUser('other@email.com');
    const outsider = await createUser('outsider@email.com');
    const auth = {Authorization: `Bearer ${owner.token}`} as const;
    const created = await request(app).post(`${base}/conversations`).set(auth).send({userId: String(other.user._id)});
    const conversationId = created.body.conversation.id;
    const messageUrl = `${base}/conversations/${conversationId}/messages`;

    expect((await request(app).post(`${base}/conversations/invalid/messages`).set(auth).send({text: 'oi'})).status).toBe(400);
    expect((await request(app).post(messageUrl).set(auth).send({text: '  '})).status).toBe(400);
    expect((await request(app).post(messageUrl).set(auth).send({text: 'x'.repeat(2001)})).status).toBe(400);
    expect((await request(app).post(messageUrl).send({text: 'sem token'})).status).toBe(401);

    const outsiderToken = jwt.sign({userId: String(outsider.user._id)}, secret);
    const outsiderAuth = {Authorization: `Bearer ${outsiderToken}`} as const;
    expect((await request(app).get(messageUrl).set(outsiderAuth)).status).toBe(403);
    expect((await request(app).post(messageUrl).set(outsiderAuth).send({text: 'não autorizado'})).status).toBe(403);
    expect((await request(app).get(`${base}/conversations/${new mongoose.Types.ObjectId()}/messages`).set(auth)).status).toBe(404);

    const sent = await request(app).post(messageUrl).set(auth).send({text: '  Olá, Beto!  '});
    expect(sent.status).toBe(201);
    expect(sent.body.message).toMatchObject({senderId: String(owner.user._id), text: 'Olá, Beto!'});
    await request(app).post(messageUrl).set(outsiderAuth).send({text: 'não autorizado'});
    const replyToken = jwt.sign({userId: String(other.user._id)}, secret);
    await request(app).post(messageUrl).set('Authorization', `Bearer ${replyToken}`).send({text: 'Oi!'});

    const messages = await request(app).get(messageUrl).set(auth);
    expect(messages.status).toBe(200);
    expect(messages.body.messages).toHaveLength(2);
    expect(messages.body.messages[0].text).toBe('Olá, Beto!');
    expect((await request(app).get(`${messageUrl}?limit=1`).set(auth)).body.messages).toHaveLength(1);
    expect((await request(app).get(`${messageUrl}?limit=0`).set(auth)).body.messages).toHaveLength(2);
    expect((await request(app).get(`${base}/conversations`).set(auth)).body.conversations[0].lastMessage).toBe('Oi!');
    expect(await DirectMessage.countDocuments({conversationId})).toBe(2);
  });

  it('valida que a conversa individual tenha exatamente dois participantes', async () => {
    const first = await createUser('first@email.com');
    await expect(DirectConversation.create({participants: [first.user._id], participantKey: 'one'})).rejects.toThrow();
  });
});
