# Compatibilidade com IA

`POST /api/compatibilidade` recebe `{ "adopter": {...}, "pet": {...} }` e responde `{ "success": true, "result": { "score": 80, "assessment": "...", "alerts": [], "tips": ["..."] } }`.

Adotante: `livingSpace`, `experience` e `timeAvailable` são obrigatórios (até 100 caracteres cada); `familyComposition` aceita até 500 e `lifestyle` até 1000.

Pet: `type` (até 100) e `breed` (até 200; pode ser descrição/SRD) são obrigatórios; `temperament` aceita até 500, `energy` até 100, `specialNeeds` e `description` até 1000 cada. Campos opcionais ausentes são normalizados para texto vazio.

Configurar `GEMINI_API_KEY` somente no backend. `GEMINI_COMPATIBILITY_MODEL` é opcional e usa `gemini-2.5-flash` por padrão. O endpoint solicita JSON estruturado e valida a resposta antes de devolvê-la. A chamada é cancelada após 30 segundos. A pontuação é orientativa, sem fórmula fixa ou garantia de sucesso da adoção.

Erros usam `{ "success": false, "error": "mensagem" }`: 400 para entrada inválida, 429 para limite de uso, 502 para resposta inválida da IA, 503 para configuração/serviço indisponível e 504 para timeout. O limitador global da API também se aplica a essa rota.

No servidor Next.js, configurar `COMPATIBILITY_API_URL` com a URL base do backend do ambiente (por exemplo, `http://localhost:5000`). A rota web deve aguardar mais de 30 segundos para receber o erro de timeout do backend. Nenhuma chave do Gemini deve ser enviada ao navegador.

Teste local sem consumo da API: `npm test -- --runInBand test/unit/compatibility.spec.ts`.
