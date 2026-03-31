// =============================================================
// backend/src/controllers/chatController.ts
// Controller do chatbot — Gemini + RAG — tipado com TypeScript
// =============================================================

import { Request, Response } from 'express';
import { GoogleGenerativeAI, Content } from '@google/generative-ai';
import { retrieve, formatarContexto, KnowledgeDoc } from '../rag/retriever';

// ── Tipos ─────────────────────────────────────────────────────

interface ChatRequestBody {
  message:  string;
  history?: Content[];  // Formato nativo do Gemini: { role, parts }[]
}

interface RagMeta {
  documentosUsados: number;
  fontes: Array<{ id: string; titulo: string; score: number }>;
}

interface ChatResponseBody {
  success:        boolean;
  reply?:         string;
  rag?:           RagMeta;
  updatedHistory?: Content[];
  error?:         string;
}

// ── Gemini client (inicializado uma vez) ──────────────────────

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// ── System Prompt base ────────────────────────────────────────

const SYSTEM_PROMPT_BASE = `
Você é o PetBot, assistente virtual da plataforma Pet Joyful — uma rede social
dedicada à adoção responsável, cuidados com animais e conexão entre adotantes,
ONGs e clínicas veterinárias.

INSTRUÇÕES:
- Você receberá um CONTEXTO com informações relevantes antes de cada pergunta.
- USE SEMPRE o contexto fornecido para embasar sua resposta.
- Se o contexto não for suficiente, use seu conhecimento geral mas deixe claro.
- Para questões médicas graves, SEMPRE recomende consultar um veterinário.
- Não invente informações — seja honesto sobre os limites do seu conhecimento.
- Responda SEMPRE em português brasileiro.
- Seja amigável, empático e use linguagem simples.
- Use emojis ocasionalmente 🐾
- Máximo 3-4 parágrafos por resposta.
- Se a pergunta for fora do escopo de pets/Pet Joyful, redirecione gentilmente.
`;

// ── Controller ────────────────────────────────────────────────

export const sendMessage = async (
  req: Request<{}, ChatResponseBody, ChatRequestBody>,
  res: Response<ChatResponseBody>
): Promise<Response> => {

  const { message, history = [] } = req.body;

  // Validação
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ success: false, error: 'O campo "message" é obrigatório e não pode ser vazio.' });
  }
  if (message.length > 2000) {
    return res.status(400).json({ success: false, error: 'A mensagem não pode ter mais de 2000 caracteres.' });
  }

  try {
    // ── 1. RAG: recupera documentos relevantes ────────────────
    const docsRelevantes: KnowledgeDoc[] = retrieve(message, 3);
    const contexto: string               = formatarContexto(docsRelevantes);

    // ── 2. Monta system prompt com contexto injetado ──────────
    const systemPrompt: string = contexto
      ? `${SYSTEM_PROMPT_BASE}

========================================
CONTEXTO DA BASE DE CONHECIMENTO:
========================================
${contexto}
========================================
Use as informações acima para responder com precisão.`
      : `${SYSTEM_PROMPT_BASE}

Nota: Não foram encontradas informações específicas na base de conhecimento.
Responda com conhecimento geral sobre pets.`;

    // ── 3. Chama o Gemini ─────────────────────────────────────
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: systemPrompt,
    });

    const chat = model.startChat({
      history,
      generationConfig: { maxOutputTokens: 1000, temperature: 0.5 },
    });

    console.log(`📨 [Chat] "${message.substring(0, 60)}" | RAG: ${docsRelevantes.length} docs`);

    const result   = await chat.sendMessage(message);
    const botReply = result.response.text();

    // ── 4. Monta e retorna resposta ───────────────────────────
    const updatedHistory: Content[] = [
      ...history,
      { role: 'user',  parts: [{ text: message }] },
      { role: 'model', parts: [{ text: botReply }] },
    ];

    const ragMeta: RagMeta = {
      documentosUsados: docsRelevantes.length,
      fontes: docsRelevantes.map((d) => ({
        id:     d.id,
        titulo: d.titulo,
        score:  d.score ?? 0,
      })),
    };

    return res.status(200).json({
      success:        true,
      reply:          botReply,
      rag:            ragMeta,
      updatedHistory,
    });

  } catch (err: unknown) {
    const error = err as Error;
    console.error('❌ [Chat] Erro:', error.message);

    if (error.message?.includes('429') || error.message?.includes('quota'))
      return res.status(429).json({ success: false, error: 'Muitas requisições. Aguarde um momento.' });

    if (error.message?.includes('API_KEY') || error.message?.includes('401'))
      return res.status(500).json({ success: false, error: 'Erro de configuração. Contate o suporte.' });

    if (error.message?.includes('SAFETY') || error.message?.includes('blocked'))
      return res.status(400).json({ success: false, error: 'Mensagem bloqueada pelos filtros de segurança.' });

    return res.status(500).json({ success: false, error: 'Erro ao processar sua mensagem. Tente novamente.' });
  }
};