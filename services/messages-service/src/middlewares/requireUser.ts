import type {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export interface AuthenticatedRequest extends Request {
  userId?: string;
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
    const userId = payload.userId ?? payload.id;
    if (typeof userId !== 'string' || !mongoose.isValidObjectId(userId)) {
      throw new Error('Usuário inválido');
    }
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({error: 'Token inválido'});
  }
}

export async function requireActiveUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (!req.userId) {
      res.status(401).json({error: 'Usuário não autenticado'});
      return;
    }
    const user = await mongoose.connection.collection('users').findOne({
      _id: new mongoose.Types.ObjectId(req.userId),
      deletionRequestedAt: {$exists: false},
    }, {projection: {_id: 1}});
    if (!user) {
      res.status(401).json({error: 'Conta indisponível'});
      return;
    }
    next();
  } catch {
    res.status(503).json({error: 'Não foi possível validar a conta'});
  }
}
