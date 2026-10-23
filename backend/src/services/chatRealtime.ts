import type {Server as HttpServer} from 'node:http';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {Server as SocketServer} from 'socket.io';
import {allowedOrigins} from '../config/allowedOrigins.js';
import User from '../models/userModel.js';
import type {JwtPayload} from '../types/index.js';
import {accessTokenMatchesUser} from './mfaService.js';

type DirectMessageEvent = {
  conversationId: string;
  message: {
    id: string;
    senderId: string;
    text: string;
    createdAt: Date | undefined;
  };
};

let io: SocketServer | null = null;

function extractToken(value: unknown): string | null {
  if (typeof value === 'string') {
    const authorizationToken = value.startsWith('Bearer ') ? value.slice(7) : value;
    return authorizationToken.trim() || null;
  }
  return null;
}

export function initializeChatRealtime(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = extractToken(socket.handshake.auth?.token)
        ?? extractToken(socket.handshake.headers.authorization);
      if (!token || !process.env.JWT_SECRET) {
        next(new Error('Autenticação necessária para conectar ao chat'));
        return;
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload & {exp?: number};
      const userId = payload.userId ?? payload.id;
      if (!userId || !mongoose.isValidObjectId(userId)) {
        next(new Error('Token inválido'));
        return;
      }

      const user = await User.findById(userId).select('+deletionRequestedAt');
      if (!user || user.deletionRequestedAt || !accessTokenMatchesUser(payload, user)) {
        next(new Error('Conta ou sessão indisponível'));
        return;
      }

      socket.data.userId = userId;
      socket.data.tokenExpiresAt = payload.exp ? payload.exp * 1000 : null;
      next();
    } catch {
      next(new Error('Token inválido ou expirado'));
    }
  });

  io.on('connection', socket => {
    const userId = socket.data.userId as string;
    socket.join(`user:${userId}`);

    const expiresAt = socket.data.tokenExpiresAt as number | null;
    const expiryTimer = expiresAt
      ? setTimeout(() => socket.disconnect(true), Math.max(0, expiresAt - Date.now()))
      : undefined;
    expiryTimer?.unref();
    socket.on('disconnect', () => {
      if (expiryTimer) clearTimeout(expiryTimer);
    });
  });

  return io;
}

export function emitDirectMessage(
  participantIds: Array<string | mongoose.Types.ObjectId>,
  event: DirectMessageEvent,
): void {
  if (!io) return;

  const rooms = participantIds.map(participantId => `user:${String(participantId)}`);
  io.to(rooms).emit('direct-message:new', event);
}
