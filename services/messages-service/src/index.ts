import express from 'express';
import dotenv from 'dotenv';

import connectDB from './database/connection.js';
import messagesRoutes from './routes/messagesRoutes.js';
import postsRoutes from './routes/postsRoutes.js';
import Post from './models/postModel.js';
import {uploadsDir} from './uploads.js';

dotenv.config();

const app = express();
app.use(express.json());

// Arquivos não referenciados por posts ativos deixam de ser acessíveis.
app.get('/uploads/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    if (!/^[A-Za-z0-9_.-]+$/.test(filename)) {
      res.sendStatus(404);
      return;
    }
    const post = await Post.exists({imageUrl: `/uploads/${filename}`});
    if (!post) {
      res.sendStatus(404);
      return;
    }
    res.sendFile(filename, {root: uploadsDir});
  } catch {
    res.sendStatus(503);
  }
});

app.get('/health', (_req, res) => res.json({ service: 'messages', status: 'ok' }));

// connect to Mongo
connectDB();

// mount routes
app.use('/api/messages', messagesRoutes);
app.use('/api/posts', postsRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`messages-service listening on ${PORT}`));

export {};
