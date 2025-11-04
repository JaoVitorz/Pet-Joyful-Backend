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
import { ensureAuth } from "../../shared/ensureAuth.js";
import { ensureAdminKey } from "../../shared/ensureAdminKey.js";

const router = Router();

router.post("/post", createPostMessage);
router.get("/post", ensureAdminKey, getPostMessages);
router.put("/post/:id", ensureAdminKey, updatePostMessage);
router.delete("/post/:id", ensureAdminKey, deletePostMessage);

router.post("/denuncia", createDenuncia);
router.get("/denuncia", ensureAdminKey, getDenuncias);
router.put("/denuncia/:id", ensureAdminKey, updateDenuncia);
router.delete("/denuncia/:id", ensureAdminKey, deleteDenuncia);

export default router;
