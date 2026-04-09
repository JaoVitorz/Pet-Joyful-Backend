import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type {Response} from 'express';
import userModel from '../models/userModel.js';
import type {AuthRequest, IUserDocument} from '../types/index.ts';
import {logger} from '../logger/logger.js';

export const register = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // Aceita ambos os formatos: português (nome, senha, tipo) e inglês (name, password, type)
    const nome = (req.body.nome || req.body.name) as string;
    const email = req.body.email as string;
    const senha = (req.body.senha || req.body.password) as string;
    const tipo = (req.body.tipo || req.body.type) as string;

    if (!nome || !email || !senha || !tipo) {
      res.status(400).json({error: 'Todos os campos são obrigatórios!'});
      return;
    }

    let user = await userModel.findOne({email});
    if (user) {
      res.status(400).json({error: 'Email já está em uso'});
      return;
    }

    user = new userModel({nome, email, senha, tipo});
    await user.save();

    const token = jwt.sign(
      {userId: user._id, email: user.email, tipo: user.tipo},
      process.env.JWT_SECRET as string,
      {expiresIn: '7d'},
    );

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
    });
  } catch (error) {
    logger.error('Erro no registro:', {message: (error as Error).message});
    res.status(500).json({error: (error as Error).message});
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const email = req.body.email as string;
    const senha = (req.body.senha || req.body.password) as string;

    if (!email || !senha) {
      res.status(400).json({error: 'Email e senha são obrigatórios'});
      return;
    }

    logger.info('Tentativa de login', {email});
    const user = await userModel.findOne({email});

    if (!user) {
      logger.info('Login falhou: usuário não encontrado', {email});
      res.status(401).json({error: 'Credenciais inválidas'});
      return;
    }

    logger.info('Login: usuário encontrado', {email: user.email, tipo: user.tipo});

    const senhaCorreta = await user.comparePassword(senha);

    if (!senhaCorreta) {
      logger.info('Login falhou: senha incorreta', {email});
      res.status(401).json({error: 'Credenciais inválidas'});
      return;
    }

    const token = jwt.sign(
      {userId: user._id, email: user.email, tipo: user.tipo},
      process.env.JWT_SECRET as string,
      {expiresIn: '7d'},
    );

    res.json({
      token,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
    });
  } catch (error) {
    logger.error('Erro no login:', {message: (error as Error).message});
    res.status(500).json({error: (error as Error).message});
  }
};

// GET /auth/me
export const getProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({error: 'Não autenticado'});
      return;
    }

    const user = await userModel.findById(userId).select('-senha');
    if (!user) {
      res.status(404).json({error: 'Usuário não encontrado'});
      return;
    }

    res.json({user});
  } catch (error) {
    logger.error('Erro em getProfile:', {message: (error as Error).message});
    res.status(500).json({error: (error as Error).message});
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({error: 'Não autenticado'});
      return;
    }

    const {nome, email, senha, tipo} = req.body as {
      nome?: string;
      email?: string;
      senha?: string;
      tipo?: string;
    };

    const updateData: Record<string, string> = {};
    if (nome) updateData.nome = nome;
    if (email) updateData.email = email;
    if (tipo) updateData.tipo = tipo;
    if (senha) updateData.senha = await bcrypt.hash(senha, 10);

    if (email) {
      const other = (await userModel.findOne({email})) as IUserDocument | null;
      if (other && String(other._id) !== userId.toString()) {
        res.status(400).json({error: 'Email já em uso por outro usuário'});
        return;
      }
    }

    const user = await userModel
      .findByIdAndUpdate(userId, updateData, {new: true})
      .select('-senha');

    if (!user) {
      logger.error('Usuário não encontrado para o ID:', {userId});
      res.status(404).json({error: 'Usuário não encontrado'});
      return;
    }

    res.json({message: 'Perfil atualizado com sucesso', user});
  } catch (error) {
    logger.error('Erro em updateProfile:', {message: (error as Error).message});
    res.status(500).json({error: (error as Error).message});
  }
};

// DELETE /auth/me
export const deleteProfile = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({error: 'Não autenticado'});
      return;
    }

    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({error: 'Usuário não encontrado'});
      return;
    }

    res.json({message: 'Conta deletada com sucesso'});
  } catch (error) {
    logger.error('Erro em deleteProfile:', {message: (error as Error).message});
    res.status(500).json({error: (error as Error).message});
  }
};
