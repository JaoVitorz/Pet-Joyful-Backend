import type {NextFunction, Request, Response} from 'express';

const forbiddenKey = /[$.]/;

function containsUnsafeValue(value: unknown, depth = 0): boolean {
  if (depth > 12) return true;
  if (Array.isArray(value)) return value.some(item => containsUnsafeValue(item, depth + 1));
  if (!value || typeof value !== 'object') return false;
  return Object.entries(value).some(([key, child]) =>
    forbiddenKey.test(key) || ['__proto__', 'prototype', 'constructor'].includes(key) ||
    containsUnsafeValue(child, depth + 1));
}

export default function inputGuard(req: Request, res: Response, next: NextFunction): void {
  if ([req.body, req.query, req.params].some(containsUnsafeValue)) {
    res.status(400).json({error: 'Entrada inválida'});
    return;
  }
  next();
}

export function validateBodyFields(allowed: string[], required: string[] = [], scalarFields = allowed) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const body: unknown = req.body;
    if (allowed.length === 0 && (body === undefined || (typeof body === 'object' && body !== null && !Array.isArray(body) && Object.keys(body).length === 0))) {
      next();
      return;
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({error: 'Corpo da requisição inválido'});
      return;
    }
    const record = body as Record<string, unknown>;
    if (Object.keys(record).some(key => !allowed.includes(key)) ||
      required.some(key => !Object.hasOwn(record, key)) ||
      scalarFields.some(key => Object.hasOwn(record, key) && typeof record[key] !== 'string')) {
      res.status(400).json({error: 'Campos inválidos'});
      return;
    }
    next();
  };
}

export function validateObjectIdParam(param = 'id') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!/^[a-f\d]{24}$/i.test(String(req.params[param] ?? ''))) {
      res.status(400).json({error: 'ID inválido'});
      return;
    }
    next();
  };
}
