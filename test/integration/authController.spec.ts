import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../backend/src/app';
import userModel from '../../backend/src/models/userModel';

// define a senha secreta que vai ser usada pra gerar os tokens nos testes
process.env.JWT_SECRET = 'test-secret-key-for-tests';

describe('Auth Integration Tests (Sem Banco Real)', () => {
  let mongoServer: MongoMemoryServer;

  // antes de tudo: sobe o banco falso na memória e conecta
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  // depois de tudo: desliga o banco falso
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // depois de cada teste: limpa todos os usuários do banco
  // assim cada teste começa do zero, sem sobrar lixo do anterior
  afterEach(async () => {
    await userModel.deleteMany({});
  });

  // ==========================================
  // API 1: REGISTRAR USUÁRIO (POST /auth/register)
  // ==========================================
  describe('API 1 - Register', () => {

    // cenário feliz: tudo certo, usuário criado
    it('Deve registrar um usuário e retornar 201', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nome: 'Admin',
        email: 'admin@teste.com',
        senha: '123',
        tipo: 'admin',
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('token'); // verifica se veio um token na resposta
    });

    // tenta cadastrar um email que já existe no banco
    it('Deve retornar 400 se o e-mail já existir', async () => {
      await userModel.create({
        nome: 'A',
        email: 'duplicado@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app).post('/api/auth/register').send({
        nome: 'B',
        email: 'duplicado@t.com', // mesmo email de cima
        senha: '1',
        tipo: 'cliente',
      });

      expect(res.status).toBe(400);
    });

    // tenta registrar mandando só o email, sem nome, senha e tipo
    it('Deve retornar 400 se faltarem campos obrigatórios', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({email: 'incompleto@t.com'});

      expect(res.status).toBe(400);
    });

    // a API aceita os campos em inglês também (name, password, type)
    // útil se o front-end mandar os dados em inglês
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

    // tenta fazer login com um email que não existe no banco
    it('Deve retornar 401 se email não existir no login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'naoexiste@t.com', senha: '123'});

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Credenciais inválidas');
    });

    // tenta fazer login sem mandar a senha
    it('Deve retornar 400 se faltarem email ou senha no login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'teste@t.com'}); // falta a senha

      expect(res.status).toBe(400);
    });
  });

  // ==========================================
  // API 2: LOGIN (POST /auth/login)
  // ==========================================
  describe('API 2 - Login', () => {

    // cenário feliz: email e senha corretos
    it('Deve logar com sucesso e retornar 200', async () => {
      // cria o usuário direto no banco antes de tentar logar
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
      expect(res.body).toHaveProperty('token'); // login bem-sucedido devolve um token
    });

    // email existe mas a senha está errada
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

    // mesmo que o teste anterior mas mandando o campo em inglês (password)
    it('Deve logar com password em inglês', async () => {
      await userModel.create({
        nome: 'User',
        email: 'login2@t.com',
        senha: '789',
        tipo: 'cliente',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({email: 'login2@t.com', password: '789'}); // campo em inglês

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });

  // ==========================================
  // APIs 3, 4 e 5: ROTAS QUE PRECISAM DE LOGIN (/auth/me)
  // essas rotas só funcionam se o usuário estiver logado
  // por isso o beforeEach cria um usuário e faz login antes de cada teste
  // ==========================================
  describe('APIs Autenticadas (Profile)', () => {
    let token: string; // guarda o token do usuário logado

    // antes de cada teste: cria um usuário e faz login pra pegar o token
    beforeEach(async () => {
      await userModel.create({
        nome: 'Perfil',
        email: 'perfil@t.com',
        senha: '123',
        tipo: 'cliente',
      });
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({email: 'perfil@t.com', senha: '123'});
      token = loginRes.body.token; // salva o token pra usar nos testes abaixo
    });

    // API 3: VER PERFIL (GET /auth/me)
    it('API 3 - Deve buscar o perfil do usuário logado', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`); // envia o token no cabeçalho

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
    });

    // tenta ver o perfil sem estar logado
    it('API 3 - Deve retornar 401 quando token não é fornecido', async () => {
      const res = await request(app).get('/api/auth/me'); // sem token

      expect(res.status).toBe(401);
    });

    // tenta ver o perfil com um token inválido (como se tivesse falsificado)
    it('API 3 - Deve retornar 401 com token inválido', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token'); // token falso

      expect(res.status).toBe(401);
    });

    // API 4: ATUALIZAR PERFIL (PUT /auth/me)
    it('API 4 - Deve atualizar dados do perfil', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({nome: 'Nome Atualizado'});

      expect(res.status).toBe(200);
      expect(res.body.user.nome).toBe('Nome Atualizado');
    });

    // tenta atualizar sem estar logado
    it('API 4 - Deve retornar 401 quando não autenticado', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .send({nome: 'Nome Atualizado'}); // sem token

      expect(res.status).toBe(401);
    });

    // tenta trocar o email pra um que já pertence a outro usuário
    it('API 4 - Deve retornar 400 se email já está em uso', async () => {
      await userModel.create({
        nome: 'Outro User',
        email: 'outro@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({email: 'outro@t.com'}); // email que já pertence a outro usuário

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email já em uso por outro usuário');
    });

    // atualiza o email pra um que ainda não existe
    it('API 4 - Deve atualizar email do perfil', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({email: 'novoemail@t.com'});

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('novoemail@t.com');
    });

    // atualiza só a senha
    it('API 4 - Deve atualizar senha do perfil', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({senha: 'novaSenha123'});

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('user');
    });

    // atualiza só o tipo do usuário
    it('API 4 - Deve atualizar tipo do perfil', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({tipo: 'adotante'});

      expect(res.status).toBe(200);
      expect(res.body.user.tipo).toBe('adotante');
    });

    // manda um body vazio — a API não deve quebrar, só não atualizar nada
    it('API 4 - Deve atualizar sem campos (apenas validação)', async () => {
      const res = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(200);
      expect(res.body.user).toHaveProperty('nome');
    });

    // API 5: DELETAR CONTA (DELETE /auth/me)
    it('API 5 - Deve deletar o perfil do usuário', async () => {
      const res = await request(app)
        .delete('/api/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Conta deletada com sucesso');
    });

    // tenta deletar sem estar logado
    it('API 5 - Deve retornar 401 quando não autenticado', async () => {
      const res = await request(app).delete('/api/auth/me'); // sem token

      expect(res.status).toBe(401);
    });
  });

  // ==========================================
  // TESTES DE ERRO INESPERADO
  // aqui a gente testa o que acontece quando algo dá errado por dentro
  // tipo simular uma queda do banco de dados
  // ==========================================
  describe('Error Handling', () => {

    // tenta registrar mandando campos incompletos
    it('Deve capturar erro de validação no registro', async () => {
      const res = await request(app).post('/api/auth/register').send({
        nome: 'Test',
        email: 'test@t.com',
        // faltam senha e tipo
      });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    // tenta fazer login sem mandar o email
    it('Deve retornar erro 400 para email faltando no login', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({senha: '123'}); // falta o email

      expect(res.status).toBe(400);
    });

    // simula uma falha no banco na hora do login
    // o jest.spyOn força o método findOne a dar erro, como se o banco tivesse caído
    // serve pra garantir que o servidor não trava e responde 500 corretamente
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