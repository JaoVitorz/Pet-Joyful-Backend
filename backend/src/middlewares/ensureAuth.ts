import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import type {Response, NextFunction} from 'express';
import type {AuthRequest, JwtPayload} from '../types/index.js';
import User from '../models/userModel.js';

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
  let payload: JwtPayload;
  try {
    payload = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
  } catch {
    res.status(401).json({error: 'Token inválido'});
    return;
  }

  req.userId = payload.userId ?? payload.id ?? undefined;
  req.userEmail = payload.email ?? undefined;
  req.userRole = payload.tipo ?? payload.role ?? undefined;
  if (!req.userId || !mongoose.isValidObjectId(req.userId)) {
    res.status(401).json({error: 'Token inválido'});
    return;
  }

  try {
    const user = await User.findById(req.userId).select('+deletionRequestedAt');
    if (!user || user.deletionRequestedAt) {
      res.status(401).json({error: 'Conta indisponível'});
      return;
    }
    return next();
  } catch {
    res.status(503).json({error: 'Não foi possível validar a conta'});
  }
}
