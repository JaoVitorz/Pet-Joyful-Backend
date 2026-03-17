import request from 'supertest';
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
  (MockUserModel as any).find = jest.fn();
  (MockUserModel as any).findOne = jest.fn();
  (MockUserModel as any).findById = jest.fn();
  (MockUserModel as any).findByIdAndUpdate = jest.fn();
  (MockUserModel as any).findByIdAndDelete = jest.fn();
  return { __esModule: true, default: MockUserModel };
});

const mockedUserModel = userModel as jest.MockedClass<typeof userModel>;

describe('User Routes - Integração', () => {
  const OLD_ENV = process.env;
  const ADMIN_KEY = 'admin_key_test';

  beforeEach(() => {
    process.env = { ...OLD_ENV, JWT_SECRET: 'test_secret', ADMIN_KEY };
    jest.clearAllMocks();
  });

  afterAll(async () => {
    process.env = OLD_ENV;
    await mongoose.disconnect().catch(() => null);
  });

  // ---------- GET /api/users ----------

  describe('GET /api/users', () => {
    it('deve retornar 401 quando admin key está ausente', async () => {
      // Arrange — nenhum header de autenticação

      // Act
      const response = await request(app).get('/api/users').send();

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error', 'Admin key ausente');
    });

    it('deve retornar 403 quando admin key é inválida', async () => {
      // Arrange
      // Act
      const response = await request(app)
        .get('/api/users')
        .set('x-admin-key', 'chave_errada')
        .send();

      // Assert
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('error', 'Admin key inválida');
    });

    it('deve retornar 200 e lista de usuários quando admin key é válida', async () => {
      // Arrange
      const mockUsers = [
        { _id: 'id1', nome: 'Ana', email: 'ana@pet.com', tipo: 'adotante' },
        { _id: 'id2', nome: 'Bruno', email: 'bruno@pet.com', tipo: 'cliente' },
      ];
      (mockedUserModel.find as jest.Mock).mockResolvedValue(mockUsers);

      // Act
      const response = await request(app)
        .get('/api/users')
        .set('x-admin-key', ADMIN_KEY)
        .send();

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toMatchObject({ nome: 'Ana', tipo: 'adotante' });
    });
  });

  // ---------- GET /api/users/:id ----------

  describe('GET /api/users/:id', () => {
    it('deve retornar 404 quando usuário não existe', async () => {
      // Arrange
      (mockedUserModel.findById as jest.Mock).mockResolvedValue(null);

      // Act
      const response = await request(app)
        .get('/api/users/id_inexistente')
        .set('x-admin-key', ADMIN_KEY)
        .send();

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Usuário não encontrado!');
    });

    it('deve retornar 200 e o usuário quando encontrado', async () => {
      // Arrange
      const mockUser = { _id: 'id1', nome: 'Carlos', email: 'carlos@pet.com', tipo: 'admin' };
      (mockedUserModel.findById as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .get('/api/users/id1')
        .set('x-admin-key', ADMIN_KEY)
        .send();

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({ nome: 'Carlos', email: 'carlos@pet.com' });
    });
  });

  // ---------- rota DELETE /api/users/:id ----------

  describe('DELETE /api/users/:id', () => {
    it('deve retornar 404 quando usuário a deletar não existe', async () => {
      // Arrange
      (mockedUserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      // Act
      const response = await request(app)
        .delete('/api/users/id_inexistente')
        .set('x-admin-key', ADMIN_KEY)
        .send();

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Usuário não encontrado!');
    });

    it('deve retornar 200 quando usuário é deletado com sucesso', async () => {
      // Arrange
      const mockUser = { _id: 'id1', nome: 'Davi', email: 'davi@pet.com' };
      (mockedUserModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .delete('/api/users/id1')
        .set('x-admin-key', ADMIN_KEY)
        .send();

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Usuário deletado com sucesso!');
    });
  });
});