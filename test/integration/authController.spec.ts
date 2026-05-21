import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../backend/src/app';
import userModel from '../../backend/src/models/userModel';

// Configurar variável de ambiente JWT_SECRET para testes
process.env.JWT_SECRET = 'test-secret-key-for-tests';

describe('Auth Integration Tests (Sem Banco Real)', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  // ==========================================
  // API 1: REGISTER (POST /auth/register)
  // ==========================================
  describe('API 1 - Register', () => {
    it('Deve registrar um usuário e retornar 201', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nome: 'Admin',
        email: 'admin@teste.com',
        senha: '123',
        tipo: 'admin',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('Deve retornar 400 se o e-mail já existir', async () => {
      await userModel.create({
        nome: 'A',
        email: 'duplicado@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app).post('/api/auth/register').send({
        nome: 'B',
        email: 'duplicado@t.com',
        senha: '1',
        tipo: 'cliente',
      });

      expect(res.status).toBe(400);
    });

    it('Deve retornar 400 se faltarem campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({email: 'incompleto@t.com'}); // Faltam nome, senha, tipo

      expect(res.status).toBe(400);
    });

    it('Deve registrar com campos em inglês (name, password, type)', async () => {
      const res = await request(app).post('/api/auth/register').send({
        name: 'User EN',
        email: 'useren@teste.com',
        password: '456',
        type: 'cliente',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('Deve retornar 401 se email não existir no login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'naoexiste@t.com', senha: '123'});

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Credenciais inválidas');
    });

    it('Deve retornar 400 se faltarem email ou senha no login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'teste@t.com'}); // Falta senha

      expect(res.status).toBe(400);
    });
  });

  // ==========================================
  // API 2: LOGIN (POST /auth/login)
  // ==========================================
  describe('API 2 - Login', () => {
    it('Deve logar com sucesso e retornar 200', async () => {
      // Cria o usuário primeiro utilizando o modelo do Mongoose
      await userModel.create({
        nome: 'User',
        email: 'loginok@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'loginok@t.com', senha: '123'});

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('Deve retornar 401 para senha inválida', async () => {
      await userModel.create({
        nome: 'A',
        email: 'login@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'login@t.com', senha: 'SENHA_ERRADA'});

      expect(res.status).toBe(401);
    });

    it('Deve logar com password em inglês', async () => {
      await userModel.create({
        nome: 'User',
        email: 'login2@t.com',
        senha: '789',
        tipo: 'cliente',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'login2@t.com', password: '789'});

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  // ==========================================
  // APIS 3, 4 e 5: REQUEREM AUTENTICAÇÃO (/auth/me)
  // ==========================================
  describe('APIs Autenticadas (Profile)', () => {
    let token: string;

    beforeEach(async () => {
      // Cria um usuário e faz login para obter um token válido antes de testar o perfil
      await userModel.create({
        nome: 'Perfil',
        email: 'perfil@t.com',
        senha: '123',
        tipo: 'cliente',
      });
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({email: 'perfil@t.com', senha: '123'});
      token = loginRes.body.token;
    });

    // API 3: GET PROFILE (GET /auth/me)
    it('API 3 - Deve buscar o perfil do usuário logado', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`); // Passando o token gerado no beforeEach

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
    });

    it('API 3 - Deve retornar 401 quando token não é fornecido', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
    });

    it('API 3 - Deve retornar 401 com token inválido', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(res.status).toBe(401);
    });

    // API 4: UPDATE PROFILE (PUT /auth/me)
    it('API 4 - Deve atualizar dados do perfil', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({nome: 'Nome Atualizado'});

      expect(res.status).toBe(200);
      expect(res.body.user.nome).toBe('Nome Atualizado');
    });

    it('API 4 - Deve retornar 401 quando não autenticado', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .send({nome: 'Nome Atualizado'});

      expect(res.status).toBe(401);
    });

    it('API 4 - Deve retornar 400 se email já está em uso', async () => {
      // Criar outro usuário com email diferente
      await userModel.create({
        nome: 'Outro User',
        email: 'outro@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({email: 'outro@t.com'});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email já em uso por outro usuário');
    });

    it('API 4 - Deve atualizar email do perfil', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({email: 'novoemail@t.com'});

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('novoemail@t.com');
    });

    it('API 4 - Deve atualizar senha do perfil', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({senha: 'novaSenha123'});

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
    });

    it('API 4 - Deve atualizar tipo do perfil', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({tipo: 'adotante'});

      expect(res.status).toBe(200);
      expect(res.body.user.tipo).toBe('adotante');
    });

    it('API 4 - Deve atualizar sem campos (apenas validação)', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('nome');
    });

    // API 5: DELETE PROFILE (DELETE /auth/me)
    it('API 5 - Deve deletar o perfil do usuário', async () => {
      const res = await request(app)
        .delete('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Conta deletada com sucesso');
    });

    it('API 5 - Deve retornar 401 quando não autenticado', async () => {
      const res = await request(app).delete('/api/auth/me');

      expect(res.status).toBe(401);
    });
  });

  // ==========================================
  // Testes de Erro (catch blocks)
  // ==========================================
  describe('Error Handling', () => {
    it('Deve capturar erro de validação no registro', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nome: 'Test',
        email: 'test@t.com',
        // Missing required fields
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('Deve retornar erro 400 para email faltando no login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({senha: '123'});

      expect(res.status).toBe(400);
    });

    

   
    it('Deve capturar erro quando findOne falha no login', async () => {
      jest.spyOn(userModel, 'findOne').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'error@t.com', senha: '123'});

      expect(res.status).toBe(500);
    });
  });
});
