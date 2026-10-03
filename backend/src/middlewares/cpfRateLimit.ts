import type {Request, Response, NextFunction} from 'express';

const windowMs = 60_000;
const maxRequests = 20;
const requests = new Map<string, {count: number; resetAt: number}>();

export function cpfRateLimit(req: Request, res: Response, next: NextFunction): void {
  const now = Date.now();
  if (requests.size > 10_000) {
    for (const [key, value] of requests) {
      if (value.resetAt <= now) requests.delete(key);
    }
  }
  const ip = req.ip ?? 'unknown';
  const current = requests.get(ip);
  if (!current || current.resetAt <= now) {
    requests.set(ip, {count: 1, resetAt: now + windowMs});
    next();
    return;
  }
  if (current.count >= maxRequests) {
    res.status(429).json({error: 'Muitas consultas de CPF. Tente novamente em um minuto.'});
    return;
  }
  current.count++;
  next();
}
