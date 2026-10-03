import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {createHash} from 'node:crypto';
import app from '../../backend/src/app';
import userModel from '../../backend/src/models/userModel';
import {sendVerificationEmail} from '../../backend/src/services/emailService';

jest.mock('../../backend/src/services/emailService', () => ({sendVerificationEmail: jest.fn()}));

process.env.JWT_SECRET = 'test-secret-key-for-tests';
jest.setTimeout(60_000);

describe('Testes das APIs de autenticacao', () => {
  let mongoServer: MongoMemoryServer;

  // sobe o banco em memoria antes de tudo
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({instance: {launchTimeout: 30_000}});
    await mongoose.connect(mongoServer.getUri());
  });

  // desliga tudo depois que acabar
  afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
  });

  // limpa os usuarios do banco depois de cada teste
  afterEach(async () => {
    await userModel.deleteMany({});
  });

  const identity = {cpf: '404.428.201-35'};

  describe('POST /api/auth/register', () => {
    it('deve registrar um usuario e voltar 201', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nome: 'Admin',
        email: 'admin@email.com',
        senha: '123',
        tipo: 'admin',
        ...identity,
      });

      expect(res.status).toBe(201);
      expect(res.body).not.toHaveProperty('token');
      expect(sendVerificationEmail).toHaveBeenCalledWith('admin@email.com', expect.any(String));
      expect(res.body.user.emailVerified).toBe(false);
      const user = await userModel
        .findOne({email: 'admin@email.com'})
        .select('+emailVerificationToken +emailVerificationExpires');
      expect(user?.emailVerificationToken).toBeDefined();
      expect(user?.emailVerificationExpires?.getTime()).toBeGreaterThan(Date.now());
    });

    it('deve ativar a conta com um token de verificação válido', async () => {
      const rawToken = 'token-de-verificacao-valido';
      await userModel.create({
        nome: 'Pendente',
        email: 'pendente@email.com',
        senha: '123',
        tipo: 'cliente',
        emailVerified: false,
        emailVerificationToken: createHash('sha256').update(rawToken).digest('hex'),
        emailVerificationExpires: new Date(Date.now() + 60_000),
      });

      const res = await request(app)
        .get('/api/auth/verify-email')
        .query({token: rawToken});

      expect(res.status).toBe(200);
      expect((await userModel.findOne({email: 'pendente@email.com'}))?.emailVerified).toBe(true);
    });

    it('deve rejeitar um token de verificação expirado', async () => {
      const rawToken = 'token-de-verificacao-expirado';
      await userModel.create({
        nome: 'Expirado',
        email: 'expirado@email.com',
        senha: '123',
        tipo: 'cliente',
        emailVerified: false,
        emailVerificationToken: createHash('sha256').update(rawToken).digest('hex'),
        emailVerificationExpires: new Date(Date.now() - 60_000),
      });

      const res = await request(app)
        .get('/api/auth/verify-email')
        .query({token: rawToken});

      expect(res.status).toBe(400);
    });

    it('deve voltar 400 se o email ja estiver cadastrado', async () => {
      // cria o usuario direto no banco
      await userModel.create({
        nome: 'A',
        email: 'duplicado@email.com',
        senha: '123',
        tipo: 'cliente',
        ...identity,
        emailVerified: true,
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

  describe('Validação de CPF', () => {
    it('rejeita CPF com dígitos inválidos', async () => {
      const res = await request(app).post('/api/auth/validate-cpf').send({
        cpf: '111.111.111-11',
      });
      expect(res.status).toBe(400);
    });

    it('rejeita CPF com dígito incorreto no cadastro', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nome: 'A', email: 'a@email.com', senha: '123', tipo: 'cliente', cpf: '404.428.201-36',
      });
      expect(res.status).toBe(400);
      expect(await userModel.countDocuments()).toBe(0);
    });

    it('valida CPF sem exigir data de nascimento', async () => {
      const res = await request(app).post('/api/auth/validate-cpf').send(identity);
      expect(res.status).toBe(200);
      expect(res.body).toEqual({valido: true, verificacao: 'digitos_verificadores'});
    });

    it('aceita CPF com dígitos válidos e o armazena sem devolvê-lo na resposta', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nome: 'A', email: 'a@email.com', senha: '123', tipo: 'cliente', ...identity,
      });
      expect(res.status).toBe(201);
      expect(res.body.user.cpf).toBeUndefined();
      expect((await userModel.findOne({email: 'a@email.com'}).select('+cpf'))?.cpf).toBe('40442820135');
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
        emailVerified: true,
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
        emailVerified: true,
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
        emailVerified: true,
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
        emailVerified: true,
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
    ...identity,
  });

  expect(res.status).toBe(500);

  // reconecta pro resto dos testes funcionarem
  await mongoose.connect(mongoServer.getUri());
});
  });
});
