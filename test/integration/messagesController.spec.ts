import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import app from '../../backend/src/app';
import PostMessage from '../../backend/src/models/postMessageModel';
import DenunciaMessage from '../../backend/src/models/denunciaMessageModel';

const ADMIN_KEY = 'test-admin-key';
const MESSAGES_BASE = '/api/messages';

describe('Testes das APIs de mensagens e denuncias', () => {
  let mongoServer: MongoMemoryServer;

  // sobe o banco em memoria antes de rodar os testes
  beforeAll(async () => {
    process.env.ADMIN_KEY = ADMIN_KEY;
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  // encerra tudo depois que terminar
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // limpa o banco depois de cada teste pra nao misturar os dados
  afterEach(async () => {
    await PostMessage.deleteMany({});
    await DenunciaMessage.deleteMany({});
  });

  describe('POST /api/messages/post', () => {
    it('deve salvar a mensagem e voltar 201', async () => {
      // manda todos os campos preenchidos
      const res = await request(app).post(`${MESSAGES_BASE}/post`).send({
        nome: 'Fulano',
        email: 'fulano@email.com',
        mensagem: 'Quero adotar um gatinho!',
        postId: new mongoose.Types.ObjectId().toString(),
      });

      // espera que salvou e voltou o id do registro criado
      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Mensagem salva com sucesso');
      expect(res.body.data).toHaveProperty('_id');
    });

    it('deve voltar 400 se nao tiver email ou mensagem', async () => {
      // manda so o nome, sem os campos obrigatorios
      const res = await request(app)
        .post(`${MESSAGES_BASE}/post`)
        .send({nome: 'so o nome'});

      // a api tem que barrar e avisar o que ta faltando
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email e mensagem são obrigatórios');
    });
  });

  describe('GET /api/messages/post', () => {
    it('deve retornar as mensagens que estao no banco', async () => {
      // cria uma mensagem direto no banco antes de buscar
      await PostMessage.create({email: 'user@email.com', mensagem: 'oi'});

      const res = await request(app).get(`${MESSAGES_BASE}/post`);

      // tem que voltar um array com a mensagem que a gente criou
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });

    it('deve retornar lista vazia se nao tiver nada cadastrado', async () => {
      // nao criou nada, entao tem que vir vazio
      const res = await request(app).get(`${MESSAGES_BASE}/post`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('POST /api/messages/denuncia', () => {
    it('deve registrar a denuncia e voltar 201', async () => {
      // manda uma denuncia completa
      const res = await request(app).post(`${MESSAGES_BASE}/denuncia`).send({
        email: 'fiscal@email.com',
        descricao: 'vi um comentario ofensivo',
        alvoId: new mongoose.Types.ObjectId().toString(),
        alvoTipo: 'post',
      });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('Denúncia registrada com sucesso');
    });

    it('deve voltar 400 se nao mandar o email', async () => {
      // esqueceu o email, so mandou a descricao
      const res = await request(app)
        .post(`${MESSAGES_BASE}/denuncia`)
        .send({descricao: 'esqueci o email'});

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email e descrição são obrigatórios');
    });
  });

  describe('GET /api/messages/denuncia', () => {
    it('deve retornar as denuncias quando a chave ta certa', async () => {
      // cria uma denuncia no banco e tenta buscar com a chave correta
      await DenunciaMessage.create({
        email: 'admin@email.com',
        descricao: 'denuncia de teste',
      });

      const res = await request(app)
        .get(`${MESSAGES_BASE}/denuncia`)
        .set('x-admin-key', ADMIN_KEY);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('deve voltar 401 se tentar acessar sem a chave de admin', async () => {
      // nao passou nenhuma chave, nao pode deixar entrar
      const res = await request(app).get(`${MESSAGES_BASE}/denuncia`);

      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Admin key ausente');
    });
  });

  describe('PUT /api/messages/post/:id', () => {
    it('deve atualizar a mensagem normalmente', async () => {
      // cria a mensagem e depois tenta atualizar ela
      const msg = await PostMessage.create({
        email: 'antes@email.com',
        mensagem: 'mensagem antiga',
      });

      const res = await request(app)
        .put(`${MESSAGES_BASE}/post/${msg._id}`)
        .set('x-admin-key', ADMIN_KEY)
        .send({email: 'depois@email.com', mensagem: 'mensagem nova'});

      // verifica se o campo foi alterado de fato
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Mensagem atualizada');
      expect(res.body.data.mensagem).toBe('mensagem nova');
    });

    it('deve voltar 404 se tentar atualizar uma mensagem que nao existe', async () => {
      // manda um id valido mas que nao ta no banco
      const res = await request(app)
        .put(`${MESSAGES_BASE}/post/${new mongoose.Types.ObjectId()}`)
        .set('x-admin-key', ADMIN_KEY)
        .send({email: 'x@email.com', mensagem: 'nao existe'});

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Mensagem não encontrada');
    });
  });

  describe('DELETE /api/messages/post/:id', () => {
    it('deve deletar a mensagem normalmente', async () => {
      const msg = await PostMessage.create({
        email: 'deletar@email.com',
        mensagem: 'essa vai sumir',
      });

      const res = await request(app)
        .delete(`${MESSAGES_BASE}/post/${msg._id}`)
        .set('x-admin-key', ADMIN_KEY);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Mensagem deletada');

      // vai no banco checar se sumiu mesmo
      const deleted = await PostMessage.findById(msg._id);
      expect(deleted).toBeNull();
    });

    it('deve voltar 403 se a chave de admin estiver errada', async () => {
      const msg = await PostMessage.create({
        email: 'u@email.com',
        mensagem: 'nao pode deletar',
      });

      // passa uma chave errada pra ver se barra
      const res = await request(app)
        .delete(`${MESSAGES_BASE}/post/${msg._id}`)
        .set('x-admin-key', 'chave-errada');

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Admin key inválida');
    });

    it('deve voltar 404 se a mensagem nao existir', async () => {
      const res = await request(app)
        .delete(`${MESSAGES_BASE}/post/${new mongoose.Types.ObjectId()}`)
        .set('x-admin-key', ADMIN_KEY);

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Mensagem não encontrada');
    });
  });

  describe('PUT /api/messages/denuncia/:id', () => {
    it('deve atualizar a denuncia normalmente', async () => {
      const report = await DenunciaMessage.create({
        email: 'denuncia@email.com',
        descricao: 'descricao antiga',
      });

      const res = await request(app)
        .put(`${MESSAGES_BASE}/denuncia/${report._id}`)
        .set('x-admin-key', ADMIN_KEY)
        .send({
          email: 'denuncia@email.com',
          descricao: 'descricao nova',
          alvoTipo: 'post',
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Denúncia atualizada');
      expect(res.body.data.descricao).toBe('descricao nova');
    });

    it('deve voltar 403 se a chave de admin estiver errada', async () => {
      const report = await DenunciaMessage.create({
        email: 'denuncia@email.com',
        descricao: 'descricao antiga',
      });

      const res = await request(app)
        .put(`${MESSAGES_BASE}/denuncia/${report._id}`)
        .set('x-admin-key', 'chave-errada')
        .send({descricao: 'tentando atualizar'});

      expect(res.status).toBe(403);
      expect(res.body.error).toBe('Admin key inválida');
    });

    it('deve voltar 404 se a denuncia nao existir', async () => {
      const res = await request(app)
        .put(`${MESSAGES_BASE}/denuncia/${new mongoose.Types.ObjectId()}`)
        .set('x-admin-key', ADMIN_KEY)
        .send({email: 'x@email.com', descricao: 'nao existe'});

      expect(res.status).toBe(404);
      expect(res.body.error).toBe('Denúncia não encontrada');
    });
    
  });

  
  describe('Erros 500 por ID invalido', () => {
  it('deve voltar 500 ao atualizar mensagem com id invalido', async () => {
    const res = await request(app)
      .put(`${MESSAGES_BASE}/post/id-invalido`)
      .set('x-admin-key', ADMIN_KEY)
      .send({mensagem: 'teste'});

    expect(res.status).toBe(500);
  });

  it('deve voltar 500 ao deletar mensagem com id invalido', async () => {
    const res = await request(app)
      .delete(`${MESSAGES_BASE}/post/id-invalido`)
      .set('x-admin-key', ADMIN_KEY);

    expect(res.status).toBe(500);
  });

  it('deve voltar 500 ao atualizar denuncia com id invalido', async () => {
    const res = await request(app)
      .put(`${MESSAGES_BASE}/denuncia/id-invalido`)
      .set('x-admin-key', ADMIN_KEY)
      .send({descricao: 'teste'});

    expect(res.status).toBe(500);
  });

  it('deve voltar 500 ao deletar denuncia com id invalido', async () => {
    const res = await request(app)
      .delete(`${MESSAGES_BASE}/denuncia/id-invalido`)
      .set('x-admin-key', ADMIN_KEY);

    expect(res.status).toBe(500);
  });
});
});