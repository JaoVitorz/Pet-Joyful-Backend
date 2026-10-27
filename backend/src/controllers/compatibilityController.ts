import type {Request, Response} from 'express';
import {analyzeCompatibility, CompatibilityError, validateProfiles} from '../services/compatibilityService.js';

export async function checkCompatibility(req: Request, res: Response): Promise<Response> {
  try {
    const profiles = validateProfiles(req.body);
    return res.json({success: true, result: await analyzeCompatibility(profiles)});
  } catch (error: unknown) {
    if (error instanceof CompatibilityError) return res.status(error.status).json({success: false, error: error.message});
    const upstream = error as {status?: number; name?: string};
    if (upstream?.status === 429) return res.status(429).json({success: false, error: 'Limite de análises atingido. Aguarde e tente novamente.'});
    if (upstream?.name === 'TimeoutError' || upstream?.name === 'AbortError' || upstream?.status === 504 || upstream?.status === 408) {
      return res.status(504).json({success: false, error: 'A análise demorou demais. Tente novamente.'});
    }
    return res.status(503).json({success: false, error: 'Não foi possível analisar agora. Tente novamente mais tarde.'});
  }
}
