import type {Request, Response, NextFunction} from 'express';

export interface AppError extends Error {
  status?: number;
}

export default function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  console.error(err);
  const status = err.status ?? 500;
  res.status(status).json({error: err.message || 'Internal server error'});
}
