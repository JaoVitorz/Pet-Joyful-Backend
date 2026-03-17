import jwt from 'jsonwebtoken';
import ensureAuth from '../../../backend/src/middlewares/ensureAuth';
import type { AuthRequest } from '../../../backend/src/types/index';
import type { Response, NextFunction } from 'express';

// Helper para criar mocks de req, res e next
const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ensureAuth middleware', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, JWT_SECRET: 'test_secret', ADMIN_KEY: 'chave_admin_test' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('deve chamar next() quando admin key válida é fornecida', () => {
    // Arrange
    const req = {
      headers: { 'x-admin-key': 'chave_admin_test' },
      query: {},
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    ensureAuth(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(req.isApiKeyValid).toBe(true);
    expect(req.userRole).toBe('admin');
  });

  it('deve retornar 403 quando admin key inválida é fornecida', () => {
    // Arrange
    const req = {
      headers: { 'x-admin-key': 'chave_errada' },
      query: {},
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    ensureAuth(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Admin key inválida' }));
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 quando nenhum token é fornecido', () => {
    // Arrange
    const req = {
      headers: {},
      query: {},
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    ensureAuth(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token ausente' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 quando o formato do token é inválido', () => {
    // Arrange
    const req = {
      headers: { authorization: 'InvalidFormat' },
      query: {},
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    ensureAuth(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Formato do token inválido' });
  });

  it('deve chamar next() e popular req com dados do payload quando JWT válido', () => {
    // Arrange
    const payload = { userId: 'user123', email: 'joao@email.com', tipo: 'adotante' };
    const token = jwt.sign(payload, 'test_secret');
    const req = {
      headers: { authorization: `Bearer ${token}` },
      query: {},
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    ensureAuth(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe('user123');
    expect(req.userEmail).toBe('joao@email.com');
    expect(req.userRole).toBe('adotante');
  });

  it('deve retornar 401 quando JWT está expirado ou inválido', () => {
    // Arrange
    const req = {
      headers: { authorization: 'Bearer token_invalido_aqui' },
      query: {},
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    ensureAuth(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    expect(next).not.toHaveBeenCalled();
  });
});
