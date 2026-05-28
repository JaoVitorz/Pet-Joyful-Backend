import {Request, Response, NextFunction} from 'express';
import verifyApiKey from '../../backend/src/middlewares/verifyApiKey';

describe('Testes do middleware verifyApiKey', () => {
  it('deve barrar a requisicao e voltar 403 se a chave estiver errada', () => {
    process.env.API_KEY = '123';

    const req = {
      headers: {'x-api-key': '999'}, // chave errada
    } as unknown as Request;

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res = {status, json} as unknown as Response;
    const next: NextFunction = jest.fn();

    verifyApiKey(req, res, next);

    expect(status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it('deve deixar passar e chamar o next se a chave estiver certa', () => {
    process.env.API_KEY = '123';

    const req = {
      headers: {'x-api-key': '123'}, // chave certa
    } as unknown as Request;

    const status = jest.fn().mockReturnThis();
    const json = jest.fn();
    const res = {status, json} as unknown as Response;
    const next: NextFunction = jest.fn();

    verifyApiKey(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(status).not.toHaveBeenCalled();
  });
});