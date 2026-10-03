import {Router} from 'express';
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
  validateCpf,
} from '../controllers/authController.js';
import ensureAuth from '../middlewares/ensureAuth.js';
import {cpfRateLimit} from '../middlewares/cpfRateLimit.js';

const router = Router();

// #swagger.tags = ['Auth']
// #swagger.summary = 'Registrar novo usuário'
router.post('/register', cpfRateLimit, register);

// Validação prévia para a tela de cadastro; o registro valida novamente.
router.post('/validate-cpf', cpfRateLimit, validateCpf);

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
