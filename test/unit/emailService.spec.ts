import nodemailer from 'nodemailer';
import {logger} from '../../backend/src/logger/logger';
import {sendVerificationEmail} from '../../backend/src/services/emailService';

jest.mock('nodemailer', () => ({
  __esModule: true,
  default: {createTransport: jest.fn()},
}));

const keys = [
  'NODE_ENV', 'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS',
  'SMTP_SECURE', 'SMTP_FROM', 'API_BASE_URL', 'EMAIL_VERIFICATION_URL',
] as const;
const original = Object.fromEntries(keys.map(key => [key, process.env[key]]));

beforeEach(() => {
  for (const key of keys) delete process.env[key];
});

afterEach(() => {
  for (const key of keys) {
    const value = original[key];
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
  jest.restoreAllMocks();
});

describe('Envio de confirmação de e-mail', () => {
  it('mostra o link em desenvolvimento sem SMTP', async () => {
    process.env.NODE_ENV = 'development';
    const info = jest.spyOn(logger, 'info');

    await sendVerificationEmail('user@example.com', 'token-123');

    expect(info).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        email: 'user@example.com',
        verificationUrl: 'http://localhost:5000/api/auth/verify-email?token=token-123',
      }),
    );
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });

  it('impede cadastro em produção sem SMTP', async () => {
    process.env.NODE_ENV = 'production';
    await expect(sendVerificationEmail('user@example.com', 'token'))
      .rejects.toThrow('SMTP não configurado');
  });

  it('envia pelo SMTP configurado usando a URL pública', async () => {
    Object.assign(process.env, {
      SMTP_HOST: 'smtp.example.com', SMTP_PORT: '587', SMTP_USER: 'mailer',
      SMTP_PASS: 'secret', API_BASE_URL: 'https://api.example.com/',
      SMTP_SECURE: 'false',
    });
    const sendMail = jest.fn().mockResolvedValue(undefined);
    jest.mocked(nodemailer.createTransport).mockReturnValue(
      {sendMail} as unknown as ReturnType<typeof nodemailer.createTransport>,
    );

    await sendVerificationEmail('user@example.com', 'a+b');

    expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({
      host: 'smtp.example.com', port: 587, secure: false,
    }));
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: 'mailer', to: 'user@example.com',
      text: expect.stringContaining('https://api.example.com/api/auth/verify-email?token=a%2Bb'),
    }));
  });

  it('permite URL e remetente específicos com SMTP seguro', async () => {
    Object.assign(process.env, {
      SMTP_HOST: 'smtp.example.com', SMTP_PORT: '465', SMTP_USER: 'mailer',
      SMTP_PASS: 'secret', SMTP_SECURE: 'true', SMTP_FROM: 'Pet Joyful <pet@example.com>',
      EMAIL_VERIFICATION_URL: 'https://confirm.example.com/',
    });
    const sendMail = jest.fn().mockResolvedValue(undefined);
    jest.mocked(nodemailer.createTransport).mockReturnValue(
      {sendMail} as unknown as ReturnType<typeof nodemailer.createTransport>,
    );

    await sendVerificationEmail('user@example.com', 'token');

    expect(nodemailer.createTransport).toHaveBeenCalledWith(expect.objectContaining({secure: true}));
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      from: 'Pet Joyful <pet@example.com>',
      html: expect.stringContaining('https://confirm.example.com/api/auth/verify-email?token=token'),
    }));
  });
});
