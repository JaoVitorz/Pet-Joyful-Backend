import crypto from 'node:crypto';

function keyFromEnv(name: 'CPF_ENCRYPTION_KEY' | 'CPF_HASH_KEY'): Buffer {
  const value = process.env[name] ?? '';
  if (!/^[a-f\d]{64}$/i.test(value)) throw new Error(`${name} must be a 32-byte hexadecimal key`);
  return Buffer.from(value, 'hex');
}

export function cpfLookupHash(cpf: string): string {
  return crypto.createHmac('sha256', keyFromEnv('CPF_HASH_KEY')).update(cpf).digest('hex');
}

export function encryptCpf(cpf: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', keyFromEnv('CPF_ENCRYPTION_KEY'), iv);
  const ciphertext = Buffer.concat([cipher.update(cpf, 'utf8'), cipher.final()]);
  return ['v1', iv.toString('base64url'), cipher.getAuthTag().toString('base64url'), ciphertext.toString('base64url')].join('.');
}

export function decryptCpf(value: string): string {
  const [version, encodedIv, encodedTag, encodedCiphertext] = value.split('.');
  if (version !== 'v1' || !encodedIv || !encodedTag || !encodedCiphertext) throw new Error('CPF ciphertext inválido');
  const decipher = crypto.createDecipheriv('aes-256-gcm', keyFromEnv('CPF_ENCRYPTION_KEY'), Buffer.from(encodedIv, 'base64url'));
  decipher.setAuthTag(Buffer.from(encodedTag, 'base64url'));
  return Buffer.concat([decipher.update(Buffer.from(encodedCiphertext, 'base64url')), decipher.final()]).toString('utf8');
}

export function revealCpf(value: string | undefined): string | null {
  if (!value) return null;
  return value.startsWith('v1.') ? decryptCpf(value) : value;
}
