import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../backend/src/app';
import User from '../../backend/src/models/userModel';

process.env.ADMIN_KEY = 'chave-admin-secreta';
process.env.JWT_SECRET = 'jwt-secreto-teste';

describe('Testes das APIs de usuarios', () => {
  let mongoServer: MongoMemoryServer;

  // sobe o banco em memoria antes de tudo
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  // desliga tudo depois que acabar
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // limpa os usuarios do banco depois de cada teste
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users', () => {
    it('deve criar um usuario comum e voltar 201', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('x-admin-key', 'chave-admin-secreta')
        .send({
          nome: 'João',
          email: 'joao@email.com',
          senha: '123',
          tipo: 'cliente',
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Usuário criado com sucesso!');
    });

    it('deve voltar 400 se faltar algum campo obrigatorio', async () => {
      // manda so o email, sem nome, senha e tipo
      const res = await request(app)
        .post('/api/users')
        .set('x-admin-key', 'chave-admin-secreta')
        .send({email: 'incompleto@email.com'});

      expect(res.status).toBe(400);
    });

    it('deve voltar 401 se nao mandar a chave de admin', async () => {
      // nao passou a x-admin-key no cabecalho
      const res = await request(app)
        .post('/api/users')
        .send({
          nome: 'Hack',
          email: 'hack@email.com',
          senha: '123',
          tipo: 'admin',
        });

      expect(res.status).toBe(401);
    });

    it('deve criar um usuario admin quando a chave estiver correta', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('x-admin-key', 'chave-admin-secreta')
        .send({
          nome: 'Admin1',
          email: 'admin1@email.com',
          senha: '123',
          tipo: 'admin',
        });

      expect(res.status).toBe(201);
    });

    it('deve voltar 400 se tentar cadastrar um email que ja existe', async () => {
      // cria o usuario direto no banco
      await User.create({
        nome: 'Duplicado',
        email: 'duplicado@email.com',
        senha: '123',
        tipo: 'cliente',
      });

      // tenta criar outro com o mesmo email
      const res = await request(app)
        .post('/api/users')
        .set('x-admin-key', 'chave-admin-secreta')
        .send({
          nome: 'Outro',
          email: 'duplicado@email.com',
          senha: '123',
          tipo: 'cliente',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email já cadastrado!');
    });
  });

  describe('GET /api/users', () => {
    it('deve listar todos os usuarios cadastrados', async () => {
      await User.create({
        nome: 'User1',
        email: 'u1@email.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .get('/api/users')
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe('GET /api/users/:id', () => {
    it('deve buscar um usuario pelo id', async () => {
      const criado = await User.create({
        nome: 'User2',
        email: 'u2@email.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .get(`/api/users/${criado._id}`)
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('u2@email.com');
    });

    it('deve voltar 404 se o id nao existir no banco', async () => {
      const idFake = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/users/${idFake}`)
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(404);
    });

    it('deve voltar 500 se o id tiver num formato invalido', async () => {
      // "invalid-id" nao é um id do mongodb
      const res = await request(app)
        .get('/api/users/invalid-id')
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(500);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('deve atualizar o usuario normalmente', async () => {
      const usuario = await User.create({
        nome: 'Antes',
        email: 'antes@email.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .put(`/api/users/${usuario._id}`)
        .set('x-admin-key', 'chave-admin-secreta')
        .send({
          nome: 'Depois',
          email: 'depois@email.com',
          senha: 'nova123',
          tipo: 'admin',
        });

      expect(res.status).toBe(200);
      expect(res.body.user.nome).toBe('Depois');
      expect(res.body.user.email).toBe('depois@email.com');
      expect(res.body.user.tipo).toBe('admin');
    });

    it('deve voltar 403 se a chave de admin estiver errada', async () => {
      const usuario = await User.create({
        nome: 'Outro',
        email: 'o@email.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .put(`/api/users/${usuario._id}`)
        .set('x-admin-key', 'chave-errada')
        .send({nome: 'Invasor'});

      expect(res.status).toBe(403);
    });

    it('deve voltar 500 se o id tiver num formato invalido', async () => {
      const res = await request(app)
        .put('/api/users/invalid-id')
        .set('x-admin-key', 'chave-admin-secreta')
        .send({nome: 'Invalido'});

      expect(res.status).toBe(500);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('deve deletar o usuario normalmente', async () => {
      const usuario = await User.create({
        nome: 'ParaDeletar',
        email: 'delete@email.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .delete(`/api/users/${usuario._id}`)
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Usuário deletado com sucesso!');
    });

    it('deve voltar 404 se o usuario nao existir no banco', async () => {
      const idFake = new mongoose.Types.ObjectId();

      const res = await request(app)
        .delete(`/api/users/${idFake}`)
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(404);
    });

    it('deve voltar 500 se o id tiver num formato invalido', async () => {
      const res = await request(app)
        .delete('/api/users/invalid-id')
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(500);
    });
  });
});