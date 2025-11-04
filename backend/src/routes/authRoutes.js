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

// Rotas de autenticação
router.post(
  "/register",
  /* #swagger.tags = ['Auth']
    #swagger.description = 'Endpoint para registrar um novo usuário.'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/definitions/RegisterInput" }
        }
      }
    }
    #swagger.responses[201] = {
      description: "Usuário criado com sucesso",
      schema: { $ref: "#/definitions/AuthResponse" }
    }
*/ register
);

router.post(
  "/login",
  /* #swagger.tags = ['Auth']
    #swagger.description = 'Endpoint para fazer login e obter token JWT.'
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/definitions/LoginInput" }
        }
      }
    }
    #swagger.responses[200] = {
      description: "Login realizado com sucesso",
      schema: { $ref: "#/definitions/AuthResponse" }
    }
*/ login
);

// Perfil do usuário autenticado
router.get(
  "/me",
  /* #swagger.tags = ['Auth']
    #swagger.description = 'Endpoint para obter dados do usuário autenticado.'
    #swagger.security = [{ "BearerAuth": [] }]
*/ ensureAuth,
  getProfile
);

router.put(
  "/me",
  /* #swagger.tags = ['Auth']
    #swagger.description = 'Endpoint para atualizar dados do usuário autenticado.'
    #swagger.security = [{ "BearerAuth": [] }]
    #swagger.requestBody = {
      content: {
        "application/json": {
          schema: { $ref: "#/definitions/RegisterInput" }
        }
      }
    }
*/ ensureAuth,
  updateProfile
);

router.delete(
  "/me",
  /* #swagger.tags = ['Auth']
    #swagger.description = 'Endpoint para deletar a conta do usuário autenticado.'
    #swagger.security = [{ "BearerAuth": [] }]
*/ ensureAuth,
  deleteProfile
);

export default router;
