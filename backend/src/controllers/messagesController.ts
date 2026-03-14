import type {Response} from 'express';
import PostMessage from '../models/postMessageModel.js';
import DenunciaMessage from '../models/denunciaMessageModel.js';
import type {AuthRequest} from '../types/index.js';

// Criar mensagem em post
export const createPostMessage = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {nome, email, mensagem, postId} = req.body as {
      nome?: string;
      email: string;
      mensagem: string;
      postId?: string;
    };

    if (!email || !mensagem) {
      res.status(400).json({error: 'Email e mensagem são obrigatórios'});
      return;
    }

    const msg = new PostMessage({nome, email, mensagem, postId});
    await msg.save();
    res.status(201).json({message: 'Mensagem salva com sucesso', data: msg});
  } catch (error) {
    res.status(500).json({error: (error as Error).message});
  }
};

// Listar mensagens de posts
export const getPostMessages = async (
  _req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const messages = await PostMessage.find().sort({createdAt: -1});
    res.json(messages);
  } catch (error) {
    res.status(500).json({error: (error as Error).message});
  }
};

// Criar denúncia
export const createDenuncia = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {nome, email, descricao, alvoId, alvoTipo} = req.body as {
      nome?: string;
      email: string;
      descricao: string;
      alvoId?: string;
      alvoTipo?: string;
    };

    if (!email || !descricao) {
      res.status(400).json({error: 'Email e descrição são obrigatórios'});
      return;
    }

    const den = new DenunciaMessage({nome, email, descricao, alvoId, alvoTipo});
    await den.save();
    res
      .status(201)
      .json({message: 'Denúncia registrada com sucesso', data: den});
  } catch (error) {
    res.status(500).json({error: (error as Error).message});
  }
};

// Listar denúncias
export const getDenuncias = async (
  _req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const items = await DenunciaMessage.find().sort({createdAt: -1});
    res.json(items);
  } catch (error) {
    res.status(500).json({error: (error as Error).message});
  }
};

// Atualizar mensagem (admin)
export const updatePostMessage = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.isApiKeyValid && req.userRole !== 'admin') {
      res.status(403).json({error: 'Não autorizado'});
      return;
    }

    const {id} = req.params;
    const {nome, email, mensagem, postId} = req.body as {
      nome?: string;
      email?: string;
      mensagem?: string;
      postId?: string;
    };

    const updated = await PostMessage.findByIdAndUpdate(
      id,
      {nome, email, mensagem, postId},
      {new: true},
    );

    if (!updated) {
      res.status(404).json({error: 'Mensagem não encontrada'});
      return;
    }

    res.json({message: 'Mensagem atualizada', data: updated});
  } catch (error) {
    res.status(500).json({error: (error as Error).message});
  }
};

// Deletar mensagem (admin)
export const deletePostMessage = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.isApiKeyValid && req.userRole !== 'admin') {
      res.status(403).json({error: 'Não autorizado'});
      return;
    }

    const removed = await PostMessage.findByIdAndDelete(req.params.id);
    if (!removed) {
      res.status(404).json({error: 'Mensagem não encontrada'});
      return;
    }

    res.json({message: 'Mensagem deletada'});
  } catch (error) {
    res.status(500).json({error: (error as Error).message});
  }
};

// Atualizar denúncia (admin)
export const updateDenuncia = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.isApiKeyValid && req.userRole !== 'admin') {
      res.status(403).json({error: 'Não autorizado'});
      return;
    }

    const {id} = req.params;
    const {nome, email, descricao, alvoId, alvoTipo} = req.body as {
      nome?: string;
      email?: string;
      descricao?: string;
      alvoId?: string;
      alvoTipo?: string;
    };

    const updated = await DenunciaMessage.findByIdAndUpdate(
      id,
      {nome, email, descricao, alvoId, alvoTipo},
      {new: true},
    );

    if (!updated) {
      res.status(404).json({error: 'Denúncia não encontrada'});
      return;
    }

    res.json({message: 'Denúncia atualizada', data: updated});
  } catch (error) {
    res.status(500).json({error: (error as Error).message});
  }
};

// Deletar denúncia (admin)
export const deleteDenuncia = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.isApiKeyValid && req.userRole !== 'admin') {
      res.status(403).json({error: 'Não autorizado'});
      return;
    }

    const removed = await DenunciaMessage.findByIdAndDelete(req.params.id);
    if (!removed) {
      res.status(404).json({error: 'Denúncia não encontrada'});
      return;
    }

    res.json({message: 'Denúncia deletada'});
  } catch (error) {
    res.status(500).json({error: (error as Error).message});
  }
};
