import type { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/logger.js';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  const sensitive = new Set(['cpf', 'dataNascimento', 'senha', 'password', 'authorization', 'x-api-key']);
  const redact = (data: Record<string, unknown>) => Object.fromEntries(
    Object.entries(data).map(([key, value]) => [key, sensitive.has(key) ? '[REDACTED]' : value]),
  );

  logger.info('Requisição recebida', {
    method: req.method,
    route: req.originalUrl.split('?')[0],
    path: req.path,
    params: req.params,
    query: req.query.token ? {...req.query, token: '[REDACTED]'} : req.query,
    body: req.body && typeof req.body === 'object' ? redact(req.body as Record<string, unknown>) : undefined,
    headers: redact(req.headers as Record<string, unknown>),
    origin: req.get('origin'),
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });


  
  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    logger.info('Resposta enviada', {
      method: req.method,
      route: req.originalUrl.split('?')[0],
      statusCode: res.statusCode,
      durationMs,
    });
  });

  next();
}
