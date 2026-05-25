import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import app from '../../backend/src/app';
import User from '../../backend/src/models/userModel';
import {
  createUser,
  getUsers,
} from '../../backend/src/controllers/userController';

// aqui a gente define as "senhas secretas" que os testes vão usar
// é igual a um post-it com a senha do wifi
process.env.ADMIN_KEY = 'chave-admin-secreta';
process.env.JWT_SECRET = 'jwt-secreto-teste';

describe('User CRUD Integration Tests (APIs 7 a 11)', () => {
  let mongoServer: MongoMemoryServer;
  const originalEnv = {...process.env};

  // isso aqui cria uma "resposta falsa" pra gente conseguir testar
  // o controller sem precisar fazer uma requisição HTTP de verdade
  // funciona como um gravador: guarda o que o servidor respondeu
  const buildRes = (): Parameters<typeof createUser>[1] => {
    const res = {
      status: jest.fn().mockReturnThis(), // grava qual código foi retornado (200, 404, etc)
      json: jest.fn().mockReturnThis(),   // grava qual mensagem foi retornada
    } as unknown as Parameters<typeof createUser>[1];

    return res;
  };

  // roda UMA VEZ antes de todos os testes começarem
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create(); // cria um banco de dados falso na memória
    const uri = mongoServer.getUri();               // pega o endereço desse banco falso
    await mongoose.connect(uri);                    // conecta a aplicação nesse banco falso
  });

  // roda UMA VEZ depois que todos os testes terminarem
  afterAll(async () => {
    await mongoose.disconnect();   // desconecta do banco
    await mongoServer.stop();      // desliga o banco falso
    process.env = originalEnv;     // restaura as variáveis de ambiente originais
  });

  // roda depois de CADA teste individual
  // serve pra limpar o banco entre os testes, pra um não interferir no outro
  afterEach(async () => {
    await User.deleteMany({});
  });

  // ==========================================
  // API 7: CRIAR USUÁRIO (POST /users)
  // ==========================================
  describe('POST /users - createUser', () => {

    // teste 1: fluxo normal, tudo certo
    it('Deve criar um usuário comum com sucesso (201)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('x-admin-key', 'chave-admin-secreta') // envia a chave de admin no cabeçalho
        .send({
          nome: 'João',
          email: 'joao@t.com',
          senha: '123',
          tipo: 'cliente',
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Usuário criado com sucesso!');
    });

    // teste 2: tentou criar sem mandar todos os campos obrigatórios
    it('Deve falhar se faltarem campos obrigatórios (400)', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('x-admin-key', 'chave-admin-secreta')
        .send({email: 'incompleto@t.com'}); // mandou só o email, sem nome, senha e tipo

      expect(res.status).toBe(400);
    });

    // teste 3: tentou criar sem mandar a chave de admin
    it('Deve impedir criação sem admin key (401)', async () => {
      const res = await request(app)
        .post('/api/users')
        // repara que não tem .set('x-admin-key', ...) aqui
        .send({
          nome: 'Hack',
          email: 'hack@admin.com',
          senha: '123',
          tipo: 'admin',
        });

      expect(res.status).toBe(401); // 401 = não autorizado
    });

    // teste 4: admin criando outro admin com a chave correta
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

    // teste 5: admin criando outro admin usando token JWT
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

    // teste 6: tenta cadastrar um email que já existe no banco
    it('Deve retornar 400 quando o email já estiver cadastrado', async () => {
      // primeiro cria um usuário direto no banco
      await User.create({
        nome: 'Duplicado',
        email: 'duplicado@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      // agora tenta criar outro com o mesmo email
      const res = await request(app)
        .post('/api/users')
        .set('x-admin-key', 'chave-admin-secreta')
        .send({
          nome: 'Outro',
          email: 'duplicado@t.com', // mesmo email de cima
          senha: '123',
          tipo: 'cliente',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email já cadastrado!');
    });
  });

 //api 8 e 9, testa  listar usuarios e buscar usuário por ID (GET /users e GET /users/:id)
  describe('GET /users & /users/:id', () => {

    // teste 1: lista todo mundo
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
      expect(res.body.length).toBe(1); // criou 1 usuário, então espera lista com 1 item
    });

    // teste 2: busca um usuário específico pelo ID dele
    it('API 9 - Deve buscar um usuário específico por ID', async () => {
      const criado = await User.create({
        nome: 'User2',
        email: 'u2@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .get(`/api/users/${criado._id}`) // usa o ID gerado automaticamente pelo banco
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(200);
      expect(res.body.email).toBe('u2@t.com');
    });

    // teste 3: busca com um ID que não existe no banco
    it('API 9 - Deve retornar 404 para ID inexistente', async () => {
      const idFake = new mongoose.Types.ObjectId(); // gera um ID válido mas que não existe

      const res = await request(app)
        .get(`/api/users/${idFake}`)
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(404); // 404 = não encontrado
    });

    // teste 4: manda um ID completamente errado, que nem tem formato de ID
    it('API 9 - Deve retornar 500 para ID inválido ao buscar usuário', async () => {
      const res = await request(app)
        .get('/api/users/invalid-id') // "invalid-id" não é um ID do MongoDB
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(500); // 500 = erro interno do servidor
    });
  });

  //api 10: atualizar usuário (PUT /users/:id)
  describe('PUT /users/:id - updateUser', () => {

    // teste 1: tenta atualizar sem ter permissão
    it('Deve impedir atualização se o usuário não for o dono nem admin (403)', async () => {
      const outroUsuario = await User.create({
        nome: 'Outro',
        email: 'o@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .put(`/api/users/${outroUsuario._id}`)
        .set('x-admin-key', 'chave-admin-invalida') // chave errada = sem permissão
        .send({nome: 'Invasor'});

      expect(res.status).toBe(403); // 403 = proibido
    });

    // teste 2: atualiza um usuário com sucesso
    it('Deve atualizar usuário com sucesso', async () => {
      const usuario = await User.create({
        nome: 'Antes',
        email: 'antes@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .put(`/api/users/${usuario._id}`)
        .set('x-admin-key', 'chave-admin-secreta')
        .send({
          nome: 'Depois',        // mudando o nome
          email: 'depois@t.com', // mudando o email
          senha: 'nova123',      // mudando a senha
          tipo: 'admin',         // mudando o tipo
        });

      expect(res.status).toBe(200);
      expect(res.body.user.nome).toBe('Depois');
      expect(res.body.user.email).toBe('depois@t.com');
      expect(res.body.user.tipo).toBe('admin');
    });

    // teste 3: tenta atualizar com um ID inválido
    it('Deve retornar 500 para ID inválido ao atualizar usuário', async () => {
      const res = await request(app)
        .put('/api/users/invalid-id')
        .set('x-admin-key', 'chave-admin-secreta')
        .send({nome: 'Invalido'});

      expect(res.status).toBe(500);
    });
  });

  //api 11: deletar usuário (DELETE /users/:id)
  describe('DELETE /users/:id - deleteUser', () => {

    // teste 1: tenta deletar um usuário que não existe
    it('Deve retornar 404 ao tentar deletar usuário que não existe no banco', async () => {
      const idFake = new mongoose.Types.ObjectId(); // ID válido mas inexistente

      const res = await request(app)
        .delete(`/api/users/${idFake}`)
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(404);
    });

    // teste 2: deleta com sucesso
    it('Deve deletar um usuário com sucesso', async () => {
      const usuario = await User.create({
        nome: 'ParaDeletar',
        email: 'delete@t.com',
        senha: '123',
        tipo: 'cliente',
      });

      const res = await request(app)
        .delete(`/api/users/${usuario._id}`)
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Usuário deletado com sucesso!');
    });

    // teste 3: tenta deletar com ID inválido
    it('Deve retornar 500 para ID inválido ao deletar usuário', async () => {
      const res = await request(app)
        .delete('/api/users/invalid-id')
        .set('x-admin-key', 'chave-admin-secreta');

      expect(res.status).toBe(500);
    });
  });

  //testes diretos do controller, sem passar pela rota HTTP,
  // pra pegar cobertura de código que não é alcançada pelos testes de integração
  describe('Cobertura direta do controller', () => {

    // teste 1: cria admin usando token JWT válido
    it('Deve aceitar criação de admin via token JWT no controller', async () => {
      // cria um token JWT — é como assinar um crachá de admin
      const token = jwt.sign({tipo: 'admin'}, process.env.JWT_SECRET as string); // tipo: 'admin' é o que dá a permissão
      const res = buildRes(); // resposta falsa pra capturar o que o controller responde

      await createUser(
        {
          body: {
            nome: 'Admin3',
            email: 'admin3@t.com',
            senha: '123',
            tipo: 'admin',
          },
          headers: {authorization: `Bearer ${token}`}, // envia o crachá no cabeçalho
          query: {}, // query vazia porque essa rota não usa query params
        } as Parameters<typeof createUser>[0], // força o tipo pra ficar igual ao que o controller espera
        res,
      );

      expect(res.status).toHaveBeenCalledWith(201); // espera que o status seja 201 (criado)
      expect(res.json).toHaveBeenCalledWith( // espera que a resposta tenha a mensagem de sucesso
        expect.objectContaining({message: 'Usuário criado com sucesso!'}), 
      );
    });

    // teste 2: tenta criar admin com token inválido (crachá falso)
    it('Deve retornar 403 quando o token de admin for inválido', async () => {
      const res = buildRes(); // resposta falsa

      await createUser(
        {
          body: {
            nome: 'Admin4',
            email: 'admin4@t.com',
            senha: '123',
            tipo: 'admin',
          },
          headers: {authorization: 'Bearer token-invalido'}, // token falso
          query: {},
        } as Parameters<typeof createUser>[0],
        res,
      );

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Criação de usuário admin requer API key ou token admin',
      });
    });

    // teste 3: simula uma falha no banco de dados na hora de listar usuários
    // o jest.spyOn "espiona" o método e força ele a dar erro
    // serve pra garantir que o servidor lida bem com erros inesperados
    it('Deve retornar 500 quando o listador de usuários falhar', async () => {
      const res = buildRes();
      const findSpy = jest //findSpy é a "espia" que vai observar o método User.find, que é o que o getUsers usa pra listar os usuários
        .spyOn(User, 'find') // "espiona" o método User.find, que é o que o getUsers usa pra listar os usuários
        .mockRejectedValueOnce(new Error('falha ao listar')); // força um erro

      await getUsers({} as Parameters<typeof getUsers>[0], res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'falha ao listar',
      });

      findSpy.mockRestore(); // restaura o comportamento original do User.find
    });
  });
});