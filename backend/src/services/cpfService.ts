// Confere apenas os dígitos verificadores; não consulta a base da Receita Federal.
export function normalizeCpf(value: unknown): string | null {
  if (typeof value !== 'string' || !/^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/.test(value)) {
    return null;
  }
  const cpf = value.replace(/\D/g, '');
  if (/^(\d)\1{10}$/.test(cpf)) return null;

  for (let length = 9; length <= 10; length++) {
    const sum = cpf.slice(0, length).split('').reduce(
      (total, digit, index) => total + Number(digit) * (length + 1 - index),
      0,
    );
    const remainder = (sum * 10) % 11;
    if (Number(cpf[length]) !== (remainder === 10 ? 0 : remainder)) return null;
  }
  return cpf;
}
