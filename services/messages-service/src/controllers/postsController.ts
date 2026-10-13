import type {Response} from 'express';
import fs from 'node:fs/promises';
import path from 'node:path';
import Post from '../models/postModel.js';
import type {AuthenticatedRequest} from '../middlewares/requireUser.js';
import {uploadsDir} from '../uploads.js';

export const createPost = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    const { titulo, descricao } = req.body as { titulo?: string; descricao?: string };
    if (!titulo) return res.status(400).json({ error: 'Título é obrigatório' });

    const file = req.file;
    const imageUrl = file ? `/uploads/${file.filename}` : null;

    const post = new Post({ userId: req.userId, titulo, descricao, imageUrl, publishedAt: new Date() });
    await post.save();

    return res.status(201).json({ message: 'Post criado com sucesso', post });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ error: message });
  }
};

export default { createPost };

export const removeUserMedia = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({error: 'Usuário não autenticado'});
      return;
    }
    const posts = await Post.find({userId: req.userId}).select('imageUrl').lean();
    let removed = 0;
    for (const post of posts) {
      if (!post.imageUrl) continue;
      const match = /^\/uploads\/([A-Za-z0-9_.-]+)$/.exec(post.imageUrl);
      if (!match || match[1] === '.' || match[1] === '..') {
        res.status(409).json({error: 'Mídia com localização não gerenciada'});
        return;
      }
      try {
        await fs.unlink(path.join(uploadsDir, match[1]));
        removed += 1;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
    }
    res.json({removed});
  } catch {
    res.status(503).json({error: 'Não foi possível remover a mídia'});
  }
};
