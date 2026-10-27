import {Router} from 'express';
import {sendMessage} from '../controllers/chatController.js';
import verifyToken from '../middlewares/verifyToken.js';
import {directChatLimiter} from '../middlewares/rateLimiter.js';
import {validateBodyFields, validateObjectIdParam} from '../middlewares/inputGuard.js';
import {
  createConversation,
  listChatUsers,
  listConversationMessages,
  listConversations,
  markConversationRead,
  sendConversationMessage,
} from '../controllers/directChatController.js';

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
router.post('/', validateBodyFields(['message'], ['message']), (req, res, next) => {
  const message = (req.body as Record<string, unknown>).message;
  if (typeof message !== 'string' || !message.trim() || message.length > 5000) {
    res.status(400).json({error: 'Mensagem inválida'}); return;
  }
  next();
}, sendMessage);

// Conversas individuais entre usuários autenticados. O chat IA acima permanece separado.
router.get('/users', verifyToken, directChatLimiter, listChatUsers);
router.get('/conversations', verifyToken, directChatLimiter, listConversations);
router.post('/conversations', verifyToken, directChatLimiter, validateBodyFields(['userId'], ['userId']), createConversation);
router.get('/conversations/:id/messages', verifyToken, directChatLimiter, validateObjectIdParam(), listConversationMessages);
router.post('/conversations/:id/read', verifyToken, directChatLimiter, validateObjectIdParam(), validateBodyFields([]), markConversationRead);
router.post('/conversations/:id/messages', verifyToken, directChatLimiter, validateObjectIdParam(), validateBodyFields(['text'], ['text']), sendConversationMessage);

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
