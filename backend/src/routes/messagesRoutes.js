import { Router } from "express";
import {
  createPostMessage,
  getPostMessages,
  createDenuncia,
  getDenuncias,
  updatePostMessage,
  deletePostMessage,
  updateDenuncia,
  deleteDenuncia,
} from "../controllers/messagesController.js";
import ensureAuth from "../middlewares/ensureAuth.js";

const router = Router();

// Rotas de mensagens (mounted at /api/messages)
// Public: criar mensagem de post
router.post("/post", createPostMessage);
// Protected: listar mensagens (Bearer token or API key)
router.get("/post", ensureAuth, getPostMessages);
// Admin-only (via ensureAuth -> req.isApiKeyValid checked in controller)
router.put("/post/:id", ensureAuth, updatePostMessage);
router.delete("/post/:id", ensureAuth, deletePostMessage);

// Rotas de denúncias (mounted at /api/messages)
// Public: criar denúncia
router.post("/denuncia", createDenuncia);
// Protected: listar denúncias
router.get("/denuncia", ensureAuth, getDenuncias);
// Admin-only: atualizar/deletar denúncia
router.put("/denuncia/:id", ensureAuth, updateDenuncia);
router.delete("/denuncia/:id", ensureAuth, deleteDenuncia);

export default router;
