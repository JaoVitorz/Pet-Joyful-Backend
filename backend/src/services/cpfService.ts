const SERPRO_BASE_URL = 'https://gateway.apiserpro.serpro.gov.br';

export type CpfCheckResult =
  | {status: 'regular'}
  | {status: 'irregular'}
  | {status: 'not_found'}
  | {status: 'invalid'}
  | {status: 'unavailable'};

let cachedToken: string | undefined;
let tokenExpiresAt = 0;

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

export function normalizeBirthDate(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day || date > new Date() || year < 1900
  ) return null;
  return `${match[1]}${match[2]}${match[3]}`;
}

async function getToken(): Promise<string | null> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;
  const key = process.env.SERPRO_CONSUMER_KEY;
  const secret = process.env.SERPRO_CONSUMER_SECRET;
  if (!key || !secret) return null;

  const response = await fetch(`${SERPRO_BASE_URL}/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) return null;
  const data = await response.json() as {access_token?: unknown; expires_in?: unknown};
  if (typeof data.access_token !== 'string') return null;
  cachedToken = data.access_token;
  const expiresIn = typeof data.expires_in === 'number' ? data.expires_in : 3600;
  tokenExpiresAt = Date.now() + Math.max(0, expiresIn - 60) * 1000;
  return cachedToken;
}

export async function checkCpf(cpf: string, birthDate: string): Promise<CpfCheckResult> {
  try {
    const token = await getToken();
    if (!token) return {status: 'unavailable'};
    const response = await fetch(
      `${SERPRO_BASE_URL}/consulta-cpf-df/v3/cpf/${cpf}/${birthDate}`,
      {headers: {Accept: 'application/json', Authorization: `Bearer ${token}`}, signal: AbortSignal.timeout(5000)},
    );
    if (response.status === 400) return {status: 'invalid'};
    if (response.status === 404) return {status: 'not_found'};
    if (response.status === 401) {
      cachedToken = undefined;
      tokenExpiresAt = 0;
      return {status: 'unavailable'};
    }
    if (response.status !== 200 && response.status !== 206) return {status: 'unavailable'};
    const data = await response.json() as {ni?: unknown; nascimento?: unknown; situacao?: {codigo?: unknown}};
    if (data.ni !== cpf || data.nascimento !== birthDate) return {status: 'unavailable'};
    if (data.situacao?.codigo === '0') return {status: 'regular'};
    if (typeof data.situacao?.codigo === 'string') return {status: 'irregular'};
    return {status: 'unavailable'};
  } catch {
    return {status: 'unavailable'};
  }
}
