import jwt from 'jsonwebtoken';
import type {Response, NextFunction} from 'express';
import type {AuthRequest, JwtPayload} from '../types/index.js';

export default function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void {
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
    req.userId = payload.id ?? payload.userId;
    next();
  } catch {
    res.status(401).json({error: 'Token inválido'});
  }
}
