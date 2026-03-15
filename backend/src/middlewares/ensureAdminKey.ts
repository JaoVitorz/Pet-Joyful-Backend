import 'dotenv/config';
import type {Response, NextFunction} from 'express';
import type {AuthRequest} from '../types/index.js';

export default function ensureAdminKey(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const adminKey =
    (req.headers['x-admin-key'] as string) ||
    (req.query['admin_key'] as string);

  if (!adminKey) {
    res.status(401).json({error: 'Admin key ausente'});
    return;
  }

  if (adminKey !== process.env.ADMIN_KEY) {
    res.status(403).json({error: 'Admin key inválida'});
    return;
  }

  req.isApiKeyValid = true;
  req.userRole = 'admin';
  return next();
}
