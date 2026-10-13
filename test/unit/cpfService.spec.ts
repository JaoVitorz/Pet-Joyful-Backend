import {normalizeCpf} from '../../backend/src/services/cpfService';

describe('Dígitos verificadores do CPF', () => {
  it('aceita CPF válido com ou sem máscara', () => {
    expect(normalizeCpf('404.428.201-35')).toBe('40442820135');
    expect(normalizeCpf('40442820135')).toBe('40442820135');
  });

  it('rejeita sequência repetida, dígitos errados e formato incorreto', () => {
    expect(normalizeCpf('111.111.111-11')).toBeNull();
    expect(normalizeCpf('404.428.201-36')).toBeNull();
    expect(normalizeCpf('404 428 201 35')).toBeNull();
    expect(normalizeCpf(undefined)).toBeNull();
  });
});
