import verifyApiKey from '../../../backend/src/middlewares/verifyApiKey';
import type { Request, Response, NextFunction } from 'express';

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('verifyApiKey middleware', () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    process.env = { ...OLD_ENV, API_KEY: 'api_key_valida_123' };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it('deve retornar 403 quando nenhuma key é fornecida', () => {
    // Arrange
    const req = {
      headers: {},
      query: {},
    } as unknown as Request;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    verifyApiKey(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Chave de API inválida ou ausente.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 403 quando a API key do header é inválida', () => {
    // Arrange
    const req = {
      headers: { 'x-api-key': 'chave_errada' },
      query: {},
    } as unknown as Request;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    verifyApiKey(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: 'Chave de API inválida ou ausente.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next() quando API key válida vem no header x-api-key', () => {
    // Arrange
    const req = {
      headers: { 'x-api-key': 'api_key_valida_123' },
      query: {},
    } as unknown as Request;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    verifyApiKey(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('deve chamar next() quando API key válida vem via query string', () => {
    // Arrange
    const req = {
      headers: {},
      query: { api_key: 'api_key_valida_123' },
    } as unknown as Request;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    verifyApiKey(req, res, next);

    // Assert
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('deve retornar 403 quando API key via query também está errada', () => {
    // Arrange
    const req = {
      headers: {},
      query: { api_key: 'invalida' },
    } as unknown as Request;
    const res = mockResponse();
    const next: NextFunction = jest.fn();

    // Act
    verifyApiKey(req, res, next);

    // Assert
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });
});