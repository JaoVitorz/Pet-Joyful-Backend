import type {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  authVersion?: number;
  tokenUse?: string;
  mfaVerified?: boolean;
}

export default function requireUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const [scheme, token, extra] = req.headers.authorization?.split(' ') ?? [];
  if (scheme !== 'Bearer' || !token || extra) {
    res.status(401).json({error: 'Token ausente ou inválido'});
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    if (typeof payload === 'string') throw new Error('Payload inválido');
    if (payload.tokenUse !== undefined && payload.tokenUse !== 'access') {
      throw new Error('Token de acesso inválido');
    }
    const userId = payload.userId ?? payload.id;
    if (typeof userId !== 'string' || !mongoose.isValidObjectId(userId)) {
      throw new Error('Usuário inválido');
    }
    req.userId = userId;
    req.authVersion = typeof payload.authVersion === 'number' ? payload.authVersion : undefined;
    req.tokenUse = payload.tokenUse;
    req.mfaVerified = payload.mfa === true;
    next();
  } catch {
    res.status(401).json({error: 'Token inválido'});
  }
}

async function validateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
  allowPendingDeletion: boolean,
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({error: 'Usuário não autenticado'});
      return;
    }
    const user = await mongoose.connection.collection('users').findOne({
      _id: new mongoose.Types.ObjectId(req.userId),
      ...(allowPendingDeletion ? {} : {deletionRequestedAt: {$exists: false}}),
    }, {projection: {_id: 1, authVersion: 1, mfaEnabled: 1}});
    const version = typeof user?.authVersion === 'number' ? user.authVersion : 0;
    const validSession = req.tokenUse === 'access' ?
      req.authVersion === version && (!user?.mfaEnabled || req.mfaVerified) :
      version === 0 && !user?.mfaEnabled;
    if (!user || !validSession) {
      res.status(401).json({error: 'Conta indisponível'});
      return;
    }
    next();
  } catch {
    res.status(503).json({error: 'Não foi possível validar a conta'});
  }
}

export async function requireActiveUser(req: AuthenticatedRequest, res: Response,
  next: NextFunction): Promise<void> {
  await validateUser(req, res, next, false);
}

export async function requireDeletionUser(req: AuthenticatedRequest, res: Response,
  next: NextFunction): Promise<void> {
  await validateUser(req, res, next, true);
}
