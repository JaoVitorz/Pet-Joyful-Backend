import 'dotenv/config';
import type {Response, NextFunction} from 'express';
import type {AuthRequest} from '../types/index.js';
import verifyToken from './verifyToken.js';

export default async function ensureAdminKey(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const adminKey = req.headers['x-admin-key'];

  if (typeof adminKey === 'string') {
    if (!process.env.ADMIN_KEY || adminKey !== process.env.ADMIN_KEY) {
      res.status(403).json({error: 'Credencial administrativa inválida'});
      return;
    }
    req.isApiKeyValid = true;
    req.userRole = 'admin';
    next();
    return;
  }

  if (!req.headers.authorization) {
    res.status(401).json({error: 'Autenticação administrativa obrigatória'});
    return;
  }
  await verifyToken(req, res, () => {
    if (req.userRole !== 'admin') {
      res.status(403).json({error: 'Acesso restrito a administradores'});
      return;
    }
    next();
  });
}
