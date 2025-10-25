import { Router } from "express";
import { register, login } from "../controllers/authController.js";

const router = Router();

// Rotas de autenticação
router.post("/register", register);
router.post("/login", login);

export default router;