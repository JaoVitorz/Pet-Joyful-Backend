import {Router} from 'express';
import {
  createPostMessage,
  getPostMessages,
  createDenuncia,
  getDenuncias,
  updatePostMessage,
  deletePostMessage,
  updateDenuncia,
  deleteDenuncia,
} from '../controllers/messagesController.js';
import ensureAdminKey from '../middlewares/ensureAdminKey.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = Router();

// #swagger.tags = ['Messages']
// #swagger.summary = 'Enviar mensagem em um post'
// #swagger.security = [{ "BearerAuth": [] }]
router.post('/post', verifyToken, createPostMessage);

// #swagger.tags = ['Messages']
// #swagger.summary = 'Listar todas as mensagens'
router.get('/post', getPostMessages);

// #swagger.tags = ['Messages']
// #swagger.summary = 'Atualizar mensagem por ID (apenas admin)'
router.put('/post/:id', ensureAdminKey, updatePostMessage);

// #swagger.tags = ['Messages']
// #swagger.summary = 'Excluir mensagem por ID (apenas admin)'
router.delete('/post/:id', ensureAdminKey, deletePostMessage);

// #swagger.tags = ['Reports']
// #swagger.summary = 'Criar nova denúncia'
// #swagger.security = [{ "BearerAuth": [] }]
router.post('/denuncia', verifyToken, createDenuncia);

// #swagger.tags = ['Reports']
// #swagger.summary = 'Listar todas as denúncias (apenas admin)'
router.get('/denuncia', ensureAdminKey, getDenuncias);

// #swagger.tags = ['Reports']
// #swagger.summary = 'Atualizar denúncia por ID (apenas admin)'
router.put('/denuncia/:id', ensureAdminKey, updateDenuncia);

// #swagger.tags = ['Reports']
// #swagger.summary = 'Excluir denúncia por ID (apenas admin)'
router.delete('/denuncia/:id', ensureAdminKey, deleteDenuncia);

export default router;
