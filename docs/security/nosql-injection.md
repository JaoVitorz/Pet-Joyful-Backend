# Proteção contra NoSQL injection

O backend usa MongoDB/Mongoose. As rotas validam o formato e a lista de campos permitidos antes de consultar o banco. Objetos, arrays, operadores com `$`, nomes de campo com ponto, propriedades de protótipo, atualizações vazias e IDs que não sejam ObjectId hexadecimal de 24 caracteres são rejeitados com HTTP 400.

As atualizações são montadas pelo servidor com `$set` e `runValidators: true`; os campos de autoria e propriedade vêm do token e não do corpo. O `sanitizeFilter` do Mongoose fica ligado. Operadores necessários em filtros internos são marcados como confiáveis apenas no código do servidor. O serviço de posts aplica a mesma guarda e apaga arquivos enviados quando a validação falha.

## Verificação automatizada

```powershell
npm ci
npm ci --prefix services/messages-service
npm run test:coverage -- --runInBand --silent
npx tsc --noEmit
npm run build
```

## Verificação manual

Use uma base local/de teste, nunca a base de produção. Faça uma chamada normal de login e uma publicação/mensagem normal para confirmar que entradas legítimas continuam funcionando. Depois envie um JSON de tentativa de operador:

```json
{"email":{"$ne":null},"senha":"qualquer-coisa"}
```

`POST /api/auth/login` deve responder 400 e não autenticar. Teste também uma atualização como `{"mensagem":{"$set":"alterado"}}`: deve responder 400 e não alterar o registro. Chaves adicionais como `{"nome":"Ana","tipo":"admin"}` são rejeitadas nas rotas de perfil/usuário não autorizadas.

Por fim, teste texto legítimo como `{"mensagem":"O brinquedo do Toby custa $5"}`. Apóstrofos e cifrões dentro de uma string são permitidos; o sistema rejeita estrutura de operador, não esses caracteres no texto.
