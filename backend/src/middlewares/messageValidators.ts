import type {NextFunction, Request, Response} from 'express';
import {validateBodyFields, validateObjectIdParam} from './inputGuard.js';

function textBody(allowed: string[], required: string[], max: Record<string, number>, enumFields: Record<string, string[]> = {}) {
  const base = validateBodyFields(allowed, required);
  return (req: Request, res: Response, next: NextFunction): void => {
    let continued = false;
    base(req, res, () => { continued = true; });
    if (!continued) return;
    const body = req.body as Record<string, unknown>;
    if (Object.entries(max).some(([key, limit]) => typeof body[key] === 'string' && (body[key] as string).length > limit) ||
      Object.entries(enumFields).some(([key, values]) => body[key] !== undefined && !values.includes(String(body[key]))) ||
      Object.keys(body).length === 0) {
      res.status(400).json({error: 'Dados inválidos'}); return;
    }
    next();
  };
}

export const validateCreatePostMessage = textBody(['mensagem', 'postId'], ['mensagem'], {mensagem: 5000, postId: 200});
export const validateCreateReport = textBody(['descricao', 'alvoId', 'alvoTipo'], ['descricao'], {descricao: 5000, alvoId: 200}, {alvoTipo: ['post', 'usuario', 'outro']});
export const validateUpdatePostMessage = textBody(['nome', 'email', 'mensagem', 'postId'], [], {nome: 120, email: 254, mensagem: 5000, postId: 200});
export const validateUpdateReport = textBody(['nome', 'email', 'descricao', 'alvoId', 'alvoTipo'], [], {nome: 120, email: 254, descricao: 5000, alvoId: 200}, {alvoTipo: ['post', 'usuario', 'outro']});
export {validateObjectIdParam};
