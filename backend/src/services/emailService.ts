import nodemailer from 'nodemailer';
import {logger} from '../logger/logger.js';

const getTransport = () => {
  const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS} = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {user: SMTP_USER, pass: SMTP_PASS},
  });
};

export const sendVerificationEmail = async (
  email: string,
  token: string,
): Promise<void> => {
  const baseUrl = (process.env.EMAIL_VERIFICATION_URL || process.env.API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');
  const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  const transport = getTransport();

  if (!transport) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SMTP não configurado. Defina SMTP_HOST, SMTP_PORT, SMTP_USER e SMTP_PASS.');
    }
    logger.info('Link de verificação de e-mail (desenvolvimento)', {email, verificationUrl});
    return;
  }

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
    to: email,
    subject: 'Confirme seu e-mail - Pet Joyful',
    text: `Para ativar sua conta Pet Joyful, acesse: ${verificationUrl}\nEste link expira em 24 horas.`,
    html: `<p>Para ativar sua conta Pet Joyful, confirme seu endereço de e-mail:</p><p><a href="${verificationUrl}">Confirmar meu e-mail</a></p><p>Este link expira em 24 horas.</p>`,
  });
};
