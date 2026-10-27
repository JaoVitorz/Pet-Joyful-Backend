import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import '../../backend/src/config/mongooseSecurity';
import inputGuard, {validateBodyFields, validateObjectIdParam} from '../../backend/src/middlewares/inputGuard';
import {validateAuthInput, validateCpfBody} from '../../backend/src/middlewares/authValidators';
import {validateCreatePostMessage, validateCreateReport, validateUpdatePostMessage} from '../../backend/src/middlewares/messageValidators';

const app = express();
app.use(express.json());
app.use(inputGuard);
app.post('/login', validateAuthInput('login'), (_req, res) => res.sendStatus(204));
app.post('/register', validateAuthInput('register'), (_req, res) => res.sendStatus(204));
app.post('/cpf', validateCpfBody, (_req, res) => res.sendStatus(204));
app.post('/strict', validateBodyFields(['text'], ['text']), (_req, res) => res.sendStatus(204));
app.post('/message', validateCreatePostMessage, (_req, res) => res.sendStatus(204));
app.post('/report', validateCreateReport, (_req, res) => res.sendStatus(204));
app.put('/message/:id', validateObjectIdParam(), validateUpdatePostMessage, (_req, res) => res.sendStatus(204));

describe('proteções contra NoSQL injection', () => {
  it('mantém sanitizeFilter habilitado', () => {
    expect(mongoose.get('sanitizeFilter')).toBe(true);
  });

  it.each([
    {email: {$ne: null}, senha: 'qualquer-senha'},
    {email: 'x@y.com', senha: 'abc', $where: 'true'},
    {email: 'x@y.com', senha: ['a', 'b']},
    {email: 'x@y.com', senha: 'abc', 'perfil.admin': true},
  ])('rejeita operadores e dados não escalares', async body => {
    expect((await request(app).post('/login').send(body)).status).toBe(400);
  });

  it('rejeita alias conflitante e promoção de privilégio no cadastro público', async () => {
    expect((await request(app).post('/register').send({name: 'Ana', nome: 'Bia', email: 'ana@example.com', senha: 'senha-forte', tipo: 'cliente', cpf: '52998224725'})).status).toBe(400);
    expect((await request(app).post('/register').send({nome: 'Ana', email: 'ana@example.com', senha: 'senha-forte', tipo: 'admin', cpf: '52998224725'})).status).toBe(400);
  });

  it('aceita CPF válido no endpoint de validação e rejeita objetos', async () => {
    expect((await request(app).post('/cpf').send({cpf: '52998224725'})).status).toBe(204);
    expect((await request(app).post('/cpf').send({cpf: {$ne: null}})).status).toBe(400);
  });

  it('rejeita campos desconhecidos, payload vazio e IDs inválidos', async () => {
    expect((await request(app).post('/strict').send({text: 'ok', isAdmin: true})).status).toBe(400);
    expect((await request(app).put('/message/not-an-id').send({mensagem: 'oi'})).status).toBe(400);
  });

  it('aceita texto legítimo contendo apóstrofo e cifrão', async () => {
    expect((await request(app).post('/message').send({mensagem: "O brinquedo do Toby custa $5"})).status).toBe(204);
    expect((await request(app).post('/report').send({descricao: "A coleira da Ana's custa $10", alvoTipo: 'post'})).status).toBe(204);
  });

  it('rejeita atualizações vazias, valores aninhados e operadores em qualquer profundidade', async () => {
    const id = '64b000000000000000000001';
    expect((await request(app).put(`/message/${id}`).send({})).status).toBe(400);
    expect((await request(app).put(`/message/${id}`).send({mensagem: {$set: 'adulterada'}})).status).toBe(400);
    expect((await request(app).put(`/message/${id}`).send({mensagem: "mensagem d'água $5"})).status).toBe(204);
  });
});
