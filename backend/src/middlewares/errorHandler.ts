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
    method: req.method,
    route: req.path,
  });

  const status = err.status === 400 || err.status === 413 ? err.status : 500;
  res.status(status).json({
    success: false,
    message: 'Erro interno no servidor',
  });
}
