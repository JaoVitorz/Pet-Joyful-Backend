import express from 'express';
import mongoose from 'mongoose';
import './config/mongooseSecurity.js';
import messagesRoutes from './routes/messagesRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import Post from './models/postModel.js';
import {uploadsDir} from './uploads.js';
import inputGuard from './middlewares/inputGuard.js';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use(inputGuard);
  app.get('/uploads/:filename', async (req, res) => {
    try {
      const filename = req.params.filename;
      if (!/^[A-Za-z0-9_.-]+$/.test(filename)) { res.sendStatus(404); return; }
      const post = await Post.exists({imageUrl: `/uploads/${filename}`});
      if (!post) { res.sendStatus(404); return; }
      res.sendFile(filename, {root: uploadsDir});
    } catch {
      res.sendStatus(503);
    }
  });
  app.get('/health', (_req, res) => res.json({service: 'messages', status: 'ok'}));
  app.get('/health/live', (_req, res) => res.json({service: 'messages', status: 'ok'}));
  app.get('/health/ready', (_req, res) => {
    const ready = mongoose.connection.readyState === 1;
    res.status(ready ? 200 : 503).json({service: 'messages', status: ready ? 'ready' : 'unavailable'});
  });
  app.use('/api/messages', messagesRoutes);
  app.use('/api/posts', postsRoutes);
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const uploadError = error as {code?: string};
    if (['LIMIT_FILE_SIZE', 'LIMIT_UNEXPECTED_FILE', 'INVALID_FILE_TYPE'].includes(String(uploadError.code))) {
      res.status(400).json({error: 'Arquivo inválido ou muito grande'});
      return;
    }
    res.status(500).json({error: 'Erro interno no serviço de mensagens'});
  });
  return app;
}

export default createApp();
