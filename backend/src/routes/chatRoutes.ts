// =============================================================
// backend/src/routes/chatRoutes.ts
// =============================================================

import { Router, Request, Response } from 'express';
import { sendMessage } from '../controllers/chatController';

const router: Router = Router();

// POST /api/chat
// Body: { message: string, history?: Content[] }
router.post('/', sendMessage);

// GET /api/chat/health — teste rápido sem chamar o Gemini
router.get('/health', (_req: Request, res: Response): void => {
  res.json({ success: true, message: '🐾 PetBot está online!' });
});

export default router;