import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/authController.js";
import ensureAuth from "../middlewares/ensureAuth.js";

const router = Router();

// Rotas de autenticação
router.post("/register", register);
router.post("/login", login);

// Perfil do usuário autenticado
router.get("/me", ensureAuth, getProfile);
router.put("/me", ensureAuth, updateProfile);
router.delete("/me", ensureAuth, deleteProfile);

export default router;
