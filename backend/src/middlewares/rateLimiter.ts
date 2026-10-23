import {ipKeyGenerator, MemoryStore, rateLimit} from 'express-rate-limit';
import type {AuthRequest} from '../types/index.js';

const loginStore = new MemoryStore();
const apiStore = new MemoryStore();
const directChatStore = new MemoryStore();

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
  standardHeaders: "draft-8",
  legacyHeaders: false,

  message: {
    success: false,
    message: "Limite de requisições excedido. Tente novamente em instantes.",
  },

  statusCode: 429,
});

// O chat tem várias chamadas por sessão e precisa de um contador próprio por conta,
// sem consumir o limite global de outros endpoints compartilhado pelo mesmo IP.
export const directChatLimiter = rateLimit({
  store: directChatStore,
  windowMs: 60 * 1000,
  limit: 120,
  keyGenerator: req => {
    const userId = (req as AuthRequest).userId;
    return userId ?? ipKeyGenerator(req.ip ?? '');
  },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Muitas ações no chat. Aguarde um instante e tente novamente.',
  },
  statusCode: 429,
});

export async function resetRateLimiterStores(): Promise<void> {
  await Promise.all([loginStore.resetAll(), apiStore.resetAll(), directChatStore.resetAll()]);
}
