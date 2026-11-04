import {MemoryStore, rateLimit} from 'express-rate-limit';

const loginStore = new MemoryStore();
const apiStore = new MemoryStore();

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

export async function resetRateLimiterStores(): Promise<void> {
  await Promise.all([loginStore.resetAll(), apiStore.resetAll()]);
}
