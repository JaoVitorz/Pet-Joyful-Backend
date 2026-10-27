import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import {createPost, removeUserMedia} from '../controllers/postsController.js';
import requireUser, {requireActiveUser, requireDeletionUser} from '../middlewares/requireUser.js';
import {uploadsDir} from '../uploads.js';
import inputGuard, {validatePostBody} from '../middlewares/inputGuard.js';

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
    const candidateExt = path.extname(file.originalname).toLowerCase();
    const ext = /^\.[a-z0-9]{1,8}$/.test(candidateExt) ? candidateExt : '';
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {fileSize: 10 * 1024 * 1024},
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.mimetype)) cb(null, true);
    else cb(Object.assign(new Error('Tipo de arquivo inválido'), {code: 'INVALID_FILE_TYPE'}));
  },
});

// POST /api/posts - cria post com titulo, descricao e opcionalmente imagem
router.post('/', requireUser, requireActiveUser, upload.single('image'), inputGuard, validatePostBody, createPost);
router.delete('/me/media', requireUser, requireDeletionUser, removeUserMedia);

export default router;
