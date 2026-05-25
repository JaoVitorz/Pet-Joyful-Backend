import {Router} from 'express';
import {sendMessage} from '../controllers/chatController.js';

const router: Router = Router();

/*
  #swagger.tags = ['Chat']
  #swagger.summary = 'Enviar mensagem para o chat com IA (Gemini)'
  #swagger.description = 'Envia uma pergunta sobre pets para o modelo Gemini e retorna a resposta gerada pela IA.'
  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ChatRequest" }
      }
    }
  }
  #swagger.responses[200] = {
    description: "Resposta gerada pela IA com sucesso",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/ChatResponse" }
      }
    }
  }
  #swagger.responses[500] = {
    description: "Erro interno ao processar a mensagem",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            error: { type: "string", example: "Erro ao processar mensagem" }
          }
        }
      }
    }
  }
*/
router.post('/', sendMessage);

/*
  #swagger.tags = ['Chat']
  #swagger.summary = 'Health check do serviço de chat com IA'
  #swagger.description = 'Verifica se a integração com a Gemini API está online.'
  #swagger.responses[200] = {
    description: "Serviço online",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "🤖 Gemini API online!" }
          }
        }
      }
    }
  }
*/
router.get('/health', (_req, res) => {
  res.json({success: true, message: '🤖 Gemini API online!'});
});

export default router;