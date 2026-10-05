import type {Response} from 'express';
import mongoose from 'mongoose';
import {logger} from '../logger/logger.js';
import PostMessage from '../models/postMessageModel.js';
import DenunciaMessage from '../models/denunciaMessageModel.js';
import User from '../models/userModel.js';
import type {AuthRequest} from '../types/index.js';

// Criar mensagem em post
export const createPostMessage = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {mensagem, postId} = req.body as unknown as {
      mensagem: string;
      postId?: string;
    };

    if (!mensagem) {
      res.status(400).json({error: 'Mensagem é obrigatória'});
      return;
    }

    if (!req.userId || !mongoose.isValidObjectId(req.userId)) {
      res.status(401).json({error: 'Usuário não autenticado'});
      return;
    }
    const user = await User.findById(req.userId).select('+deletionRequestedAt');
    if (!user || user.deletionRequestedAt) {
      res.status(401).json({error: 'Usuário não encontrado'});
      return;
    }

    const msg = new PostMessage({
      userId: user._id,
      nome: user.nome,
      email: user.email,
      mensagem,
      postId,
    });
    await msg.save();
    res.status(201).json({message: 'Mensagem salva com sucesso', data: msg});
  } catch (error) {
    logger.error('Erro em createPostMessage:', error);
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
    logger.error('Erro em getPostMessages:', error);
    res.status(500).json({error: (error as Error).message});
  }
};

// Criar denúncia
export const createDenuncia = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {descricao, alvoId, alvoTipo} = req.body as unknown as {
      descricao: string;
      alvoId?: string;
      alvoTipo?: string;
    };

    if (!descricao) {
      res.status(400).json({error: 'Descrição é obrigatória'});
      return;
    }

    if (!req.userId || !mongoose.isValidObjectId(req.userId)) {
      res.status(401).json({error: 'Usuário não autenticado'});
      return;
    }
    const user = await User.findById(req.userId).select('+deletionRequestedAt');
    if (!user || user.deletionRequestedAt) {
      res.status(401).json({error: 'Usuário não encontrado'});
      return;
    }

    const den = new DenunciaMessage({
      userId: user._id,
      nome: user.nome,
      email: user.email,
      descricao,
      alvoId,
      alvoTipo,
    });
    await den.save();
    res
      .status(201)
      .json({message: 'Denúncia registrada com sucesso', data: den});
  } catch (error) {
    logger.error('Erro em createDenuncia:', error);
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
    logger.error('Erro em getDenuncias:', error);
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
    logger.error('Erro em updatePostMessage:', error);
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
    logger.error('Erro em deletePostMessage:', error);
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
    logger.error('Erro em updateDenuncia:', error);
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
    logger.error('Erro em deleteDenuncia:', error);
    res.status(500).json({error: (error as Error).message});
  }
};
