import type {NextFunction, Request, Response} from 'express';
import {normalizeCpf} from '../services/cpfService.js';
import {validateBodyFields} from './inputGuard.js';

type Rule = 'login' | 'register' | 'profile';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthInput(rule: Rule) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      res.status(400).json({error: 'Entrada inválida'}); return;
    }
    const body = req.body as Record<string, unknown>;
    if (body.password !== undefined && body.senha !== undefined) {
      res.status(400).json({error: 'Alias de senha conflitante'}); return;
    }
    const allowed = rule === 'register'
      ? ['nome', 'name', 'email', 'senha', 'password', 'tipo', 'type', 'cpf']
      : rule === 'profile'
        ? ['nome', 'name', 'email', 'senha', 'password', 'tipo', 'type']
        : ['email', 'senha', 'password'];
    if (Object.keys(body).some(key => !allowed.includes(key))) {
      res.status(400).json({error: 'Campos inválidos'}); return;
    }
    const alias = (canonical: string, alternate: string): boolean => {
      if (body[canonical] !== undefined && body[alternate] !== undefined) return false;
      const value = body[canonical] ?? body[alternate];
      if (value !== undefined && typeof value !== 'string') return false;
      if (alternate in body) { body[canonical] = value; delete body[alternate]; }
      return true;
    };
    if (!alias('nome', 'name') || !alias('senha', 'password') || !alias('tipo', 'type')) {
      res.status(400).json({error: 'Campos duplicados ou inválidos'}); return;
    }
    const email = body.email;
    const senha = body.senha;
    const nome = body.nome;
    const tipo = body.tipo;
    const cpf = body.cpf;
    const validEmail = typeof email === 'string' && email.length <= 254 && emailPattern.test(email);
    const validPassword = typeof senha === 'string' && senha.length > 0 &&
      (rule === 'login' || (senha.length >= 8 && Buffer.byteLength(senha, 'utf8') <= 72));
    if ((rule === 'login' && (!validEmail || !validPassword)) ||
      (rule === 'register' && (!validEmail || !validPassword || typeof nome !== 'string' ||
        nome.trim().length < 1 || nome.trim().length > 120 ||
        !['adotante', 'cliente'].includes(String(tipo)) || typeof cpf !== 'string' || !normalizeCpf(cpf)))) {
      res.status(400).json({error: 'Dados inválidos'}); return;
    }
    if (rule === 'profile') {
      const fields = ['nome', 'email', 'senha'];
      if (!fields.some(key => body[key] !== undefined) && body.tipo === undefined) {
        res.status(400).json({error: 'Dados inválidos'}); return;
      }
      if (nome !== undefined && (typeof nome !== 'string' || nome.trim().length < 1 || nome.trim().length > 120)) {
        res.status(400).json({error: 'Nome inválido'}); return;
      }
      if (email !== undefined && !validEmail) { res.status(400).json({error: 'Email inválido'}); return; }
      if (senha !== undefined && !validPassword) { res.status(400).json({error: 'Senha inválida'}); return; }
      if (tipo !== undefined && !['adotante', 'cliente'].includes(String(tipo))) { res.status(400).json({error: 'Tipo inválido'}); return; }
    }
    if (rule === 'register' && typeof nome === 'string') body.nome = nome.trim();
    next();
  };
}

export function validateCpfBody(req: Request, res: Response, next: NextFunction): void {
  const body: unknown = req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body) ||
    Object.keys(body).some(key => key !== 'cpf') || typeof (body as Record<string, unknown>).cpf !== 'string' ||
    !normalizeCpf((body as Record<string, unknown>).cpf)) {
    res.status(400).json({valido: false, error: 'Informe um CPF válido'}); return;
  }
  next();
}

export function validateMfaPayload(allowed: string[], required: string[] = [], oneOf: string[][] = []) {
  const base = validateBodyFields(allowed, required);
  return (req: Request, res: Response, next: NextFunction): void => {
    let valid = false;
    base(req, res, () => { valid = true; });
    if (!valid) return;
    const body = req.body as Record<string, unknown>;
    if (body.password !== undefined && body.senha !== undefined) {
      res.status(400).json({error: 'Alias de senha conflitante'}); return;
    }
    if (oneOf.some(group => group.filter(field => typeof body[field] === 'string' && body[field]).length !== 1)) {
      res.status(400).json({error: 'Dados de autenticação inválidos'}); return;
    }
    for (const field of ['password', 'senha']) {
      if (body[field] !== undefined && Buffer.byteLength(String(body[field]), 'utf8') > 72) {
        res.status(400).json({error: 'Dados de autenticação inválidos'}); return;
      }
    }
    if (body.code !== undefined && (typeof body.code !== 'string' || !/^\d{6}$/.test(body.code))) {
      res.status(400).json({error: 'Código MFA inválido'}); return;
    }
    if (body.recoveryCode !== undefined && (typeof body.recoveryCode !== 'string' || !/^[A-Za-z0-9_-]{22}$/.test(body.recoveryCode))) {
      res.status(400).json({error: 'Código de recuperação inválido'}); return;
    }
    if (body.challengeToken !== undefined && (typeof body.challengeToken !== 'string' || body.challengeToken.length > 2048)) {
      res.status(400).json({error: 'Desafio inválido'}); return;
    }
    if (body.senha !== undefined) { body.password = body.senha; delete body.senha; }
    next();
  };
}
