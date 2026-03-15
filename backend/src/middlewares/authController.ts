import jwt from 'jsonwebtoken';
import type {Response, NextFunction} from 'express';
import type {AuthRequest} from '../types/index.js';
import userModel from '../models/userModel.js';

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {name, email, password} = req.body as {
      name: string;
      email: string;
      password: string;
    };

    let user = await userModel.findOne({email});
    if (user) {
      res.status(400).json({error: 'Email already in use'});
      return;
    }

    user = new userModel({nome: name, email, senha: password, tipo: 'adotante'});
    await user.save();

    res.status(201).json({message: 'User created'});
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {email, password} = req.body as {email: string; password: string};

    const user = await userModel.findOne({email});
    if (!user) {
      res.status(400).json({error: 'Invalid credentials'});
      return;
    }

    const match = await user.comparePassword(password);
    if (!match) {
      res.status(400).json({error: 'Invalid credentials'});
      return;
    }

    const token = jwt.sign(
      {id: user._id},
      process.env.JWT_SECRET as string,
      {expiresIn: '7d'},
    );

    res.json({token});
  } catch (err) {
    next(err);
  }
};
