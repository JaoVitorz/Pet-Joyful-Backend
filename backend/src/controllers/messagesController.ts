import type {Response} from 'express';
import mongoose from 'mongoose';
import {logger} from '../logger/logger.js';
import PostMessage from '../models/postMessageModel.js';
import DenunciaMessage from '../models/denunciaMessageModel.js';
import User from '../models/userModel.js';
import type {AuthRequest} from '../types/index.js';
import {recordAuditEvent} from '../services/auditLogService.js';

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
    logger.error('Falha interna ao criar mensagem');
    res.status(500).json({error: 'Não foi possível processar a mensagem'});
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
    logger.error('Falha interna ao listar mensagens');
    res.status(500).json({error: 'Não foi possível listar as mensagens'});
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
    logger.error('Falha interna ao criar denúncia');
    res.status(500).json({error: 'Não foi possível registrar a denúncia'});
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
    logger.error('Falha interna ao listar denúncias');
    res.status(500).json({error: 'Não foi possível listar as denúncias'});
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

    const update = Object.fromEntries(Object.entries({nome, email, mensagem, postId}).filter(([, value]) => value !== undefined));
    const updated = await PostMessage.findByIdAndUpdate(id, {$set: update}, {new: true, runValidators: true});

    if (!updated) {
      res.status(404).json({error: 'Mensagem não encontrada'});
      return;
    }

    await recordAuditEvent('post_message.updated', req.userId, String(updated._id), req.userRole ?? (req.isApiKeyValid ? 'admin' : 'unknown'));

    res.json({message: 'Mensagem atualizada', data: updated});
  } catch (error) {
    logger.error('Falha interna ao atualizar mensagem');
    res.status(500).json({error: 'Não foi possível atualizar a mensagem'});
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

    await recordAuditEvent('post_message.deleted', req.userId, String(removed._id), req.userRole ?? (req.isApiKeyValid ? 'admin' : 'unknown'));

    res.json({message: 'Mensagem deletada'});
  } catch (error) {
    logger.error('Falha interna ao excluir mensagem');
    res.status(500).json({error: 'Não foi possível excluir a mensagem'});
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

    const update = Object.fromEntries(Object.entries({nome, email, descricao, alvoId, alvoTipo}).filter(([, value]) => value !== undefined));
    const updated = await DenunciaMessage.findByIdAndUpdate(id, {$set: update}, {new: true, runValidators: true});

    if (!updated) {
      res.status(404).json({error: 'Denúncia não encontrada'});
      return;
    }

    await recordAuditEvent('report.updated', req.userId, String(updated._id), req.userRole ?? (req.isApiKeyValid ? 'admin' : 'unknown'));

    res.json({message: 'Denúncia atualizada', data: updated});
  } catch (error) {
    logger.error('Falha interna ao atualizar denúncia');
    res.status(500).json({error: 'Não foi possível atualizar a denúncia'});
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

    await recordAuditEvent('report.deleted', req.userId, String(removed._id), req.userRole ?? (req.isApiKeyValid ? 'admin' : 'unknown'));

    res.json({message: 'Denúncia deletada'});
  } catch (error) {
    logger.error('Falha interna ao excluir denúncia');
    res.status(500).json({error: 'Não foi possível excluir a denúncia'});
  }
};
