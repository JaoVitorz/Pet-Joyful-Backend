// backend/src/controllers/chatController.ts

import {GoogleGenAI} from '@google/genai';
import type {Request, Response} from 'express';

const SYSTEM_PROMPT = `
Você é o PetBot, assistente virtual da plataforma Pet Joyful — uma rede social
dedicada à adoção responsável, cuidados com animais e conexão entre adotantes,
ONGs e clínicas veterinárias.

Suas responsabilidades:
- Ajudar usuários com dúvidas sobre adoção de pets
- Dar orientações gerais sobre cuidados com animais (alimentação, saúde, comportamento)
- Informar sobre como usar a plataforma Pet Joyful
- Incentivar a adoção responsável

Regras importantes:
- Seja sempre amigável, empático e use linguagem simples
- Use emojis ocasionalmente para tornar a conversa mais leve 🐾
- Para questões médicas graves, SEMPRE recomende consultar um veterinário
- Não invente informações médicas
- Responda SEMPRE em português brasileiro
- Mantenha respostas objetivas (máximo 3-4 parágrafos)
- Se a pergunta for fora do escopo de pets e Pet Joyful, redirecione gentilmente
`;

export const sendMessage = async (req: Request, res: Response): Promise<Response> => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const {message} = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res
      .status(400)
      .json({success: false, error: 'O campo "message" é obrigatório.'});
  }

  if (message.length > 2000) {
    return res.status(400).json({
      success: false,
      error: 'Mensagem muito longa. Máximo 2000 caracteres.',
    });
  }

  if (!apiKey) {
    return res.status(500).json({
      success: false,
      error: 'GEMINI_API_KEY não configurada no servidor.',
    });
  }

  try {
    const ai = new GoogleGenAI({apiKey});
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `${SYSTEM_PROMPT}\n\nPergunta do usuário: ${message}`,
    });
    const reply = response.text ?? 'Não consegui gerar resposta agora.';

    console.log(`📨 [PetBot] Mensagem: "${message.substring(0, 50)}"`);

    return res.status(200).json({success: true, reply});
  } catch (err: unknown) {
    const error = err as Error;
    console.error('❌ [PetBot] Erro:', error.message);

    if (error.message?.includes('429'))
      return res.status(429).json({
        success: false,
        error: 'Limite de requisições atingido. Aguarde e tente novamente.',
      });

    if (
      error.message?.includes('API_KEY') ||
      error.message?.includes('401') ||
      error.message?.includes('403')
    )
      return res.status(500).json({
        success: false,
        error: 'Erro de configuração da chave Gemini.',
      });

    return res
      .status(500)
      .json({success: false, error: 'Erro ao processar sua mensagem.'});
  }
};