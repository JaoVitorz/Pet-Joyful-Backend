import jwt from 'jsonwebtoken';
import verifyToken from '../../../backend/src/middlewares/verifyToken';
import type { AuthRequest } from '../../../backend/src/types/index';
import type { Response, NextFunction } from 'express';

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('verifyToken middleware', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, JWT_SECRET: 'test_secret' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('deve retornar 401 quando authorization header está ausente', () => {
    // Arrange
    const req = { headers: {} } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    verifyToken(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token ausente' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 quando formato Bearer está incorreto', () => {
    // Arrange
    const req = {
      headers: { authorization: 'Basic algumtoken' },
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    verifyToken(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Formato do token inválido' });
  });

  it('deve chamar next() e popular req.userId com JWT válido', () => {
    // Arrange
    const payload = { userId: 'abc123', email: 'teste@pet.com', tipo: 'cliente' };
    const token = jwt.sign(payload, 'test_secret');
    const req = {
      headers: { authorization: `Bearer ${token}` },
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    verifyToken(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(req.userId).toBe('abc123');
  });

  it('deve retornar 401 quando token está corrompido', () => {
    // Arrange
    const req = {
      headers: { authorization: 'Bearer token.corrompido.aqui' },
    } as unknown as AuthRequest;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    verifyToken(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido' });
    expect(next).not.toHaveBeenCalled();
  });
});
