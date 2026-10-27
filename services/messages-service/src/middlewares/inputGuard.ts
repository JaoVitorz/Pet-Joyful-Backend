import type {NextFunction, Request, Response} from 'express';
import fs from 'node:fs/promises';

function unsafe(value: unknown, depth = 0): boolean {
  if (depth > 12) return true;
  if (Array.isArray(value)) return value.some(item => unsafe(item, depth + 1));
  if (!value || typeof value !== 'object') return false;
  return Object.entries(value).some(([key, child]) => /[$.]/.test(key) ||
    ['__proto__', 'constructor', 'prototype'].includes(key) || unsafe(child, depth + 1));
}

export default async function inputGuard(req: Request, res: Response, next: NextFunction): Promise<void> {
  if ([req.body, req.query, req.params].some(unsafe)) {
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => undefined);
    res.status(400).json({error: 'Entrada inválida'}); return;
  }
  next();
}

export async function validatePostBody(req: Request, res: Response, next: NextFunction): Promise<void> {
  const body = req.body as unknown;
  if (!body || typeof body !== 'object' || Array.isArray(body)) { await reject(req, res, 'Dados inválidos'); return; }
  const data = body as Record<string, unknown>;
  const title = data.titulo;
  const description = data.descricao;
  if (Object.keys(data).some(key => !['titulo', 'descricao'].includes(key)) ||
    typeof title !== 'string' || title.trim().length < 1 || title.length > 200 ||
    (description !== undefined && (typeof description !== 'string' || description.length > 5000))) {
    await reject(req, res, 'Dados inválidos'); return;
  }
  data.titulo = title.trim();
  next();
}

async function reject(req: Request, res: Response, message: string): Promise<void> {
  if (req.file?.path) await fs.unlink(req.file.path).catch(() => undefined);
  res.status(400).json({error: message});
}
