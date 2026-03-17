import request from 'supertest';
import mongoose from 'mongoose';
import app from '../../backend/src/app';
import userModel from '../../backend/src/models/userModel';

// Mock do mongoose para evitar conexão real com banco de dados
jest.mock('../../backend/src/database/connection', () => ({}));

jest.mock('../../backend/src/models/userModel', () => {
  const mockSave = jest.fn();
  const MockUserModel = jest.fn().mockImplementation((data: unknown) => ({
    ...data as object,
    _id: 'mock_id_123',
    save: mockSave,
  }));

  (MockUserModel as any).findOne = jest.fn();
  (MockUserModel as any).findById = jest.fn();
  (MockUserModel as any).prototype.comparePassword = jest.fn();

  return { __esModule: true, default: MockUserModel };
});

const mockedUserModel = userModel as jest.MockedClass<typeof userModel>;

describe('Auth Routes - Integração', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, JWT_SECRET: 'test_secret', ADMIN_KEY: 'admin_key_test' };
    jest.clearAllMocks();
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await mongoose.disconnect().catch(() => null);
  });

  // ---------- POST /api/auth/register ----------

  describe('POST /api/auth/register', () => {
    it('deve retornar 201 e token quando dados válidos são enviados', async () => {
      // Arrange
      (mockedUserModel.findOne as jest.Mock).mockResolvedValue(null);
      const mockSave = jest.fn().mockResolvedValue(undefined);
      (mockedUserModel as any).mockImplementation(() => ({
        _id: 'new_user_id',
        nome: 'Joana Silva',
        email: 'joana@pet.com',
        tipo: 'adotante',
        save: mockSave,
      }));

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send({ nome: 'Joana Silva', email: 'joana@pet.com', senha: 'senha123', tipo: 'adotante' });

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('message', 'Usuário criado com sucesso');
    });

    it('deve retornar 400 quando campos obrigatórios estão ausentes', async () => {
      // Arrange - apenas email, sem nome/senha/tipo

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'incompleto@pet.com' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Todos os campos são obrigatórios!');
    });

    it('deve retornar 400 quando email já está em uso', async () => {
      // Arrange
      (mockedUserModel.findOne as jest.Mock).mockResolvedValue({
        email: 'existente@pet.com',
      });

      // Act
      const response = await request(app)
        .post('/api/auth/register')
        .send({ nome: 'Qualquer', email: 'existente@pet.com', senha: 'senha123', tipo: 'cliente' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email já está em uso');
    });
  });

  // ---------- POST /api/auth/login ----------

  describe('POST /api/auth/login', () => {
    it('deve retornar 400 quando email ou senha estão ausentes', async () => {
      // Arrange - body vazio

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email e senha são obrigatórios');
    });

    it('deve retornar 401 quando usuário não é encontrado', async () => {
      // Arrange
      (mockedUserModel.findOne as jest.Mock).mockResolvedValue(null);

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'naoexiste@pet.com', senha: 'qualquersenha' });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Credenciais inválidas');
    });

    it('deve retornar 401 quando senha está incorreta', async () => {
      // Arrange
      const mockUser = {
        _id: 'user_id_1',
        email: 'usuario@pet.com',
        tipo: 'adotante',
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      (mockedUserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'usuario@pet.com', senha: 'senha_errada' });

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Credenciais inválidas');
    });

    it('deve retornar 200 e token quando credenciais são válidas', async () => {
      // Arrange
      const mockUser = {
        _id: 'user_id_1',
        nome: 'Maria Pet',
        email: 'maria@pet.com',
        tipo: 'cliente',
        comparePassword: jest.fn().mockResolvedValue(true),
      };
      (mockedUserModel.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'maria@pet.com', senha: 'senha_correta' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toMatchObject({
        email: 'maria@pet.com',
        tipo: 'cliente',
      });
    });
  });
});
