import {accessTokenMatchesUser, decryptSecret, encryptSecret, generateRecoveryCodes,
  generateSecret, verifyTotp} from '../../backend/src/services/mfaService';
import type {IUserDocument} from '../../backend/src/types';

describe('TOTP e segurança dos segredos', () => {
  beforeAll(() => { process.env.MFA_ENCRYPTION_KEY = 'b'.repeat(64); });

  it('valida o vetor SHA-1 da RFC 6238 em seis dígitos', () => {
    const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
    expect(verifyTotp(secret, '287082', 59_000)).toBe(1);
    expect(verifyTotp(secret, '287082', 119_000)).toBeNull();
    expect(verifyTotp(secret, 'abc', 59_000)).toBeNull();
  });

  it('protege o segredo em repouso e gera códigos independentes', () => {
    const secret = generateSecret();
    const ciphertext = encryptSecret(secret);
    expect(ciphertext).not.toContain(secret);
    expect(decryptSecret(ciphertext)).toBe(secret);
    const [iv, tag, encrypted] = ciphertext.split('.');
    expect(() => decryptSecret(`${iv}.${tag.slice(0, -2)}.${encrypted}`)).toThrow();
    const {codes, hashes} = generateRecoveryCodes();
    expect(new Set(codes).size).toBe(10);
    expect(hashes).toHaveLength(10);
    expect(hashes).not.toContain(codes[0]);
  });

  it('rejeita desafios e tokens antigos após a ativação', () => {
    const user = {authVersion: 1, mfaEnabled: true} as IUserDocument;
    expect(accessTokenMatchesUser({tokenUse: 'mfa_challenge', authVersion: 1}, user)).toBe(false);
    expect(accessTokenMatchesUser({userId: 'id'}, user)).toBe(false);
    expect(accessTokenMatchesUser({tokenUse: 'access', authVersion: 0, mfa: false}, user)).toBe(false);
    expect(accessTokenMatchesUser({tokenUse: 'access', authVersion: 1, mfa: true}, user)).toBe(true);
  });
});
