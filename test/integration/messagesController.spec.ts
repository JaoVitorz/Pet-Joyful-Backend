import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../backend/src/app';
import PostMessage from '../../backend/src/models/postMessageModel';
import DenunciaMessage from '../../backend/src/models/denunciaMessageModel';

// Mock do mongoose para evitar conexão real com banco de dados
jest.mock('../../backend/src/database/connection', () => ({}));

jest.mock('../../backend/src/models/postMessageModel', () => {
  const mockSave = jest.fn().mockResolvedValue(undefined);
  const MockPostMessage = jest.fn().mockImplementation((data: unknown) => ({
    ...data as object,
    _id: 'post_msg_id',
    createdAt: new Date().toISOString(),
    save: mockSave,
  }));
  (MockPostMessage as any).find = jest.fn();
  return { __esModule: true, default: MockPostMessage };
});

jest.mock('../../backend/src/models/denunciaMessageModel', () => {
  const mockSave = jest.fn().mockResolvedValue(undefined);
  const MockDenuncia = jest.fn().mockImplementation((data: unknown) => ({
    ...data as object,
    _id: 'denuncia_id',
    createdAt: new Date().toISOString(),
    save: mockSave,
  }));
  (MockDenuncia as any).find = jest.fn();
  return { __esModule: true, default: MockDenuncia };
});

const mockedPostMessage = PostMessage as jest.MockedClass<typeof PostMessage>;
const mockedDenuncia = DenunciaMessage as jest.MockedClass<typeof DenunciaMessage>;

describe('Messages Routes - Integração', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, JWT_SECRET: 'test_secret', ADMIN_KEY: 'admin_key_test' };
    jest.clearAllMocks();
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await mongoose.disconnect().catch(() => null);
  });

  // ---------- POST /api/messages/post ----------

  describe('POST /api/messages/post', () => {
    it('deve retornar 201 quando mensagem de post é criada com sucesso', async () => {
      // Arrange
      const mockSave = jest.fn().mockResolvedValue(undefined);
      (mockedPostMessage as any).mockImplementation((data: unknown) => ({
        ...data as object,
        _id: 'post_msg_id_new',
        save: mockSave,
      }));

      // Act
      const response = await request(app)
        .post('/api/messages/post')
        .send({ email: 'adotante@pet.com', mensagem: 'Tenho interesse nesse pet!', postId: 'post_abc' });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Mensagem salva com sucesso');
      expect(response.body).toHaveProperty('data');
    });

    it('deve retornar 400 quando email ou mensagem estão ausentes', async () => {
      // Arrange - sem campo email

      // Act
      const response = await request(app)
        .post('/api/messages/post')
        .send({ mensagem: 'Mensagem sem email' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email e mensagem são obrigatórios');
    });

    it('deve retornar 400 quando mensagem está ausente', async () => {
      // Arrange - sem campo mensagem

      // Act
      const response = await request(app)
        .post('/api/messages/post')
        .send({ email: 'alguem@pet.com' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email e mensagem são obrigatórios');
    });
  });

  // ---------- GET /api/messages/post ----------

  describe('GET /api/messages/post', () => {
    it('deve retornar 200 e lista de mensagens', async () => {
      // Arrange
      const mockMessages = [
        { _id: 'msg1', email: 'a@a.com', mensagem: 'Oi', createdAt: new Date() },
        { _id: 'msg2', email: 'b@b.com', mensagem: 'Olá', createdAt: new Date() },
      ];
      (mockedPostMessage.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockMessages),
      });

      // Act
      const response = await request(app).get('/api/messages/post').send();

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });

    it('deve retornar lista vazia quando não há mensagens', async () => {
      // Arrange
      (mockedPostMessage.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      });

      // Act
      const response = await request(app).get('/api/messages/post').send();

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  // ---------- POST /api/messages/denuncia ----------

  describe('POST /api/messages/denuncia', () => {
    it('deve retornar 201 quando denúncia é criada com sucesso', async () => {
      // Arrange
      const mockSave = jest.fn().mockResolvedValue(undefined);
      (mockedDenuncia as any).mockImplementation((data: unknown) => ({
        ...data as object,
        _id: 'denuncia_new_id',
        save: mockSave,
      }));

      // Act
      const response = await request(app)
        .post('/api/messages/denuncia')
        .send({ email: 'denuncia@pet.com', descricao: 'Conteúdo inadequado no post.', alvoTipo: 'post' });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message', 'Denúncia registrada com sucesso');
    });

    it('deve retornar 400 quando email ou descrição estão ausentes', async () => {
      // Arrange - sem descrição

      // Act
      const response = await request(app)
        .post('/api/messages/denuncia')
        .send({ email: 'denuncia@pet.com' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email e descrição são obrigatórios');
    });
  });
});
