import type {Response, NextFunction} from 'express';
import type {AuthRequest} from '../types/index.js';
import verifyToken from './verifyToken.js';

export default async function ensureAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  await verifyToken(req, res, next);
}
