import { Router } from "express";
import {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import ensureAuth from "../middlewares/ensureAuth.js";

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
router.post("/", ensureAuth, createUser); // Adicionado ensureAuth para verificar admin_key

/*
   #swagger.tags = ['Users']
   #swagger.summary = 'Listar todos os usuários'
*/
router.get("/", getUsers);

/*
   #swagger.tags = ['Users']
   #swagger.summary = 'Buscar usuário por ID'
   #swagger.parameters['id'] = {
     in: 'path',
     required: true,
     schema: { type: 'string' }
   }
*/
router.get("/:id", getUserById);

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
router.put("/:id", ensureAuth, updateUser);

/* #swagger.tags = ['Users']
   #swagger.summary = 'Deletar usuário por ID'
   #swagger.security = [{ "BearerAuth": [], "ApiKeyAuth": [] }]
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
router.delete("/:id", ensureAuth, deleteUser); // DELETE - requer JWT ou chave de admin

export default router;
