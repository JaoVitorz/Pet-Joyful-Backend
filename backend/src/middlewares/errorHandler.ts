import type { Request, Response, NextFunction } from 'express';
import { logger } from '../logger/logger.js';

export interface AppError extends Error {
  status?: number;
}

export default function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  void next;

  logger.error('Exceção não tratada capturada pelo middleware global', {
    message: err.message,
    stack: err.stack,
    method: req.method,
    route: req.originalUrl,
    params: req.params,
    query: req.query,
    body: req.body,
  });

  const status = err.status ?? 500;
  res.status(status).json({
    success: false,
    message: 'Erro interno no servidor',
    detail: err.message,
  });
}