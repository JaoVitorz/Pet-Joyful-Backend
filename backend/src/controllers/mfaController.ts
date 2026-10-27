import type {Response} from 'express';
import mongoose from 'mongoose';
import userModel from '../models/userModel.js';
import type {AuthRequest} from '../types/index.js';
import {logger} from '../logger/logger.js';
import {decryptSecret, encryptSecret, generateRecoveryCodes, generateSecret,
  hashRecoveryCode, provisioningUri, signAccessToken, verifyChallengeToken,
  verifyTotp} from '../services/mfaService.js';
import {recordAuditEvent} from '../services/auditLogService.js';
import {issueRefreshToken} from '../services/refreshTokenService.js';

const privateFields = '+mfaSecret +mfaPendingSecret +mfaPendingExpiresAt +mfaLastUsedStep +mfaRecoveryCodes +mfaChallengeNonce +mfaFailedAttempts +mfaLockedUntil';

function bodyOf(req: AuthRequest): Record<string, unknown> {
  const body = req.body as unknown;
  return body && typeof body === 'object' && !Array.isArray(body) ?
    body as Record<string, unknown> : {};
}

function locked(user: {mfaLockedUntil?: Date}): boolean {
  return !!user.mfaLockedUntil && user.mfaLockedUntil.getTime() > Date.now();
}

async function failedAttempt(userId: string): Promise<void> {
  const user = await userModel.findByIdAndUpdate(userId,
    {$inc: {mfaFailedAttempts: 1}}, {new: true}).select('+mfaFailedAttempts');
  if ((user?.mfaFailedAttempts ?? 0) >= 5) {
    await userModel.findByIdAndUpdate(userId, {$set: {mfaLockedUntil: new Date(Date.now() + 15 * 60_000), mfaFailedAttempts: 0}});
  }
}

export const status = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await userModel.findById(req.userId);
  if (!user) { res.status(401).json({error: 'Conta indisponível'}); return; }
  res.json({enabled: !!user.mfaEnabled});
};

export const setup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const password = bodyOf(req).password ?? bodyOf(req).senha;
    if (typeof password !== 'string') { res.status(400).json({error: 'Senha obrigatória'}); return; }
    const user = await userModel.findById(req.userId);
    if (!user || user.mfaEnabled || !(await user.comparePassword(password))) {
      res.status(401).json({error: 'Não foi possível iniciar o MFA'}); return;
    }
    const secret = generateSecret();
    const expiresAt = new Date(Date.now() + 10 * 60_000);
    await userModel.updateOne({_id: user._id, mfaEnabled: mongoose.trusted({$ne: true})},
      {$set: {mfaPendingSecret: encryptSecret(secret), mfaPendingExpiresAt: expiresAt}});
    res.json({secret, otpauthUrl: provisioningUri(user.email, secret), expiresAt});
  } catch (error) {
    logger.error('Falha interna ao iniciar MFA');
    res.status(503).json({error: 'MFA indisponível'});
  }
};

export const cancelSetup = async (req: AuthRequest, res: Response): Promise<void> => {
  await userModel.updateOne({_id: req.userId, mfaEnabled: mongoose.trusted({$ne: true})},
    {$unset: {mfaPendingSecret: '', mfaPendingExpiresAt: ''}});
  res.status(204).end();
};

export const confirmSetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await userModel.findById(req.userId).select(privateFields);
    if (!user || user.mfaEnabled || !user.mfaPendingSecret ||
      !user.mfaPendingExpiresAt || user.mfaPendingExpiresAt.getTime() <= Date.now()) {
      res.status(400).json({error: 'Configuração expirada ou inexistente'}); return;
    }
    if (locked(user)) { res.status(429).json({error: 'Tente novamente mais tarde'}); return; }
    const step = verifyTotp(decryptSecret(user.mfaPendingSecret), bodyOf(req).code);
    if (step === null) {
      await failedAttempt(String(user._id));
      res.status(401).json({error: 'Código inválido'}); return;
    }
    const {codes, hashes} = generateRecoveryCodes();
    const updated = await userModel.findOneAndUpdate({_id: user._id, mfaEnabled: mongoose.trusted({$ne: true}),
      mfaPendingSecret: user.mfaPendingSecret, mfaPendingExpiresAt: mongoose.trusted({$gt: new Date()})},
    {$set: {mfaEnabled: true, mfaSecret: user.mfaPendingSecret,
      mfaLastUsedStep: step, mfaRecoveryCodes: hashes, mfaFailedAttempts: 0},
    $inc: {authVersion: 1},
    $unset: {mfaPendingSecret: '', mfaPendingExpiresAt: '', mfaLockedUntil: ''}},
    {new: true});
    if (!updated) { res.status(409).json({error: 'Configuração alterada'}); return; }
    logger.info('MFA ativado', {userId: String(user._id)});
    await recordAuditEvent('mfa.enabled', String(user._id), String(user._id), user.tipo);
    res.json({enabled: true, recoveryCodes: codes, token: signAccessToken(updated),
      refreshToken: await issueRefreshToken(String(updated._id), updated.authVersion ?? 0)});
  } catch (error) {
    logger.error('Falha interna ao confirmar MFA');
    res.status(503).json({error: 'MFA indisponível'});
  }
};

export const verifyChallenge = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const challengeToken = bodyOf(req).challengeToken;
    const payload = typeof challengeToken === 'string' ? verifyChallengeToken(challengeToken) : null;
    if (!payload?.userId || !payload.jti) {
      res.status(401).json({error: 'Desafio inválido'}); return;
    }
    const user = await userModel.findById(payload.userId).select(privateFields + ' +deletionRequestedAt');
    if (!user || user.deletionRequestedAt || !user.mfaEnabled || !user.mfaSecret ||
      user.authVersion !== payload.authVersion || user.mfaChallengeNonce !== payload.jti) {
      res.status(401).json({error: 'Desafio inválido'}); return;
    }
    if (locked(user)) { res.status(429).json({error: 'Tente novamente mais tarde'}); return; }
    const code = bodyOf(req).code;
    const recoveryCode = bodyOf(req).recoveryCode;
    const base = {_id: user._id, mfaEnabled: true, authVersion: user.authVersion,
      mfaChallengeNonce: payload.jti, mfaLockedUntil: mongoose.trusted({$not: {$gt: new Date()}})};
    let updated;
    if (typeof recoveryCode === 'string' && /^[A-Za-z0-9_-]{22}$/.test(recoveryCode)) {
      const hash = hashRecoveryCode(recoveryCode);
      updated = await userModel.findOneAndUpdate({...base, mfaRecoveryCodes: hash},
        {$pull: {mfaRecoveryCodes: hash}, $unset: {mfaChallengeNonce: '', mfaLockedUntil: ''},
          $set: {mfaFailedAttempts: 0}}, {new: true});
      if (updated) logger.info('Código de recuperação utilizado', {userId: String(user._id)});
    } else {
      const step = verifyTotp(decryptSecret(user.mfaSecret), code);
      if (step !== null) {
        updated = await userModel.findOneAndUpdate({...base,
          $or: [{mfaLastUsedStep: mongoose.trusted({$exists: false})}, {mfaLastUsedStep: mongoose.trusted({$lt: step})}]},
        {$set: {mfaLastUsedStep: step, mfaFailedAttempts: 0},
          $unset: {mfaChallengeNonce: '', mfaLockedUntil: ''}}, {new: true});
      }
    }
    if (!updated) {
      await failedAttempt(String(user._id));
      res.status(401).json({error: 'Código inválido'}); return;
    }
    res.json({token: signAccessToken(updated), refreshToken: await issueRefreshToken(String(updated._id), updated.authVersion ?? 0), user: {
      id: updated._id, nome: updated.nome, email: updated.email, tipo: updated.tipo,
    }});
  } catch (error) {
    logger.error('Falha interna ao verificar MFA');
    res.status(503).json({error: 'MFA indisponível'});
  }
};

async function authorizedChange(req: AuthRequest): Promise<{
  userId: string; authVersion: number; mfaSecret: string;
  step?: number; recoveryHash?: string;
} | null> {
  const body = bodyOf(req);
  const password = body.password ?? body.senha;
  if (typeof password !== 'string') return null;
  const user = await userModel.findById(req.userId).select(privateFields);
  if (!user?.mfaEnabled || !user.mfaSecret || locked(user) ||
    !(await user.comparePassword(password))) return null;
  const step = verifyTotp(decryptSecret(user.mfaSecret), body.code);
  if (step !== null && step > (user.mfaLastUsedStep ?? -1)) {
    return {userId: String(user._id), authVersion: user.authVersion ?? 0,
      mfaSecret: user.mfaSecret, step};
  }
  if (typeof body.recoveryCode === 'string' && /^[A-Za-z0-9_-]{22}$/.test(body.recoveryCode)) {
    const hash = hashRecoveryCode(body.recoveryCode);
    if (user.mfaRecoveryCodes?.includes(hash)) return {userId: String(user._id),
      authVersion: user.authVersion ?? 0, mfaSecret: user.mfaSecret, recoveryHash: hash};
  }
  await failedAttempt(String(user._id));
  return null;
}

export const regenerateRecovery = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const proof = await authorizedChange(req);
    if (!proof) { res.status(401).json({error: 'Confirmação inválida'}); return; }
    const {codes, hashes} = generateRecoveryCodes();
    const filter = proof.step !== undefined ?
      {_id: proof.userId, mfaEnabled: true, authVersion: proof.authVersion,
        mfaSecret: proof.mfaSecret, mfaLockedUntil: mongoose.trusted({$not: {$gt: new Date()}}),
        $or: [{mfaLastUsedStep: mongoose.trusted({$exists: false})}, {mfaLastUsedStep: mongoose.trusted({$lt: proof.step})}]} :
      {_id: proof.userId, mfaEnabled: true, authVersion: proof.authVersion,
        mfaSecret: proof.mfaSecret, mfaRecoveryCodes: proof.recoveryHash,
        mfaLockedUntil: mongoose.trusted({$not: {$gt: new Date()}})};
    const updated = await userModel.findOneAndUpdate(filter,
      {$set: {mfaRecoveryCodes: hashes, ...(proof.step !== undefined ? {mfaLastUsedStep: proof.step} : {})},
        $inc: {authVersion: 1}},
      {new: true});
    if (!updated) { res.status(409).json({error: 'Confirmação já utilizada'}); return; }
    logger.info('Códigos de recuperação renovados', {userId: proof.userId});
    await recordAuditEvent('mfa.recovery_codes_regenerated', proof.userId, proof.userId);
    res.json({recoveryCodes: codes, token: signAccessToken(updated),
      refreshToken: await issueRefreshToken(String(updated._id), updated.authVersion ?? 0)});
  } catch (error) {
    logger.error('Falha interna ao renovar códigos MFA');
    res.status(503).json({error: 'MFA indisponível'});
  }
};

export const disable = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const proof = await authorizedChange(req);
    if (!proof) { res.status(401).json({error: 'Confirmação inválida'}); return; }
    const filter = proof.step !== undefined ?
      {_id: proof.userId, mfaEnabled: true, authVersion: proof.authVersion,
        mfaSecret: proof.mfaSecret, mfaLockedUntil: mongoose.trusted({$not: {$gt: new Date()}}),
        $or: [{mfaLastUsedStep: mongoose.trusted({$exists: false})}, {mfaLastUsedStep: mongoose.trusted({$lt: proof.step})}]} :
      {_id: proof.userId, mfaEnabled: true, authVersion: proof.authVersion,
        mfaSecret: proof.mfaSecret, mfaRecoveryCodes: proof.recoveryHash,
        mfaLockedUntil: mongoose.trusted({$not: {$gt: new Date()}})};
    const updated = await userModel.findOneAndUpdate(filter,
      {$set: {mfaEnabled: false, mfaRecoveryCodes: [], mfaFailedAttempts: 0},
      $inc: {authVersion: 1},
      $unset: {mfaSecret: '', mfaPendingSecret: '', mfaPendingExpiresAt: '',
        mfaChallengeNonce: '', mfaLastUsedStep: '', mfaLockedUntil: ''}}, {new: true});
    if (!updated) { res.status(409).json({error: 'Confirmação já utilizada'}); return; }
    logger.info('MFA desativado', {userId: proof.userId});
    await recordAuditEvent('mfa.disabled', proof.userId, proof.userId);
    res.json({enabled: false, token: signAccessToken(updated),
      refreshToken: await issueRefreshToken(String(updated._id), updated.authVersion ?? 0)});
  } catch (error) {
    logger.error('Falha interna ao desativar MFA');
    res.status(503).json({error: 'MFA indisponível'});
  }
};
