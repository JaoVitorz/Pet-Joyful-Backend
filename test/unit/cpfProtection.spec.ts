import {cpfLookupHash, decryptCpf, encryptCpf, revealCpf} from '../../backend/src/services/cpfProtection';

describe('proteção do CPF', () => {
  const encryptionKey = process.env.CPF_ENCRYPTION_KEY;
  const hashKey = process.env.CPF_HASH_KEY;
  beforeEach(() => {
    process.env.CPF_ENCRYPTION_KEY = '11'.repeat(32);
    process.env.CPF_HASH_KEY = '22'.repeat(32);
  });
  afterAll(() => {
    if (encryptionKey === undefined) delete process.env.CPF_ENCRYPTION_KEY;
    else process.env.CPF_ENCRYPTION_KEY = encryptionKey;
    if (hashKey === undefined) delete process.env.CPF_HASH_KEY;
    else process.env.CPF_HASH_KEY = hashKey;
  });

  it('cifra com IV aleatório e permite recuperar o valor original', () => {
    const first = encryptCpf('40442820135');
    const second = encryptCpf('40442820135');
    expect(first).not.toBe(second);
    expect(decryptCpf(first)).toBe('40442820135');
    expect(revealCpf(first)).toBe('40442820135');
    expect(revealCpf(undefined)).toBeNull();
    expect(revealCpf('legacy-cpf')).toBe('legacy-cpf');
  });

  it('gera hash determinístico para busca e rejeita ciphertext ou chaves inválidos', () => {
    expect(cpfLookupHash('40442820135')).toBe(cpfLookupHash('40442820135'));
    expect(cpfLookupHash('40442820135')).not.toBe('40442820135');
    expect(() => decryptCpf('invalid')).toThrow('CPF ciphertext inválido');
    process.env.CPF_ENCRYPTION_KEY = 'bad';
    expect(() => encryptCpf('40442820135')).toThrow('CPF_ENCRYPTION_KEY');
    process.env.CPF_ENCRYPTION_KEY = '11'.repeat(32);
    process.env.CPF_HASH_KEY = 'bad';
    expect(() => cpfLookupHash('40442820135')).toThrow('CPF_HASH_KEY');
  });
});
