import {Router} from 'express';
import {loginLimiter} from '../middlewares/rateLimiter.js';
import {
  register,
  login,
  getSession,
  getProfile,
  updateProfile,
  deleteProfile,
  validateCpf,
  refreshSession,
  logout,
} from '../controllers/authController.js';
import ensureAuth from '../middlewares/ensureAuth.js';
import verifyToken, {verifyDeletionToken} from '../middlewares/verifyToken.js';
import {cpfRateLimit} from '../middlewares/cpfRateLimit.js';
import {validateAuthInput, validateCpfBody, validateMfaPayload} from '../middlewares/authValidators.js';
import {validateBodyFields} from '../middlewares/inputGuard.js';
import {status as mfaStatus, setup as mfaSetup, cancelSetup as mfaCancelSetup,
  confirmSetup as mfaConfirmSetup, verifyChallenge as mfaVerifyChallenge,
  regenerateRecovery as mfaRegenerateRecovery, disable as mfaDisable} from '../controllers/mfaController.js';

const router = Router();

// #swagger.tags = ['Auth']
// #swagger.summary = 'Registrar novo usuário'
router.post('/register', cpfRateLimit, validateAuthInput('register'), register);

// Validação prévia para a tela de cadastro; o registro valida novamente.
router.post('/validate-cpf', cpfRateLimit, validateCpfBody, validateCpf);

// #swagger.tags = ['Auth']
// #swagger.summary = 'Login do usuário'
router.post('/login', loginLimiter, validateAuthInput('login'), login);
router.post('/refresh', validateBodyFields(['refreshToken'], ['refreshToken']), (req, res, next) => {
  const token = (req.body as Record<string, unknown>).refreshToken;
  if (typeof token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    res.status(400).json({error: 'Refresh token inválido'}); return;
  }
  next();
}, refreshSession);
router.post('/logout', verifyToken, validateBodyFields([]), logout);
router.get('/session', verifyToken, getSession);

// #swagger.tags = ['MFA']
// #swagger.summary = 'Concluir desafio MFA após login com senha'
router.post('/mfa/verify', validateMfaPayload(['challengeToken', 'code', 'recoveryCode'], ['challengeToken'], [['code', 'recoveryCode']]), mfaVerifyChallenge);

// #swagger.tags = ['MFA']
// #swagger.security = [{ "BearerAuth": [] }]
router.get('/mfa', verifyToken, mfaStatus);
router.post('/mfa/setup', verifyToken, validateMfaPayload(['password', 'senha'], [], [['password', 'senha']]), mfaSetup);
router.delete('/mfa/setup', verifyToken, validateBodyFields([]), mfaCancelSetup);
router.post('/mfa/confirm', verifyToken, validateMfaPayload(['code'], ['code']), mfaConfirmSetup);
router.post('/mfa/recovery-codes', verifyToken, validateMfaPayload(['password', 'senha', 'code', 'recoveryCode'], [], [['password', 'senha'], ['code', 'recoveryCode']]), mfaRegenerateRecovery);
router.post('/mfa/disable', verifyToken, validateMfaPayload(['password', 'senha', 'code', 'recoveryCode'], [], [['password', 'senha'], ['code', 'recoveryCode']]), mfaDisable);

// #swagger.tags = ['Auth']
// #swagger.summary = 'Obter dados do usuário autenticado'
// #swagger.security = [{ "BearerAuth": [] }]
router.get('/me', ensureAuth, getProfile);

// #swagger.tags = ['Auth']
// #swagger.summary = 'Atualizar dados do usuário autenticado'
// #swagger.security = [{ "BearerAuth": [] }]
router.put('/me', ensureAuth, validateAuthInput('profile'), updateProfile);

// #swagger.tags = ['Auth']
// #swagger.summary = 'Excluir conta do usuário autenticado'
// #swagger.security = [{ "BearerAuth": [] }]
router.delete('/me', verifyDeletionToken, deleteProfile);

export default router;
