import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../backend/src/app';
import PostMessage from '../../backend/src/models/postMessageModel';
import DenunciaMessage from '../../backend/src/models/denunciaMessageModel';

const ADMIN_KEY = 'test-admin-key';
const MESSAGES_BASE = '/api/messages';

describe('Suíte de Testes - Exclusivo para 5 APIs', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    process.env.ADMIN_KEY = ADMIN_KEY;

    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    // Encerra as conexões após o término de todos os testes
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    // Limpa as coleções após cada cenário para não haver interferência
    await PostMessage.deleteMany({});
    await DenunciaMessage.deleteMany({});
  });

  // =========================================================================
  // API 1: CRIAR MENSAGEM (POST /api/messages/post)
  // =========================================================================
  describe('API 1 - POST /api/messages/post (createPostMessage)', () => {
    it('Deve salvar a mensagem com sucesso e retornar status 201', async () => {
      const res = await request(app).post(`${MESSAGES_BASE}/post`).send({
        nome: 'Fulano',
        email: 'fulano@petjoyful.com',
        mensagem: 'Quero adotar um gatinho!',
        postId: new mongoose.Types.ObjectId().toString(),
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Mensagem salva com sucesso');
      expect(res.body.data).toHaveProperty('_id');
    });

    it('Deve retornar status 400 se faltarem email ou mensagem (Validação do IF)', async () => {
      const res = await request(app)
        .post(`${MESSAGES_BASE}/post`)
        .send({nome: 'Sem Dados Obrigatórios'});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email e mensagem são obrigatórios');
    });
  });

  // =========================================================================
  // API 2: LISTAR MENSAGENS (GET /api/messages/post)
  // =========================================================================
  describe('API 2 - GET /api/messages/post (getPostMessages)', () => {
    it('Deve listar as mensagens cadastradas ordenadas por data', async () => {
      await PostMessage.create({email: 'user@t.com', mensagem: 'Olá PetBot'});

      const res = await request(app).get(`${MESSAGES_BASE}/post`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });
  });

  // =========================================================================
  // API 3: CRIAR DENÚNCIA (POST /api/messages/denuncia)
  // =========================================================================
  describe('API 3 - POST /api/messages/denuncia (createDenuncia)', () => {
    it('Deve registrar uma denúncia com sucesso e retornar status 201', async () => {
      const res = await request(app).post(`${MESSAGES_BASE}/denuncia`).send({
        email: 'fiscal@petjoyful.com',
        descricao: 'Comentário ofensivo detectado.',
        alvoId: new mongoose.Types.ObjectId().toString(),
        alvoTipo: 'post',
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Denúncia registrada com sucesso');
    });

    it('Deve retornar status 400 se faltarem email ou descrição (Validação do IF)', async () => {
      const res = await request(app)
        .post(`${MESSAGES_BASE}/denuncia`)
        .send({descricao: 'Falta o e-mail aqui'});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email e descrição são obrigatórios');
    });
  });

  // =========================================================================
  // API 4: LISTAR DENÚNCIAS (GET /api/messages/denuncia)
  // =========================================================================
  describe('API 4 - GET /api/messages/denuncia (getDenuncias)', () => {
    it('Deve retornar a lista de denúncias registradas', async () => {
      await DenunciaMessage.create({
        email: 'admin@t.com',
        descricao: 'Denúncia fake',
      });

      const res = await request(app)
        .get(`${MESSAGES_BASE}/denuncia`)
        .set('x-admin-key', ADMIN_KEY);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  // =========================================================================
  // API 5: DELETAR MENSAGEM (DELETE /api/messages/post/:id)
  // =========================================================================
  describe('API 5 - DELETE /api/messages/post/:id (deletePostMessage)', () => {
    it('Deve retornar status 403 (Não Autorizado) se o usuário comum tentar deletar (Validação de Segurança)', async () => {
      const msg = await PostMessage.create({
        email: 'u@t.com',
        mensagem: 'Mensagem para apagar',
      });

      const res = await request(app)
        .delete(`${MESSAGES_BASE}/post/${msg._id}`)
        .set('x-admin-key', 'chave-incorreta');

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Admin key inválida');
    });
  });

  describe('API 6 - PUT /api/messages/post/:id (updatePostMessage)', () => {
    it('Deve atualizar uma mensagem com sucesso', async () => {
      const msg = await PostMessage.create({
        email: 'old@t.com',
        mensagem: 'Mensagem antiga',
      });

      const res = await request(app)
        .put(`${MESSAGES_BASE}/post/${msg._id}`)
        .set('x-admin-key', ADMIN_KEY)
        .send({
          email: 'new@t.com',
          mensagem: 'Mensagem atualizada',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Mensagem atualizada');
      expect(res.body.data._id).toBe(msg._id.toString());
      expect(res.body.data.mensagem).toBe('Mensagem atualizada');
    });

    it('Deve retornar 404 ao tentar atualizar uma mensagem inexistente', async () => {
      const res = await request(app)
        .put(`${MESSAGES_BASE}/post/${new mongoose.Types.ObjectId()}`)
        .set('x-admin-key', ADMIN_KEY)
        .send({
          email: 'naoexiste@t.com',
          mensagem: 'Mensagem inexistente',
        });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Mensagem não encontrada');
    });
  });

  describe('API 7 - DELETE /api/messages/post/:id (deletePostMessage)', () => {
    it('Deve deletar uma mensagem com sucesso', async () => {
      const msg = await PostMessage.create({
        email: 'delete@t.com',
        mensagem: 'Mensagem para deletar',
      });

      const res = await request(app)
        .delete(`${MESSAGES_BASE}/post/${msg._id}`)
        .set('x-admin-key', ADMIN_KEY);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Mensagem deletada');

      const deleted = await PostMessage.findById(msg._id);
      expect(deleted).toBeNull();
    });

    it('Deve retornar 404 ao tentar deletar uma mensagem inexistente', async () => {
      const res = await request(app)
        .delete(`${MESSAGES_BASE}/post/${new mongoose.Types.ObjectId()}`)
        .set('x-admin-key', ADMIN_KEY);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Mensagem não encontrada');
    });
  });

  describe('API 8 - PUT /api/messages/denuncia/:id (updateDenuncia)', () => {
    it('Deve atualizar uma denúncia com sucesso', async () => {
      const report = await DenunciaMessage.create({
        email: 'denuncia@t.com',
        descricao: 'Descrição antiga',
      });

      const res = await request(app)
        .put(`${MESSAGES_BASE}/denuncia/${report._id}`)
        .set('x-admin-key', ADMIN_KEY)
        .send({
          email: 'denuncia@t.com',
          descricao: 'Descrição atualizada',
          alvoTipo: 'post',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Denúncia atualizada');
      expect(res.body.data._id).toBe(report._id.toString());
      expect(res.body.data.descricao).toBe('Descrição atualizada');
    });

    it('Deve retornar 403 ao tentar atualizar uma denúncia com chave inválida', async () => {
      const report = await DenunciaMessage.create({
        email: 'denuncia@t.com',
        descricao: 'Descrição antiga',
      });

      const res = await request(app)
        .put(`${MESSAGES_BASE}/denuncia/${report._id}`)
        .set('x-admin-key', 'chave-incorreta')
        .send({
          email: 'denuncia@t.com',
          descricao: 'Descrição atualizada',
          alvoTipo: 'post',
        });

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Admin key inválida');
    });

    it('Deve retornar 404 ao tentar atualizar uma denúncia inexistente', async () => {
      const res = await request(app)
        .put(`${MESSAGES_BASE}/denuncia/${new mongoose.Types.ObjectId()}`)
        .set('x-admin-key', ADMIN_KEY)
        .send({
          email: 'naoexiste@t.com',
          descricao: 'Descrição inexistente',
        });

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Denúncia não encontrada');
    });
  });

  describe('API 9 - DELETE /api/messages/denuncia/:id (deleteDenuncia)', () => {
    it('Deve deletar uma denúncia com sucesso', async () => {
      const report = await DenunciaMessage.create({
        email: 'delete-report@t.com',
        descricao: 'Denúncia para deletar',
      });

      const res = await request(app)
        .delete(`${MESSAGES_BASE}/denuncia/${report._id}`)
        .set('x-admin-key', ADMIN_KEY);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Denúncia deletada');

      const deleted = await DenunciaMessage.findById(report._id);
      expect(deleted).toBeNull();
    });

    it('Deve retornar 403 ao tentar deletar uma denúncia com chave inválida', async () => {
      const report = await DenunciaMessage.create({
        email: 'delete-report@t.com',
        descricao: 'Denúncia para deletar',
      });

      const res = await request(app)
        .delete(`${MESSAGES_BASE}/denuncia/${report._id}`)
        .set('x-admin-key', 'chave-incorreta');

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Admin key inválida');
    });

    it('Deve retornar 404 ao tentar deletar uma denúncia inexistente', async () => {
      const res = await request(app)
        .delete(`${MESSAGES_BASE}/denuncia/${new mongoose.Types.ObjectId()}`)
        .set('x-admin-key', ADMIN_KEY);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Denúncia não encontrada');
    });
  });
});
