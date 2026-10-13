import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import type {IUserDocument, JwtPayload} from '../types/index.js';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const period = 30;

function challengeSigningKey(): string {
  return crypto.createHmac('sha256', process.env.JWT_SECRET as string)
    .update('pet-joyful:mfa-challenge:v1').digest('base64url');
}

function encryptionKey(): Buffer {
  const value = process.env.MFA_ENCRYPTION_KEY;
  if (!value || !/^[0-9a-f]{64}$/i.test(value)) {
    throw new Error('MFA_ENCRYPTION_KEY deve conter 32 bytes em hexadecimal');
  }
  return Buffer.from(value, 'hex');
}

export function generateSecret(): string {
  const bytes = crypto.randomBytes(20);
  let bits = 0;
  let value = 0;
  let result = '';
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      result += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) result += alphabet[(value << (5 - bits)) & 31];
  return result;
}

function decodeSecret(secret: string): Buffer {
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const character of secret.toUpperCase()) {
    const digit = alphabet.indexOf(character);
    if (digit < 0) throw new Error('Segredo TOTP inválido');
    value = (value << 5) | digit;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

export function encryptSecret(secret: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey(), iv,
    {authTagLength: 16});
  const encrypted = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map(part => part.toString('base64url')).join('.');
}

export function decryptSecret(value: string): string {
  const [iv, tag, encrypted] = value.split('.');
  if (!iv || !tag || !encrypted) throw new Error('Segredo TOTP inválido');
  const ivBytes = Buffer.from(iv, 'base64url');
  const tagBytes = Buffer.from(tag, 'base64url');
  if (ivBytes.length !== 12 || tagBytes.length !== 16) throw new Error('Segredo TOTP inválido');
  const decipher = crypto.createDecipheriv('aes-256-gcm', encryptionKey(), ivBytes,
    {authTagLength: 16});
  decipher.setAuthTag(tagBytes);
  return Buffer.concat([decipher.update(Buffer.from(encrypted, 'base64url')), decipher.final()]).toString('utf8');
}

function codeAt(secret: string, step: number): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const digest = crypto.createHmac('sha1', decodeSecret(secret)).update(counter).digest();
  const offset = digest[digest.length - 1] & 15;
  return String((digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000).padStart(6, '0');
}

export function verifyTotp(secret: string, code: unknown, now = Date.now()): number | null {
  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) return null;
  const current = Math.floor(now / 1000 / period);
  for (const step of [current - 1, current, current + 1]) {
    const expected = Buffer.from(codeAt(secret, step));
    if (crypto.timingSafeEqual(expected, Buffer.from(code))) return step;
  }
  return null;
}

export function provisioningUri(email: string, secret: string): string {
  const label = encodeURIComponent(`Pet Joyful:${email}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent('Pet Joyful')}&algorithm=SHA1&digits=6&period=30`;
}

export function generateRecoveryCodes(): {codes: string[]; hashes: string[]} {
  const codes = Array.from({length: 10}, () => crypto.randomBytes(16).toString('base64url'));
  return {codes, hashes: codes.map(hashRecoveryCode)};
}

export function hashRecoveryCode(code: string): string {
  return crypto.createHash('sha256').update(code).digest('hex');
}

export function signAccessToken(user: IUserDocument): string {
  return jwt.sign({userId: String(user._id), email: user.email, tipo: user.tipo,
    tokenUse: 'access', authVersion: user.authVersion ?? 0, mfa: !!user.mfaEnabled},
  process.env.JWT_SECRET as string, {expiresIn: '7d'});
}

export function signChallengeToken(user: IUserDocument, nonce: string): string {
  return jwt.sign({userId: String(user._id), tokenUse: 'mfa_challenge',
    authVersion: user.authVersion ?? 0, jti: nonce},
  challengeSigningKey(), {expiresIn: '5m'});
}

export function verifyChallengeToken(token: string): JwtPayload | null {
  try {
    const payload = jwt.verify(token, challengeSigningKey()) as JwtPayload;
    return payload.tokenUse === 'mfa_challenge' && typeof payload.jti === 'string' ? payload : null;
  } catch {
    return null;
  }
}

export function accessTokenMatchesUser(payload: JwtPayload, user: IUserDocument): boolean {
  const version = user.authVersion ?? 0;
  if (payload.tokenUse === 'mfa_challenge') return false;
  if (payload.tokenUse === undefined) return version === 0 && !user.mfaEnabled;
  return payload.tokenUse === 'access' && payload.authVersion === version &&
    (!user.mfaEnabled || payload.mfa === true);
}
