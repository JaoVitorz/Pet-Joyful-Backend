import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createPost } from '../controllers/postsController.js';

const router = Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '..', 'uploads');

const storage = multer.diskStorage({
  destination: function (
    _req: Express.Request,
    _file: any,
    cb: (error: Error | null, destination: string) => void,
  ) {
    cb(null, uploadsDir);
  },
  filename: function (
    _req: Express.Request,
    file: any,
    cb: (error: Error | null, filename: string) => void,
  ) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage });

// POST /api/posts - cria post com titulo, descricao e opcionalmente imagem
router.post('/', upload.single('image'), createPost);

export default router;
