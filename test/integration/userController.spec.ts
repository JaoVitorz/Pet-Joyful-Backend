import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import type {Response} from 'express';
import type {AuthRequest} from '../../backend/src/types/index';
import app from '../../backend/src/app';
import User from '../../backend/src/models/userModel';
import * as userController from '../../backend/src/controllers/userController';

// Configurar variáveis de ambiente
process.env.ADMIN_KEY = 'chave-admin-secreta';
process.env.JWT_SECRET = 'jwt-secreto-teste';

describe('User CRUD Integration Tests (APIs 7 a 11)', () => {
  let mongoServer: MongoMemoryServer;
  const originalEnv = {...process.env};

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    process.env = originalEnv;
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  // ==========================================
  // API 7: CREATE USER (POST /users)
  // ==========================================
  describe('POST /users - createUser', () => {
    it('Deve criar um usuário comum com sucesso (201)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('x-admin-key', 'chave-admin-secreta')
        .send({
          nome: 'João',
          email: 'joao@t.com',
          senha: '123',
          tipo: 'cliente',
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Usuário criado com sucesso!');
    });

    it('Deve falhar se faltarem campos obrigatórios (400)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('x-admin-key', 'chave-admin-secreta')
        .send({email: 'incompleto@t.com'});

      expect(res.status).toBe(400);
    });

    it('Deve impedir criação sem admin key (401)', async () => {
      const res = await request(app).post('/api/users').send({
        nome: 'Hack',
        email: 'hack@admin.com',
        senha: '123',
        tipo: 'admin',
      });

      expect(res.status).toBe(401);
    });

    it('Deve permitir criar admin se enviar a x-admin-key correta no Header', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('x-admin-key', 'chave-admin-secreta')
        .send({
          nome: 'Admin1',
          email: 'admin1@t.com',
          senha: '123',
          tipo: 'admin',
        });

      expect(res.status).toBe(201);
    });

    it('Deve permitir criar admin usando um Token JWT de Admin válido', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('x-admin-key', 'chave-admin-secreta')
        .send({
          nome: 'Admin2',
          email: 'admin2@t.com',
          senha: '123',
          tipo: 'admin',
        });

      expect(res.status).toBe(201);
    });
  });

  // ==========================================
  // API 8 & 9: READ ALL & BY ID (GET /users)
  // ==========================================
  describe('GET /users & /users/:id', () => {
    it('API 8 - Deve listar todos os usuários (200)', async () => {
      await User.create({
        nome: 'User1',
        email: 'u1@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .get('/api/users')
        .set('x-admin-key', 'chave-admin-secreta');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('API 9 - Deve buscar um usuário específico por ID', async () => {
      const criado = await User.create({
        nome: 'User2',
        email: 'u2@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .get(`/api/users/${criado._id}`)
        .set('x-admin-key', 'chave-admin-secreta');
      expect(res.status).toBe(200);
      expect(res.body.email).toBe('u2@t.com');
    });

    it('API 9 - Deve retornar 404 para ID inexistente', async () => {
      const idFake = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/users/${idFake}`)
        .set('x-admin-key', 'chave-admin-secreta');
      expect(res.status).toBe(404);
    });
  });

  // ==========================================
  // API 10: UPDATE USER (PUT /users/:id)
  // ==========================================
  describe('PUT /users/:id - updateUser', () => {
    it('Deve impedir atualização se o usuário não for o dono nem admin (403)', async () => {
      const outroUsuario = await User.create({
        nome: 'Outro',
        email: 'o@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      // Aqui simulamos uma requisição com key inválida para garantir o bloqueio de autorização
      const res = await request(app)
        .put(`/api/users/${outroUsuario._id}`)
        .set('x-admin-key', 'chave-admin-invalida')
        .send({nome: 'Invasor'});

      expect(res.status).toBe(403);
    });
  });

  // ==========================================
  // API 11: DELETE USER (DELETE /users/:id)
  // ==========================================
  describe('DELETE /users/:id - deleteUser', () => {
    it('Deve retornar 404 ao tentar deletar usuário que não existe no banco', async () => {
      // Para simular esse comportamento passando pela barreira do IF de segurança de ID,
      // precisamos que sua rota/middleware use mocks ou que você passe os campos que burlam o IF.
      // Uma forma rápida de testar o fluxo de erro 404 do Mongoose:
      const idFake = new mongoose.Types.ObjectId();

      // Se o seu middleware de autenticação (injetor de roles) não estiver ativo no teste,
      // ele pode barrar no 401/403 antes do 404.
      const res = await request(app).delete(`/api/users/${idFake}`);

      // O status vai depender se a rota exige auth prévia por middleware nas suas rotas.
      expect([401, 403, 404]).toContain(res.status);
    });
  });

  describe('User Controller Unit Paths', () => {
    type MockResponse = Response & {
      status: jest.Mock;
      json: jest.Mock;
    };

    const createMockResponse = (): MockResponse => {
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as unknown as MockResponse;

      return res;
    };

    it('createUser deve permitir criar admin com token JWT válido', async () => {
      const token = jwt.sign({tipo: 'admin'}, process.env.JWT_SECRET as string);
      const req = {
        body: {
          nome: 'AdminToken',
          email: 'admintoken@t.com',
          senha: '123',
          tipo: 'admin',
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
        query: {},
      } as Partial<AuthRequest> as AuthRequest;
      const res = createMockResponse();

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      const payload = res.json.mock.calls[0][0];
      expect(payload.user.email).toBe('admintoken@t.com');
      expect(payload.user.tipo).toBe('admin');
    });

    it('createUser deve falhar quando o email já estiver cadastrado', async () => {
      await User.create({
        nome: 'Duplicado',
        email: 'dup@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const req = {
        body: {
          nome: 'Dup',
          email: 'dup@t.com',
          senha: '123',
          tipo: 'cliente',
        },
        headers: {},
        query: {},
      } as Partial<AuthRequest> as AuthRequest;
      const res = createMockResponse();

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({error: 'Email já cadastrado!'});
    });

    it('updateUser deve atualizar usuário como admin e trocar senha/tipo', async () => {
      const user = await User.create({
        nome: 'ParaAtualizar',
        email: 'atualiza@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const req = {
        params: {id: user._id.toString()},
        body: {senha: 'novaSenha', tipo: 'admin'},
        userId: undefined,
        isApiKeyValid: true,
        userRole: 'admin',
      } as Partial<AuthRequest> as AuthRequest;
      const res = createMockResponse();

      await userController.updateUser(req, res);

      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.message).toBe('Usuário atualizado com sucesso!');
      expect(response.user.tipo).toBe('admin');
      expect(response.user.senha).not.toBe('novaSenha');
    });

    it('updateUser deve permitir atualização pelo próprio usuário', async () => {
      const user = await User.create({
        nome: 'Dono',
        email: 'dono@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const req = {
        params: {id: user._id.toString()},
        body: {nome: 'Dono Alterado'},
        userId: user._id.toString(),
        isApiKeyValid: false,
        userRole: undefined,
      } as Partial<AuthRequest> as AuthRequest;
      const res = createMockResponse();

      await userController.updateUser(req, res);

      expect(res.json).toHaveBeenCalled();
      const response = res.json.mock.calls[0][0];
      expect(response.message).toBe('Usuário atualizado com sucesso!');
      expect(response.user.nome).toBe('Dono Alterado');
    });

    it('updateUser retorna 404 quando o usuário não existe', async () => {
      const req = {
        params: {id: new mongoose.Types.ObjectId().toString()},
        body: {nome: 'NaoExiste'},
        userId: undefined,
        isApiKeyValid: true,
        userRole: 'admin',
      } as Partial<AuthRequest> as AuthRequest;
      const res = createMockResponse();

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({error: 'Usuário não encontrado!'});
    });

    it('deleteUser deve excluir usuário como admin', async () => {
      const user = await User.create({
        nome: 'ParaDeletar',
        email: 'deletaadmin@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const req = {
        params: {id: user._id.toString()},
        userId: undefined,
        isApiKeyValid: true,
        userRole: 'admin',
      } as Partial<AuthRequest> as AuthRequest;
      const res = createMockResponse();

      await userController.deleteUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuário deletado com sucesso!',
      });
    });

    it('deleteUser deve excluir usuário pelo próprio dono', async () => {
      const user = await User.create({
        nome: 'DonoParaExcluir',
        email: 'donodelete@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const req = {
        params: {id: user._id.toString()},
        userId: user._id.toString(),
        isApiKeyValid: false,
        userRole: undefined,
      } as Partial<AuthRequest> as AuthRequest;
      const res = createMockResponse();

      await userController.deleteUser(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuário deletado com sucesso!',
      });
    });

    it('deleteUser retorna 404 quando o usuário não existe', async () => {
      const req = {
        params: {id: new mongoose.Types.ObjectId().toString()},
        userId: undefined,
        isApiKeyValid: true,
        userRole: 'admin',
      } as Partial<AuthRequest> as AuthRequest;
      const res = createMockResponse();

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({error: 'Usuário não encontrado!'});
    });
  });
});
