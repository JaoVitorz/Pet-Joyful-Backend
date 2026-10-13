import {Router} from 'express';
import {
  register,
  login,
  getSession,
  getProfile,
  updateProfile,
  deleteProfile,
  validateCpf,
} from '../controllers/authController.js';
import ensureAuth from '../middlewares/ensureAuth.js';
import verifyToken, {verifyDeletionToken} from '../middlewares/verifyToken.js';
import {cpfRateLimit} from '../middlewares/cpfRateLimit.js';
import {status as mfaStatus, setup as mfaSetup, cancelSetup as mfaCancelSetup,
  confirmSetup as mfaConfirmSetup, verifyChallenge as mfaVerifyChallenge,
  regenerateRecovery as mfaRegenerateRecovery, disable as mfaDisable} from '../controllers/mfaController.js';

const router = Router();

// #swagger.tags = ['Auth']
// #swagger.summary = 'Registrar novo usuário'
router.post('/register', cpfRateLimit, register);

// Validação prévia para a tela de cadastro; o registro valida novamente.
router.post('/validate-cpf', cpfRateLimit, validateCpf);

// #swagger.tags = ['Auth']
// #swagger.summary = 'Login do usuário'
router.post('/login', login);
router.get('/session', verifyToken, getSession);

// #swagger.tags = ['MFA']
// #swagger.summary = 'Concluir desafio MFA após login com senha'
router.post('/mfa/verify', mfaVerifyChallenge);

// #swagger.tags = ['MFA']
// #swagger.security = [{ "BearerAuth": [] }]
router.get('/mfa', verifyToken, mfaStatus);
router.post('/mfa/setup', verifyToken, mfaSetup);
router.delete('/mfa/setup', verifyToken, mfaCancelSetup);
router.post('/mfa/confirm', verifyToken, mfaConfirmSetup);
router.post('/mfa/recovery-codes', verifyToken, mfaRegenerateRecovery);
router.post('/mfa/disable', verifyToken, mfaDisable);

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
router.delete('/me', verifyDeletionToken, deleteProfile);

export default router;
