import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  exportUserData,
} from "../controllers/userController.js";

import ensureAdminKey from "../middlewares/ensureAdminKey.js";
import verifyToken, {verifyDeletionToken} from "../middlewares/verifyToken.js";
import {validateObjectIdParam} from '../middlewares/inputGuard.js';

const validateUserPayload = (required: string[] = []) => (req: import('express').Request, res: import('express').Response, next: import('express').NextFunction): void => {
  const body = req.body as unknown;
  if (!body || typeof body !== 'object' || Array.isArray(body)) { res.status(400).json({error: 'Dados inválidos'}); return; }
  const data = body as Record<string, unknown>;
  const validEmail = data.email === undefined || (typeof data.email === 'string' && data.email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email));
  const validName = data.nome === undefined || (typeof data.nome === 'string' && data.nome.trim().length > 0 && data.nome.length <= 120);
  const validPassword = data.senha === undefined || (typeof data.senha === 'string' && data.senha.length >= 8 && Buffer.byteLength(data.senha, 'utf8') <= 72);
  const validType = data.tipo === undefined || ['adotante', 'cliente', 'admin'].includes(String(data.tipo));
  if (Object.keys(data).some(key => !['nome', 'email', 'senha', 'tipo'].includes(key)) || required.some(key => data[key] === undefined) ||
      !validEmail || !validName || !validPassword || !validType || (!required.length && Object.keys(data).length === 0)) {
    res.status(400).json({error: 'Dados inválidos'}); return;
  }
  next();
};

const router = Router();

/* 
   #swagger.tags = ['Users']
   #swagger.summary = 'Criar novo usuário (admin)'
   #swagger.security = [{ "ApiKeyAuth": [] }]
   #swagger.requestBody = {
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/User" }
       }
     }
   }
   #swagger.responses[403] = {
     description: "Acesso negado",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
             error: {
               type: "string",
               example: "Criação de usuário admin requer API key ou token admin"
             }
           }
         }
       }
     }
   }
*/
router.post("/", ensureAdminKey, validateUserPayload(['nome', 'email', 'senha', 'tipo']), createUser); // Apenas admin via x-admin-key

/*
  #swagger.tags = ['Users']
  #swagger.summary = 'Listar todos os usuários (apenas admin)'
  #swagger.security = [{ "ApiKeyAuth": [] }]
*/
router.get("/", ensureAdminKey, getUsers);

/*
   #swagger.tags = ['Users']
   #swagger.summary = 'Buscar usuário por ID'
   #swagger.parameters['id'] = {
     in: 'path',
     required: true,
     schema: { type: 'string' }
   }
*/
router.get("/:id", ensureAdminKey, validateObjectIdParam(), getUserById);

/* 
   #swagger.tags = ['Users']
   #swagger.summary = 'Atualizar usuário por ID'
   #swagger.security = [{ "BearerAuth": [], "ApiKeyAuth": [] }]
   #swagger.parameters['id'] = {
     in: 'path',
     required: true,
     schema: { type: 'string' }
   }
   #swagger.requestBody = {
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/User" }
       }
     }
   }
*/
router.put("/:id", ensureAdminKey, validateObjectIdParam(), validateUserPayload(), updateUser);

/* #swagger.tags = ['Users']
   #swagger.summary = 'Baixar JSON dos dados da própria conta'
   #swagger.security = [{ "BearerAuth": [] }]
   #swagger.produces = ['application/json']
*/
router.get('/:id/data-export', verifyToken, validateObjectIdParam(), exportUserData);

/* #swagger.tags = ['Users']
   #swagger.summary = 'Excluir a própria conta e tratar dados vinculados'
   #swagger.security = [{ "BearerAuth": [] }]
   #swagger.parameters['id'] = {
     in: 'path',
     required: true,
     schema: { type: 'string' }
   }
   #swagger.responses[401] = {
     description: "Unauthorized - Token JWT não fornecido ou inválido",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
             error: {
               type: "string",
               example: "Token não fornecido"
             }
           }
         }
       }
     }
   }
   #swagger.responses[403] = {
     description: "Forbidden - Usuário não tem permissão",
     content: {
       "application/json": {
         schema: {
           type: "object",
           properties: {
             error: {
               type: "string",
               example: "Você não tem permissão para deletar este usuário"
             }
           }
         }
       }
     }
   }
*/
router.delete("/:id", verifyDeletionToken, validateObjectIdParam(), deleteUser);

export default router;
