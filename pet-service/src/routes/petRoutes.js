import { Router } from "express";
import {
  createPet,
  getPets,
  getPetById,
  getPetsByOwner,
  updatePet,
  deletePet
} from "../controllers/petController.js";

const router = Router();

router.post("/", createPet);                     // CREATE
router.get("/", getPets);                        // READ ALL
router.get("/:id", getPetById);                  // READ BY ID
router.get("/owner/:ownerId", getPetsByOwner);   // READ BY OWNER
router.put("/:id", updatePet);                   // UPDATE
router.delete("/:id", deletePet);                // DELETE

export default router;