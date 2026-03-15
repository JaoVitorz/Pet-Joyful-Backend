import type {Request, Response} from 'express';
import Post from '../models/postModel.js';

export const createPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { titulo, descricao } = req.body as { titulo?: string; descricao?: string };
    if (!titulo) return res.status(400).json({ error: 'Título é obrigatório' });

  const file = (req as any).file as any | undefined;
  const imageUrl = file ? `/uploads/${file.filename}` : null;

    const post = new Post({ titulo, descricao, imageUrl, publishedAt: new Date() });
    await post.save();

    return res.status(201).json({ message: 'Post criado com sucesso', post });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message ?? String(error) });
  }
};

export default { createPost };
