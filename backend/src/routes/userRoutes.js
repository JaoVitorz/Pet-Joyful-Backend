import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import ensureAuth from "../middlewares/ensureAuth.js";

const router = Router();

router.post("/", createUser); // CREATE
router.get("/", getUsers); // READ ALL
router.get("/:id", getUserById); // READ BY ID
// Protegendo rotas de atualização e remoção: somente o próprio usuário ou chave de API (admin) podem executar
router.put("/:id", ensureAuth, updateUser); // UPDATE
router.delete("/:id", ensureAuth, deleteUser); // DELETE

export default router;
