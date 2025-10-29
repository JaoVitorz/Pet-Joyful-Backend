import { Router } from "express";
import userRoutes from "./userRoutes.js";
import authRoutes from "./authRoutes.js";
import messagesRoutes from "./messagesRoutes.js";

const router = Router();

// Rotas principais
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/messages", messagesRoutes);

export default router;
