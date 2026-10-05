import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs';
import {createPost, removeUserMedia} from '../controllers/postsController.js';
import requireUser, {requireActiveUser} from '../middlewares/requireUser.js';
import {uploadsDir} from '../uploads.js';

const router = Router();

fs.mkdirSync(uploadsDir, {recursive: true});

const storage = multer.diskStorage({
  destination: function (
    _req: Express.Request,
    _file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void,
  ) {
    cb(null, uploadsDir);
  },
  filename: function (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void,
  ) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = file.originalname.includes('.') ? `.${file.originalname.split('.').pop()}` : '';
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({ storage });

// POST /api/posts - cria post com titulo, descricao e opcionalmente imagem
router.post('/', requireUser, requireActiveUser, upload.single('image'), createPost);
router.delete('/me/media', requireUser, removeUserMedia);

export default router;
