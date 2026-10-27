import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import type {Response} from 'express';
import userModel from '../models/userModel.js';
import type {AuthRequest, IUserDocument} from '../types/index.js';
import {logger} from '../logger/logger.js';
import {normalizeCpf} from '../services/cpfService.js';
import {eraseUserData, MediaCleanupError} from '../services/userDataService.js';
import {signAccessToken, signChallengeToken} from '../services/mfaService.js';
import {recordAuditEvent} from '../services/auditLogService.js';
import {consumeRefreshToken, issueRefreshToken, revokeUserRefreshTokens} from '../services/refreshTokenService.js';
import mongoose from 'mongoose';
import {cpfLookupHash, encryptCpf} from '../services/cpfProtection.js';

const loginFailures = new Map<string, {count: number; until: number}>();
const loginWindowMs = 15 * 60_000;

function recordLoginFailure(key: string): void {
  const now = Date.now();
  const previous = loginFailures.get(key);
  const count = previous && previous.until > now ? previous.count + 1 : 1;
  loginFailures.set(key, {count, until: now + loginWindowMs});
  if (loginFailures.size > 10_000) {
    for (const [entry, value] of loginFailures) {
      if (value.until <= now) loginFailures.delete(entry);
    }
    while (loginFailures.size > 10_000) {
      const oldest = loginFailures.keys().next().value;
      if (oldest === undefined) break;
      loginFailures.delete(oldest);
    }
  }
}

const validateCpfInput = (body: Record<string, unknown>) => {
  const cpf = normalizeCpf(body.cpf);
  if (!cpf) {
    return {status: 400, error: 'Informe um CPF válido'};
  }
  return {status: 200, cpf};
};

export const validateCpf = async (req: AuthRequest, res: Response): Promise<void> => {
  const result = validateCpfInput(req.body as Record<string, unknown>);
  if ('error' in result) {
    res.status(result.status).json({valido: false, error: result.error});
    return;
  }
  res.json({valido: true, verificacao: 'digitos_verificadores'});
};

export const register = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const body = req.body as Record<string, string>;
    const nome = body.nome || body.name;
    const email = body.email;
    const senha = body.senha || body.password;
    const tipo = body.tipo || body.type;

    if (!nome || !email || !senha || !tipo) {
      res.status(400).json({error: 'Todos os campos são obrigatórios!'});
      return;
    }

    if (await userModel.findOne({email})) {
      res.status(400).json({error: 'Email já está em uso'});
      return;
    }

    const cpfResult = validateCpfInput(body);
    if ('error' in cpfResult) {
      res.status(cpfResult.status).json({error: cpfResult.error});
      return;
    }
    if (await userModel.findOne({$or: [
      {cpfHash: cpfLookupHash(cpfResult.cpf)},
      {cpf: cpfResult.cpf},
    ]})) {
      res.status(400).json({error: 'CPF já está em uso'});
      return;
    }

    const user = new userModel({
      nome, email, senha, tipo, cpf: encryptCpf(cpfResult.cpf), cpfHash: cpfLookupHash(cpfResult.cpf),
    });
    await user.save();
    await recordAuditEvent('auth.registered', String(user._id), String(user._id), user.tipo);

    const token = signAccessToken(user);
    const refreshToken = await issueRefreshToken(String(user._id), user.authVersion ?? 0);

    res.status(201).json({
      message: 'Cadastro criado com sucesso.',
      token,
      refreshToken,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
    });
  } catch (error) {
    logger.error('Falha interna ao concluir cadastro');
    res.status(500).json({error: 'Não foi possível concluir o cadastro'});
  }
};

export const login = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const body = req.body as Record<string, string>;
    const email = body.email;
    const senha = body.senha || body.password;

    if (typeof email !== 'string' || typeof senha !== 'string' ||
      !email || !senha || email.length > 254) {
      res.status(400).json({error: 'Email e senha são obrigatórios'});
      return;
    }

    const failureKey = `${req.ip ?? 'unknown'}:${email.trim().toLowerCase()}`;
    const failures = loginFailures.get(failureKey);
    if (failures && failures.until > Date.now() && failures.count >= 10) {
      res.status(429).json({error: 'Tente novamente mais tarde'});
      return;
    }

    const user = await userModel.findOne({email}).select('+deletionRequestedAt +mfaLockedUntil');

    if (!user) {
      recordLoginFailure(failureKey);
      await recordAuditEvent('auth.login_failed');
      res.status(401).json({error: 'Credenciais inválidas'});
      return;
    }

    if (user.deletionRequestedAt) {
      res.status(403).json({error: 'Conta em processo de exclusão'});
      return;
    }


    const senhaCorreta = await user.comparePassword(senha);

    if (!senhaCorreta) {
      recordLoginFailure(failureKey);
      await recordAuditEvent('auth.login_failed', undefined, String(user._id));
      res.status(401).json({error: 'Credenciais inválidas'});
      return;
    }

    if (user.mfaEnabled) {
      if (user.mfaLockedUntil && user.mfaLockedUntil.getTime() > Date.now()) {
        res.status(429).json({error: 'Tente novamente mais tarde'});
        return;
      }
      const nonce = crypto.randomBytes(24).toString('base64url');
      await userModel.updateOne({_id: user._id, mfaEnabled: true},
        {$set: {mfaChallengeNonce: nonce}});
      res.json({mfaRequired: true, challengeToken: signChallengeToken(user, nonce)});
      await recordAuditEvent('auth.mfa_challenge_issued', String(user._id), String(user._id), user.tipo);
      return;
    }

    loginFailures.delete(failureKey);

    const token = signAccessToken(user);
    await recordAuditEvent('auth.login_succeeded', String(user._id), String(user._id), user.tipo);

    const refreshToken = await issueRefreshToken(String(user._id), user.authVersion ?? 0);
    res.json({
      token,
      refreshToken,
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
      },
    });
  } catch (error) {
    logger.error('Erro interno no login');
    res.status(500).json({error: 'Não foi possível concluir o login'});
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

    await recordAuditEvent('user.profile_updated', userId, userId, req.userRole ?? 'user');

    res.json({user});
  } catch (error) {
    logger.error('Falha interna ao buscar perfil');
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

    const body = req.body as Record<string, string>;
    const nome = body.nome || body.name;
    const email = body.email;
    const senha = body.senha || body.password;
    const tipo = body.tipo || body.type;

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
      .findByIdAndUpdate(userId, {$set: updateData}, {new: true, runValidators: true})
      .select('-senha');

    if (!user) {
      logger.error('Usuário não encontrado para o ID:', {userId});
      res.status(404).json({error: 'Usuário não encontrado'});
      return;
    }

    res.json({message: 'Perfil atualizado com sucesso', user});
  } catch (error) {
    logger.error('Falha interna ao atualizar perfil');
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

    const token = req.headers.authorization?.split(' ')[1] ?? '';
    const result = await eraseUserData(userId, token);
    if (!result) {
      res.status(404).json({error: 'Usuário não encontrado'});
      return;
    }
    await recordAuditEvent('user.deleted', userId, userId, req.userRole ?? 'user');
    res.json({message: 'Conta excluída com sucesso', ...result});
  } catch (error) {
    logger.error('Falha interna ao excluir perfil');
    res.status(error instanceof MediaCleanupError ? 503 : 500).json({
      error: 'Não foi possível concluir a exclusão. Tente novamente.',
    });
  }
};

export const getSession = (req: AuthRequest, res: Response): void => {
  res.json({active: true, userId: req.userId});
};

export const refreshSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const body = req.body as Record<string, unknown>;
    const rotated = await consumeRefreshToken(body.refreshToken);
    if (!rotated) { res.status(401).json({error: 'Refresh token inválido ou expirado'}); return; }
    const user = await userModel.findOne({
      _id: rotated.userId,
      deletionRequestedAt: mongoose.trusted({$exists: false}),
    });
    if (!user || (user.authVersion ?? 0) !== rotated.authVersion) {
      await revokeUserRefreshTokens(rotated.userId);
      res.status(401).json({error: 'Sessão indisponível'}); return;
    }
    res.json({token: signAccessToken(user), refreshToken: rotated.token});
  } catch {
    logger.error('Falha interna ao renovar sessão');
    res.status(500).json({error: 'Não foi possível renovar a sessão'});
  }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.userId) { res.status(401).json({error: 'Não autenticado'}); return; }
    await revokeUserRefreshTokens(req.userId);
    res.status(204).end();
  } catch {
    res.status(500).json({error: 'Não foi possível encerrar a sessão'});
  }
};
