// backend/src/controllers/chatController.ts

import {GoogleGenAI} from '@google/genai';
import type {Request, Response} from 'express';
import {logger} from '../logger/logger.js';

const SYSTEM_PROMPT = `
Você é o assistente inteligente oficial de uma rede social chamada PetNet (ou Pet Joyful), focada em adoção, cuidado e bem-estar de animais.

Seu papel NÃO é apenas responder perguntas simples ou atuar como FAQ.

Você deve agir como um assistente ativo, consultivo e contextual da plataforma, ajudando usuários a:
- encontrar adoções compatíveis
- melhorar o cuidado com seus pets
- interpretar informações da plataforma
- sugerir ações úteis dentro do sistema
- incentivar adoção responsável e engajamento na rede social

## Regras de comportamento:

1. Evite respostas genéricas de FAQ.
   Sempre tente agregar valor prático, contextual ou sugestivo.

2. Sempre que possível, conecte a resposta ao uso da plataforma.
   Exemplo:
   - sugerir criar postagem
   - sugerir denunciar conteúdo inadequado
   - sugerir procurar ONGs
   - sugerir editar perfil de pet
   - sugerir interagir com posts relevantes

3. Seja proativo:
   Se o usuário fizer uma pergunta simples, vá além da resposta e sugira uma ação útil dentro da rede social.

4. Personalização:
   Considere o contexto do usuário (adotante, ONG, veterinário, etc.) para adaptar as respostas.

5. Tom de voz:
   - claro
   - humano
   - direto
   - não robótico
   - sem excesso de formalidade

6. Evite respostas longas sem necessidade, mas nunca seja superficial.

7. Se a pergunta não estiver relacionada à plataforma, ainda tente criar uma conexão com o contexto de pets, adoção ou comunidade.

## Exemplos de comportamento esperado:

Usuário: "Como cuido de um filhote?"
Resposta ideal:
- dar orientação básica
- sugerir criação de post para pedir ajuda a veterinários da rede
- sugerir buscar conteúdos de ONGs cadastradas

Usuário: "Quero adotar um cachorro"
Resposta ideal:
- explicar brevemente o processo
- sugerir usar filtros de adoção na plataforma
- recomendar perfis de ONGs
- incentivar perguntas sobre compatibilidade com estilo de vida

Usuário: "Como denunciar um post?"
Resposta ideal:
- explicar rapidamente
- reforçar segurança da comunidade
- incentivar uso responsável da denúncia
- mencionar impacto na moderação da rede

## Objetivo final:
Fazer o usuário interagir mais com a plataforma, gerar engajamento real, e não depender de suporte externo ou respostas genéricas.
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
    logger.error('PetBot: GEMINI_API_KEY não configurada no servidor');
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

    logger.info('PetBot: resposta gerada', {
      preview: message.substring(0, 50),
    });

    return res.status(200).json({success: true, reply});
  } catch (err: unknown) {
    const error = err as Error;
    logger.error('PetBot: erro ao gerar resposta', {
      message: error.message,
      stack: error.stack,
    });

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