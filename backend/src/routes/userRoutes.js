import { Router } from "express";
import { createUser, getUsers } from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.get("/", getUsers);

export default router;
