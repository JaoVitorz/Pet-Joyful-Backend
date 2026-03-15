import type {Request, Response, NextFunction} from 'express';

export default function verifyApiKey(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const key =
    (req.headers['x-api-key'] as string) ||
    (req.query['api_key'] as string);

  if (!key || key !== process.env.API_KEY) {
    res.status(403).json({error: 'Chave de API inválida ou ausente.'});
    return;
  }

  next();
}
