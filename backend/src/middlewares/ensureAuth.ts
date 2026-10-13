import type {Response, NextFunction} from 'express';
import type {AuthRequest} from '../types/index.js';
import verifyToken from './verifyToken.js';

export default async function ensureAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const adminKey =
    (req.headers['x-admin-key'] as string) ||
    (req.query['admin_key'] as string);
  if (adminKey && adminKey === process.env.ADMIN_KEY) {
    req.isApiKeyValid = true;
    req.userRole = 'admin';
    next();
    return;
  }
  if (adminKey) {
    res.status(403).json({error: 'Admin key inválida'});
    return;
  }
  await verifyToken(req, res, next);
}
