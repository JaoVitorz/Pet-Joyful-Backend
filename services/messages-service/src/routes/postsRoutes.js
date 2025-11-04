import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { createPost } from "../controllers/postsController.js";

const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, "..", "uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage });

// POST /api/posts - cria post com titulo, descricao e opcionalmente imagem
router.post("/", upload.single("image"), createPost);

export default router;
