import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import type {Response, NextFunction} from 'express';
import type {AuthRequest, JwtPayload} from '../types/index.js';
import User from '../models/userModel.js';
import {accessTokenMatchesUser} from '../services/mfaService.js';

async function validateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
  allowPendingDeletion: boolean,
): Promise<void> {
  const [scheme, token, extra] = req.headers.authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token || extra) {
    res.status(401).json({error: 'Token ausente ou inválido'});
    return;
  }
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  } catch {
    res.status(401).json({error: 'Token inválido'});
    return;
  }
  const userId = payload.userId ?? payload.id;
  if (!userId || !mongoose.isValidObjectId(userId)) {
    res.status(401).json({error: 'Token inválido'});
    return;
  }
  try {
    const user = await User.findById(userId).select('+deletionRequestedAt');
    if (!user || (!allowPendingDeletion && user.deletionRequestedAt) ||
      !accessTokenMatchesUser(payload, user)) {
      res.status(401).json({error: 'Conta ou sessão indisponível'});
      return;
    }
    req.userId = userId;
    req.userEmail = user.email;
    req.userRole = user.tipo;
    next();
  } catch {
    res.status(503).json({error: 'Não foi possível validar a conta'});
  }
}

export default async function verifyToken(req: AuthRequest, res: Response,
  next: NextFunction): Promise<void> {
  await validateToken(req, res, next, false);
}

export async function verifyDeletionToken(req: AuthRequest, res: Response,
  next: NextFunction): Promise<void> {
  await validateToken(req, res, next, true);
}
