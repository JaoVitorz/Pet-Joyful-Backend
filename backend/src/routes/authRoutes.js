import { Router } from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/authController.js";
import ensureAuth from "../middlewares/ensureAuth.js";

const router = Router();
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo usuário e gera um token JWT automaticamente
 *     tags: [Auth]
 *     description: Cria uma nova conta e retorna o token de autenticação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: João Vitor
 *               email:
 *                 type: string
 *                 example: joaovitor@email.com
 *               senha:
 *                 type: string
 *                 example: 123456
 *               tipo:
 *                 type: string
 *                 example: tutor
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso e token JWT gerado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário registrado com sucesso!
 *                 token:
 *                   type: string
 *                   example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nome:
 *                       type: string
 *                     email:
 *                       type: string
 *                     tipo:
 *                       type: string
 */

/* 
   #swagger.tags = ['Auth']
   #swagger.summary = 'Registrar novo usuário'
   #swagger.description = 'Cria uma nova conta de usuário na plataforma.'
   #swagger.requestBody = {
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/User" }
       }
     }
   }
   #swagger.responses[201] = { description: "Usuário criado com sucesso" }
   #swagger.responses[400] = { description: "Erro de validação" }
   #swagger.responses[500] = { description: "Erro interno do servidor" }
*/
router.post("/register", register);

/* 
   #swagger.tags = ['Auth']
   #swagger.summary = 'Login do usuário'
   #swagger.description = 'Autentica o usuário e retorna o token JWT.'
   #swagger.requestBody = {
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/Login" }
       }
     }
   }
   #swagger.responses[200] = { description: "Login realizado com sucesso" }
   #swagger.responses[400] = { description: "Credenciais inválidas" }
   #swagger.responses[401] = { description: "Não autorizado" }
*/
router.post("/login", login);

/* 
   #swagger.tags = ['Auth']
   #swagger.summary = 'Obter dados do usuário autenticado'
   #swagger.security = [{ "BearerAuth": [] }]
   #swagger.responses[200] = { description: "Usuário autenticado retornado" }
   #swagger.responses[401] = { description: "Token inválido ou ausente" }
*/
router.get("/me", ensureAuth, getProfile);

/* 
   #swagger.tags = ['Auth']
   #swagger.summary = 'Atualizar dados do usuário autenticado'
   #swagger.security = [{ "BearerAuth": [] }]
   #swagger.requestBody = {
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/User" }
       }
     }
   }
   #swagger.responses[200] = { description: "Dados atualizados com sucesso" }
   #swagger.responses[400] = { description: "Erro de validação" }
   #swagger.responses[401] = { description: "Token inválido" }
*/
router.put("/me", ensureAuth, updateProfile);

/* 
   #swagger.tags = ['Auth']
   #swagger.summary = 'Excluir conta do usuário autenticado'
   #swagger.security = [{ "BearerAuth": [] }]
   #swagger.responses[200] = { description: "Conta excluída com sucesso" }
   #swagger.responses[401] = { description: "Token inválido" }
*/
router.delete("/me", ensureAuth, deleteProfile);

export default router;
