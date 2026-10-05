import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import type {Response} from 'express';
import {logger} from '../logger/logger.js';
import User from '../models/userModel.js';
import type {AuthRequest, JwtPayload} from '../types/index.js';
import {buildUserExport, eraseUserData, MediaCleanupError} from '../services/userDataService.js';

// CREATE
export const createUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const body = req.body as Record<string, string>;
    const nome = body.nome;
    const email = body.email;
    const senha = body.senha;
    const tipo = body.tipo;

    if (!nome || !email || !senha || !tipo) {
      res.status(400).json({error: 'Todos os campos são obrigatórios!'});
      return;
    }

    const existingUser = await User.findOne({email});
    if (existingUser) {
      res.status(400).json({error: 'Email já cadastrado!'});
      return;
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    if (tipo === 'admin') {
      const adminKey =
        (req.headers['x-admin-key'] as string) ||
        (req.query['admin_key'] as string);
      const auth = req.headers['authorization'] as string;
      let allowed = false;

      if (adminKey && adminKey === process.env.ADMIN_KEY) allowed = true;

      if (!allowed && auth && auth.startsWith('Bearer ')) {
        const token = auth.split(' ')[1];
        try {
          const payload = jwt.verify(
            token,
            process.env.JWT_SECRET as string,
          ) as JwtPayload;
          if (payload && (payload.tipo === 'admin' || payload.role === 'admin'))
            allowed = true;
        } catch {
          // token inválido
        }
      }

      if (!allowed) {
        res.status(403).json({
          error: 'Criação de usuário admin requer API key ou token admin',
        });
        return;
      }
    }

    const user = new User({nome, email, senha: hashedPassword, tipo});
    await user.save();

    res.status(201).json({message: 'Usuário criado com sucesso!', user});
  } catch (error) {
    logger.error('Erro em createUser:', error);
    res.status(500).json({error: (error as Error).message});
  }
};

// READ ALL
export const getUsers = async (
  _req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    logger.error('Erro em getUsers:', error);
    res.status(500).json({error: (error as Error).message});
  }
};

// READ BY ID
export const getUserById = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({error: 'Usuário não encontrado!'});
      return;
    }
    res.json(user);
  } catch (error) {
    logger.error('Erro em getUserById:', error);
    res.status(500).json({error: (error as Error).message});
  }
};

// UPDATE
export const updateUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const body = req.body as Record<string, string>;
    const nome = body.nome;
    const email = body.email;
    const senha = body.senha;
    const tipo = body.tipo;

    const updateData: Record<string, string> = {};
    if (nome) updateData.nome = nome;
    if (email) updateData.email = email;
    if (tipo) updateData.tipo = tipo;
    if (senha) updateData.senha = await bcrypt.hash(senha, 10);

    const requesterId = req.userId;
    const isApiKey = req.isApiKeyValid;
    const isAdmin = req.userRole === 'admin';

    if (
      !isApiKey &&
      !isAdmin &&
      (!requesterId || requesterId.toString() !== req.params.id)
    ) {
      res
        .status(403)
        .json({error: 'Não autorizado a atualizar este usuário.'});
      return;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!user) {
      res.status(404).json({error: 'Usuário não encontrado!'});
      return;
    }

    res.json({message: 'Usuário atualizado com sucesso!', user});
  } catch (error) {
    logger.error('Erro em updateUser:', error);
    res.status(500).json({error: (error as Error).message});
  }
};

// DELETE
export const deleteUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({error: 'Não autenticado'});
      return;
    }
    if (req.userId !== req.params.id) {
      res.status(403).json({error: 'Não autorizado a deletar este usuário.'});
      return;
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({error: 'ID inválido'});
      return;
    }
    const token = req.headers.authorization?.split(' ')[1] ?? '';
    const result = await eraseUserData(req.params.id, token);
    if (!result) {
      res.status(404).json({error: 'Usuário não encontrado!'});
      return;
    }
    res.json({message: 'Conta excluída com sucesso', ...result});
  } catch (error) {
    logger.error('Erro em deleteUser:', error);
    res.status(error instanceof MediaCleanupError ? 503 : 500).json({
      error: 'Não foi possível concluir a exclusão. Tente novamente.',
    });
  }
};

export const exportUserData = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({error: 'Não autenticado'});
      return;
    }
    if (req.userId !== req.params.id) {
      res.status(403).json({error: 'Não autorizado a exportar estes dados'});
      return;
    }
    if (!mongoose.isValidObjectId(req.params.id)) {
      res.status(400).json({error: 'ID inválido'});
      return;
    }
    const data = await buildUserExport(req.params.id);
    if (!data) {
      res.status(404).json({error: 'Conta não encontrada'});
      return;
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="pet-joyful-data-${req.params.id}.json"`);
    res.status(200).json(data);
  } catch (error) {
    logger.error('Erro em exportUserData:', error);
    res.status(500).json({error: 'Não foi possível exportar os dados'});
  }
};
