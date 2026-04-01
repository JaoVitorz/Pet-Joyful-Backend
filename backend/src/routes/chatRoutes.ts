import {Router} from 'express';
import {sendMessage} from '../controllers/chatController.js';

const router: Router = Router();

// POST /api/chat
// Body: { "message": "sua pergunta aqui" }
router.post('/', sendMessage);

// GET /api/chat/health
router.get('/health', (_req, res) => {
  res.json({success: true, message: '🤖 Gemini API online!'});
});

export default router;
