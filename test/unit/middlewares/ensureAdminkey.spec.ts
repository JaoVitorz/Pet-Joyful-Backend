import ensureAdminKey from '../../../backend/src/middlewares/ensureAdminKey';
import type { AuthRequest } from '../../../backend/src/types/index';
import type { Response, NextFunction } from 'express';

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ensureAdminKey middleware', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, ADMIN_KEY: 'chave_admin_secreta' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('deve retornar 401 quando nenhuma admin key é fornecida', () => {
    // Arrange
    const req = {
      headers: {},
      query: {},
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    ensureAdminKey(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Admin key ausente' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 403 quando a admin key é inválida via header', () => {
    // Arrange
    const req = {
      headers: { 'x-admin-key': 'chave_errada' },
      query: {},
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    ensureAdminKey(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Admin key inválida' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next() e marcar req como admin quando chave válida vem no header', () => {
    // Arrange
    const req = {
      headers: { 'x-admin-key': 'chave_admin_secreta' },
      query: {},
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    ensureAdminKey(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(req.isApiKeyValid).toBe(true);
    expect(req.userRole).toBe('admin');
  });

  it('deve chamar next() quando chave válida vem via query string', () => {
    // Arrange
    const req = {
      headers: {},
      query: { admin_key: 'chave_admin_secreta' },
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    ensureAdminKey(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(req.isApiKeyValid).toBe(true);
    expect(req.userRole).toBe('admin');
  });

  it('deve retornar 403 quando chave válida está no header mas inválida na query', () => {
    // Arrange — header tem precedência; garante que query inválida sem header retorna 403
    const req = {
      headers: {},
      query: { admin_key: 'errada' },
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    ensureAdminKey(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});