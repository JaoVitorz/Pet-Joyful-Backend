import jwt from 'jsonwebtoken';
import type {Response, NextFunction} from 'express';
import type {AuthRequest, JwtPayload} from '../types/index.js';

export default function ensureAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
  const adminKey =
    (req.headers['x-admin-key'] as string) ||
    (req.query['admin_key'] as string);

  if (adminKey && adminKey === process.env.ADMIN_KEY) {
    req.isApiKeyValid = true;
    req.userRole = 'admin';
    return next();
  } else if (adminKey) {
    res.status(403).json({
      error: 'Admin key inválida',
      message:
        'A chave administrativa fornecida não corresponde à chave esperada',
    });
    return;
  }

  const auth = req.headers['authorization'];
  if (!auth) {
    res.status(401).json({error: 'Token ausente'});
    return;
  }

  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({error: 'Formato do token inválido'});
    return;
  }

  const token = parts[1];
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    req.userId = payload.userId ?? payload.id ?? undefined;
    req.userEmail = payload.email ?? undefined;
    req.userRole = payload.tipo ?? payload.role ?? undefined;
    return next();
  } catch {
    res.status(401).json({error: 'Token inválido'});
  }
}
