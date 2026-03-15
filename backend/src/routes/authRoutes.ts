import {Router} from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} from '../controllers/authController.js';
import ensureAuth from '../middlewares/ensureAuth.js';

const router = Router();

// #swagger.tags = ['Auth']
// #swagger.summary = 'Registrar novo usuário'
router.post('/register', register);

// #swagger.tags = ['Auth']
// #swagger.summary = 'Login do usuário'
router.post('/login', login);

// #swagger.tags = ['Auth']
// #swagger.summary = 'Obter dados do usuário autenticado'
// #swagger.security = [{ "BearerAuth": [] }]
router.get('/me', ensureAuth, getProfile);

// #swagger.tags = ['Auth']
// #swagger.summary = 'Atualizar dados do usuário autenticado'
// #swagger.security = [{ "BearerAuth": [] }]
router.put('/me', ensureAuth, updateProfile);

// #swagger.tags = ['Auth']
// #swagger.summary = 'Excluir conta do usuário autenticado'
// #swagger.security = [{ "BearerAuth": [] }]
router.delete('/me', ensureAuth, deleteProfile);

export default router;
