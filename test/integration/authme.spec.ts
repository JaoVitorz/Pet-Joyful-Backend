import request from 'supertest';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import app from '../../backend/src/app';
import userModel from '../../backend/src/models/userModel';

jest.mock('../../backend/src/database/connection', () => ({}));

jest.mock('../../backend/src/models/userModel', () => {
  const MockUserModel = jest.fn().mockImplementation((data: unknown) => ({
    ...data as object,
    _id: 'mock_user_id',
    save: jest.fn().mockResolvedValue(undefined),
  }));
  (MockUserModel as any).findOne = jest.fn();
  (MockUserModel as any).findById = jest.fn();
  (MockUserModel as any).findByIdAndUpdate = jest.fn();
  (MockUserModel as any).findByIdAndDelete = jest.fn();
  return { __esModule: true, default: MockUserModel };
});

const mockedUserModel = userModel as jest.MockedClass<typeof userModel>;

// Gera um token JWT válido para uso nos testes
const gerarToken = (payload = { userId: 'user_123', email: 'eu@pet.com', tipo: 'adotante' }) =>
  jwt.sign(payload, 'test_secret', { expiresIn: '1h' });

describe('Auth /me Routes - Integração', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, JWT_SECRET: 'test_secret', ADMIN_KEY: 'admin_key_test' };
    jest.clearAllMocks();
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await mongoose.disconnect().catch(() => null);
  });

  // ---------- GET /api/auth/me ----------

  describe('GET /api/auth/me', () => {
    it('deve retornar 401 quando token está ausente', async () => {
      // Arrange — sem header de autorização

      // Act
      const response = await request(app).get('/api/auth/me').send();

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token ausente');
    });

    it('deve retornar 401 quando token é inválido', async () => {
      // Arrange
      // Act
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer token_invalido')
        .send();

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token inválido');
    });

    it('deve retornar 404 quando usuário do token não existe mais no banco', async () => {
      // Arrange
      const token = gerarToken();
      (mockedUserModel.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      // Act
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send();

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
    });

    it('deve retornar 200 e dados do perfil quando token é válido', async () => {
      // Arrange
      const token = gerarToken();
      const mockUser = { _id: 'user_123', nome: 'Eu Mesmo', email: 'eu@pet.com', tipo: 'adotante' };
      (mockedUserModel.findById as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      // Act
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send();

      // Assert
      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject({ nome: 'Eu Mesmo', email: 'eu@pet.com' });
    });
  });

  // ---------- DELETE /api/auth/me ----------

  describe('DELETE /api/auth/me', () => {
    it('deve retornar 401 quando token está ausente', async () => {
      // Arrange
      // Act
      const response = await request(app).delete('/api/auth/me').send();

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Token ausente');
    });

    it('deve retornar 404 quando conta a deletar não é encontrada', async () => {
      // Arrange
      const token = gerarToken();
      (mockedUserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      // Act
      const response = await request(app)
        .delete('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send();

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Usuário não encontrado');
    });

    it('deve retornar 200 quando conta é deletada com sucesso', async () => {
      // Arrange
      const token = gerarToken();
      const mockUser = { _id: 'user_123', nome: 'Eu Mesmo', email: 'eu@pet.com' };
      (mockedUserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .delete('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send();

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Conta deletada com sucesso');
    });
  });

  // ---------- PUT /api/auth/me ----------

  describe('PUT /api/auth/me', () => {
    it('deve retornar 200 e perfil atualizado quando dados são válidos', async () => {
      // Arrange
      const token = gerarToken();
      const mockUpdated = { _id: 'user_123', nome: 'Novo Nome', email: 'eu@pet.com', tipo: 'adotante' };
      (mockedUserModel.findOne as jest.Mock).mockResolvedValue(null); // email não em uso
      (mockedUserModel.findByIdAndUpdate as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUpdated),
      });

      // Act
      const response = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ nome: 'Novo Nome' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Perfil atualizado com sucesso');
      expect(response.body.user).toMatchObject({ nome: 'Novo Nome' });
    });

    it('deve retornar 400 quando novo email já está em uso por outro usuário', async () => {
      // Arrange
      const token = gerarToken();
      // Simula outro usuário com o mesmo email
      (mockedUserModel.findOne as jest.Mock).mockResolvedValue({
        _id: 'outro_user_id',
        email: 'ocupado@pet.com',
      });

      // Act
      const response = await request(app)
        .put('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'ocupado@pet.com' });

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Email já em uso por outro usuário');
    });
  });
});