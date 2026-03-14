import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type {Response} from 'express';
import User from '../models/userModel.js';
import type {AuthRequest, JwtPayload} from '../types/index.js';

// CREATE
export const createUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const {nome, email, senha, tipo} = req.body as {
      nome: string;
      email: string;
      senha: string;
      tipo: string;
    };

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
    res.status(500).json({error: (error as Error).message});
  }
};

// UPDATE
export const updateUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
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
    res.status(500).json({error: (error as Error).message});
  }
};

// DELETE
export const deleteUser = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const requesterId = req.userId;
    const isApiKey = req.isApiKeyValid;
    const isAdmin = req.userRole === 'admin';

    if (
      !isApiKey &&
      !isAdmin &&
      (!requesterId || requesterId.toString() !== req.params.id)
    ) {
      res.status(403).json({error: 'Não autorizado a deletar este usuário.'});
      return;
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({error: 'Usuário não encontrado!'});
      return;
    }

    res.json({message: 'Usuário deletado com sucesso!'});
  } catch (error) {
    res.status(500).json({error: (error as Error).message});
  }
};
