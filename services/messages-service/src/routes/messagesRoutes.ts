import { Router } from 'express';

const router = Router();

// rota de health/sample para mensagens
router.get('/', (_req, res) => {
  res.json({ message: 'messages service root' });
});

router.post('/', (_req, res) => {
  res.status(201).json({ message: 'Mensagem recebida (placeholder)' });
});

export default router;
