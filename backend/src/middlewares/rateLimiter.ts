import {ipKeyGenerator, MemoryStore, rateLimit} from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import type {Request} from 'express';
import type {JwtPayload} from '../types/index.js';

const loginStore = new MemoryStore();
const apiStore = new MemoryStore();

function apiRateLimitKey(req: Request): string {
  const [scheme, token, extra] = req.headers.authorization?.split(' ') ?? [];
  const secret = process.env.JWT_SECRET;
  if (scheme === 'Bearer' && token && !extra && secret) {
    try {
      const payload = jwt.verify(token, secret) as JwtPayload;
      const userId = payload.userId ?? payload.id;
      if (typeof userId === 'string' && userId) return `user:${userId}`;
    } catch {
      // Invalid or expired tokens fall back to the client IP.
    }
  }
  return ipKeyGenerator(req.ip ?? '');
}

export const loginLimiter = rateLimit({
  store: loginStore,
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 5, // 5 requisições por IP
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
  },

  statusCode: 429,
});

export const apiLimiter = rateLimit({
  store: apiStore,
  windowMs: 60 * 1000, // 1 minuto
  limit: 30, // 30 requisições por IP
  // Valid signed-in users have independent quotas, even when sharing an IP.
  // Public/invalid-token requests retain an IP-based quota.
  keyGenerator: apiRateLimitKey,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Limite de requisições excedido. Tente novamente em instantes.",
  },

  statusCode: 429,
});

export async function resetRateLimiterStores(): Promise<void> {
  await Promise.all([loginStore.resetAll(), apiStore.resetAll()]);
}
