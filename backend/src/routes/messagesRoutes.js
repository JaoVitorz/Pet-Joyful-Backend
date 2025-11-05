import { Router } from "express";
import {
  createPostMessage,
  getPostMessages,
  createDenuncia,
  getDenuncias,
  updatePostMessage,
  deletePostMessage,
  updateDenuncia,
  deleteDenuncia,
} from "../controllers/messagesController.js";
import ensureAuth from "../middlewares/ensureAuth.js";
import ensureAdminKey from "../middlewares/ensureAdminKey.js";

const router = Router();

/* 
   #swagger.tags = ['Messages']
   #swagger.summary = 'Enviar mensagem em um post'
   #swagger.requestBody = {
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/Message" }
       }
     }
   }
*/
router.post("/post", createPostMessage);

/* 
  #swagger.tags = ['Messages']
  #swagger.summary = 'Listar todas as mensagens'
*/
router.get("/post", getPostMessages);

/* 
   #swagger.tags = ['Messages']
   #swagger.summary = 'Atualizar mensagem por ID (apenas admin)'
   #swagger.security = [{ "ApiKeyAuth": [] }]
   #swagger.parameters['id'] = {
     in: 'path',
     required: true,
     schema: { type: 'string' }
   }
   #swagger.requestBody = {
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/Message" }
       }
     }
   }
*/
router.put("/post/:id", ensureAdminKey, updatePostMessage);

/* 
   #swagger.tags = ['Messages']
   #swagger.summary = 'Excluir mensagem por ID (apenas admin)'
   #swagger.security = [{ "ApiKeyAuth": [] }]
   #swagger.parameters['id'] = {
     in: 'path',
     required: true,
     schema: { type: 'string' }
   }
*/
router.delete("/post/:id", ensureAdminKey, deletePostMessage);

/* 
   #swagger.tags = ['Reports']
   #swagger.summary = 'Criar nova denúncia'
   #swagger.requestBody = {
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/Report" }
       }
     }
   }
*/
router.post("/denuncia", createDenuncia);

/* 
  #swagger.tags = ['Reports']
  #swagger.summary = 'Listar todas as denúncias (apenas admin)'
  #swagger.security = [{ "ApiKeyAuth": [] }]
*/
router.get("/denuncia", ensureAdminKey, getDenuncias);

/* 
   #swagger.tags = ['Reports']
   #swagger.summary = 'Atualizar denúncia por ID (apenas admin)'
   #swagger.security = [{ "ApiKeyAuth": [] }]
   #swagger.parameters['id'] = {
     in: 'path',
     required: true,
     schema: { type: 'string' }
   }
   #swagger.requestBody = {
     required: true,
     content: {
       "application/json": {
         schema: { $ref: "#/components/schemas/Report" }
       }
     }
   }
*/
router.put("/denuncia/:id", ensureAdminKey, updateDenuncia);

/* 
   #swagger.tags = ['Reports']
   #swagger.summary = 'Excluir denúncia por ID (apenas admin)'
   #swagger.security = [{ "ApiKeyAuth": [] }]
   #swagger.parameters['id'] = {
     in: 'path',
     required: true,
     schema: { type: 'string' }
   }
*/
router.delete("/denuncia/:id", ensureAdminKey, deleteDenuncia);

export default router;
