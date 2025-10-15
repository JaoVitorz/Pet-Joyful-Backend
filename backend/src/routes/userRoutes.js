import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);     // CREATE
router.get("/", getUsers);        // READ ALL
router.get("/:id", getUserById);  // READ BY ID
router.put("/:id", updateUser);   // UPDATE
router.delete("/:id", deleteUser); // DELETE

export default router;
