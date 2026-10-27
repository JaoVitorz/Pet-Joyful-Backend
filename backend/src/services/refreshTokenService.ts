import crypto from 'node:crypto';
import mongoose from 'mongoose';
import RefreshToken from '../models/refreshTokenModel.js';

const lifetimeMs = 30 * 24 * 60 * 60 * 1000;
const tokenHash = (token: string) => crypto.createHash('sha256').update(token).digest('hex');

export async function issueRefreshToken(userId: string, authVersion = 0): Promise<string> {
  const token = crypto.randomBytes(32).toString('base64url');
  await RefreshToken.create({tokenHash: tokenHash(token), userId: new mongoose.Types.ObjectId(userId), authVersion, expiresAt: new Date(Date.now() + lifetimeMs)});
  return token;
}

export async function consumeRefreshToken(token: unknown): Promise<{token: string; userId: string; authVersion: number} | null> {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  const oldHash = tokenHash(token);
  const newToken = crypto.randomBytes(32).toString('base64url');
  const newHash = tokenHash(newToken);
  const consumed = await RefreshToken.findOneAndUpdate({
    tokenHash: oldHash,
    revokedAt: null,
    expiresAt: mongoose.trusted({$gt: new Date()}),
  }, {$set: {revokedAt: new Date(), replacedByHash: newHash}}, {new: false});
  if (!consumed) return null;
  await RefreshToken.create({tokenHash: newHash, userId: consumed.userId, authVersion: consumed.authVersion, expiresAt: new Date(Date.now() + lifetimeMs)});
  return {token: newToken, userId: String(consumed.userId), authVersion: consumed.authVersion ?? 0};
}

export async function revokeRefreshToken(token: unknown): Promise<void> {
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) return;
  await RefreshToken.updateOne({tokenHash: tokenHash(token), revokedAt: null}, {$set: {revokedAt: new Date()}});
}

export async function revokeUserRefreshTokens(userId: string): Promise<void> {
  if (!mongoose.isValidObjectId(userId)) return;
  await RefreshToken.updateMany({userId: new mongoose.Types.ObjectId(userId), revokedAt: null}, {$set: {revokedAt: new Date()}});
}
