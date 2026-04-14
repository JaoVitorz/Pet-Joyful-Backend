// Importa as funções do controller que serão testadas

jest.mock('../../backend/src/logger/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

import { createPostMessage, createDenuncia } from '../../backend/src/controllers/messagesController';
import type { Response } from 'express';
import type { AuthRequest } from '../../backend/src/types/index';

// describe: agrupa os testes de integração do messagesController
describe('Messages Controller', () => {

  it('should return 400 when email is missing on post message', async () => {
    // Arrange: req sem email — apenas mensagem
    const req = { body: { mensagem: 'Sem email' } } as AuthRequest;

    // variáveis que capturam o que o controller chamar no res
    let status = 0;
    let body = {};

    // res simples  armazena os valores recebidos
    const res = {
      status(c: number) { status = c; return this; },
      json(b: object) { body = b; },
    } as unknown as Response;

    // Act: chama o controller diretamente como função
    await createPostMessage(req, res);

    // Assert: email obrigatório faltando → 400
    expect(status).toBe(400);
    expect(body).toEqual({ error: 'Email e mensagem são obrigatórios' });
  });

  it('should return 400 when message is missing on post message', async () => {
    // Arrange: req sem mensagem — apenas email
    const req = { body: { email: 'adotante@pet.com' } } as AuthRequest;
    let status = 0;
    let body = {};
    const res = {
      status(c: number) { status = c; return this; },
      json(b: object) { body = b; },
    } as unknown as Response;

    // Act
    await createPostMessage(req, res);

    // Assert: mensagem obrigatória faltando -> 400
    expect(status).toBe(400);
    expect(body).toEqual({ error: 'Email e mensagem são obrigatórios' });
  });

  it('should return 400 when email is missing on denuncia', async () => {
    // Arrange: req sem email — apenas descrição
    const req = { body: { descricao: 'Sem email' } } as AuthRequest;
    let status = 0;
    let body = {};
    const res = {
      status(c: number) { status = c; return this; },
      json(b: object) { body = b; },
    } as unknown as Response;

    // Act
    await createDenuncia(req, res);

    // Assert
    expect(status).toBe(400);
    expect(body).toEqual({ error: 'Email e descrição são obrigatórios' });
  });

  it('should return 400 when description is missing on denuncia', async () => {
    // Arrange: req sem descrição — apenas email
    const req = { body: { email: 'denuncia@pet.com' } } as AuthRequest;
    let status = 0;
    let body = {};
    const res = {
      status(c: number) { status = c; return this; },
      json(b: object) { body = b; },
    } as unknown as Response;

    // Act
    await createDenuncia(req, res);

    // Assert
    expect(status).toBe(400);
    expect(body).toEqual({ error: 'Email e descrição são obrigatórios' });
  });

});