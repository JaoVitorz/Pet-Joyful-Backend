import type {Request} from 'express';
import mongoose from 'mongoose';

export enum UserTipo {
  ADOTANTE = 'adotante',
  CLIENTE = 'cliente',
  ADMIN = 'admin',
}

export enum AlvoTipo {
  POST = 'post',
  USUARIO = 'usuario',
  OUTRO = 'outro',
}

export interface IUser {
  nome: string;
  email: string;
  senha: string;
  tipo: UserTipo | string;
}

export interface IUserDocument extends IUser, mongoose.Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IPostMessageDocument extends mongoose.Document {
  nome?: string;
  email: string;
  mensagem: string;
  postId?: string;
}

export interface IDenunciaMessageDocument extends mongoose.Document {
  nome?: string;
  email: string;
  descricao: string;
  alvoId?: string;
  alvoTipo: AlvoTipo | string;
}

export interface JwtPayload {
  id?: string;
  userId?: string;
  email?: string;
  tipo?: string;
  role?: string;
}

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
  isApiKeyValid?: boolean;
  userEmail?: string;
  body: any;
}

export default {} as const;
