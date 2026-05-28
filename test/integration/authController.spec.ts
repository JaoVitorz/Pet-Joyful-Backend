import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../backend/src/app';
import userModel from '../../backend/src/models/userModel';

process.env.JWT_SECRET = 'test-secret-key-for-tests';

describe('Testes das APIs de autenticacao', () => {
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
    await userModel.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('deve registrar um usuario e voltar 201', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nome: 'Admin',
        email: 'admin@email.com',
        senha: '123',
        tipo: 'admin',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token');
    });

    it('deve voltar 400 se o email ja estiver cadastrado', async () => {
      // cria o usuario direto no banco
      await userModel.create({
        nome: 'A',
        email: 'duplicado@email.com',
        senha: '123',
        tipo: 'cliente',
      });

      // tenta criar outro com o mesmo email
      const res = await request(app).post('/api/auth/register').send({
        nome: 'B',
        email: 'duplicado@email.com',
        senha: '1',
        tipo: 'cliente',
      });

      expect(res.status).toBe(400);
    });

    it('deve voltar 400 se faltar algum campo obrigatorio', async () => {
      // manda so o email, sem nome senha e tipo
      const res = await request(app)
        .post('/api/auth/register')
        .send({email: 'incompleto@email.com'});

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve logar com sucesso e voltar 200', async () => {
      // cria o usuario antes de tentar logar
      await userModel.create({
        nome: 'User',
        email: 'loginok@email.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'loginok@email.com', senha: '123'});

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('deve voltar 401 se o email nao existir no banco', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'naoexiste@email.com', senha: '123'});

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Credenciais inválidas');
    });

    it('deve voltar 401 se a senha estiver errada', async () => {
      await userModel.create({
        nome: 'A',
        email: 'login@email.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'login@email.com', senha: 'senha-errada'});

      expect(res.status).toBe(401);
    });

    it('deve voltar 400 se faltar email ou senha', async () => {
      // manda so o email, sem a senha
      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'teste@email.com'});

      expect(res.status).toBe(400);
    });
  });

  describe('Rotas autenticadas /api/auth/me', () => {
    let token: string;

    // faz login antes de cada teste pra ter o token em maos
    beforeEach(async () => {
      await userModel.create({
        nome: 'Perfil',
        email: 'perfil@email.com',
        senha: '123',
        tipo: 'cliente',
      });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({email: 'perfil@email.com', senha: '123'});

      token = loginRes.body.token;
    });

    it('deve buscar o perfil do usuario logado', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
    });

    it('deve voltar 401 se tentar ver o perfil sem token', async () => {
      const res = await request(app).get('/api/auth/me');

      expect(res.status).toBe(401);
    });

    it('deve voltar 401 se o token for invalido', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer token-falso');

      expect(res.status).toBe(401);
    });

    it('deve atualizar o nome do perfil', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({nome: 'Nome Atualizado'});

      expect(res.status).toBe(200);
      expect(res.body.user.nome).toBe('Nome Atualizado');
    });

    it('deve atualizar o email do perfil', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({email: 'novoemail@email.com'});

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('novoemail@email.com');
    });

    it('deve voltar 400 se tentar mudar pra um email que ja ta em uso', async () => {
      await userModel.create({
        nome: 'Outro',
        email: 'outro@email.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({email: 'outro@email.com'});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email já em uso por outro usuário');
    });

    it('deve atualizar a senha do perfil', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({senha: 'novaSenha123'});

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
    });

    it('deve atualizar o tipo do perfil', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({tipo: 'adotante'});

      expect(res.status).toBe(200);
      expect(res.body.user.tipo).toBe('adotante');
    });

    it('deve voltar 401 se tentar atualizar sem token', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .send({nome: 'sem token'});

      expect(res.status).toBe(401);
    });

    it('deve deletar a conta do usuario logado', async () => {
      const res = await request(app)
        .delete('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Conta deletada com sucesso');
    });

    it('deve voltar 401 se tentar deletar sem token', async () => {
      const res = await request(app).delete('/api/auth/me');

      expect(res.status).toBe(401);
    });
  });

  describe('Erros de validacao', () => {
    it('deve voltar 400 se faltar senha e tipo no registro', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nome: 'Test',
        email: 'test@email.com',
        // faltam senha e tipo
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('deve voltar 400 se faltar email no login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({senha: '123'});

      expect(res.status).toBe(400);
    });
    
    it('deve voltar 500 quando o banco falhar no registro', async () => {
  // fecha a conexao pra simular queda do banco
  await mongoose.disconnect();

  const res = await request(app).post('/api/auth/register').send({
    nome: 'Test',
    email: 'test@email.com',
    senha: '123',
    tipo: 'cliente',
  });

  expect(res.status).toBe(500);

  // reconecta pro resto dos testes funcionarem
  await mongoose.connect(mongoServer.getUri());
});
  });
});