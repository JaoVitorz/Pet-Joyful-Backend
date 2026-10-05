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
import verifyToken from "../middlewares/verifyToken.js";

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
router.post("/", ensureAdminKey, createUser); // Apenas admin via x-admin-key

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
router.get("/:id", ensureAdminKey, getUserById);

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
router.put("/:id", ensureAdminKey, updateUser);

/* #swagger.tags = ['Users']
   #swagger.summary = 'Baixar JSON dos dados da própria conta'
   #swagger.security = [{ "BearerAuth": [] }]
   #swagger.produces = ['application/json']
*/
router.get('/:id/data-export', verifyToken, exportUserData);

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
router.delete("/:id", verifyToken, deleteUser);

export default router;
