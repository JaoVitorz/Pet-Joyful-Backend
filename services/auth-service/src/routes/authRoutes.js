import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/authController.js";
import { ensureAuth } from "../../shared/ensureAuth.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", ensureAuth, getProfile);
router.put("/me", ensureAuth, updateProfile);
router.delete("/me", ensureAuth, deleteProfile);

export default router;
