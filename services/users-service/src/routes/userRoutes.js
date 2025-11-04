import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { ensureAuth } from "../../shared/ensureAuth.js";
import { ensureAdminKey } from "../../shared/ensureAdminKey.js";

const router = Router();

/**
 * Users routes
 */
router.post("/", ensureAdminKey, createUser);
router.get("/", ensureAdminKey, getUsers);
router.get("/:id", ensureAdminKey, getUserById);
router.put("/:id", ensureAdminKey, updateUser);
router.delete("/:id", ensureAdminKey, deleteUser);

export default router;
