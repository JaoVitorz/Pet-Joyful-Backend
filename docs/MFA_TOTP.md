# MFA via TOTP

## Configuração

Defina `MFA_ENCRYPTION_KEY` no backend antes de permitir a ativação do MFA. O valor deve ser uma chave aleatória de 32 bytes em hexadecimal (64 caracteres). Gere uma vez com `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"` e guarde no gerenciador de segredos do ambiente. A mesma chave deve estar disponível a todas as instâncias do backend. Sem ela, as operações TOTP falham fechadas. Não substitua a chave sem migrar os segredos cifrados dos usuários; a troca direta impede a validação dos fatores existentes.

O servidor e os dispositivos autenticadores devem manter o relógio sincronizado. O código tem seis dígitos, período de 30 segundos e tolerância de um período para cada lado.

## Contrato HTTP

Os endpoints protegidos usam `Authorization: Bearer <token>` com um JWT de acesso. O token de desafio do login serve apenas em `/api/auth/mfa/verify`.

| Método | Caminho | Corpo | Resposta principal |
| --- | --- | --- | --- |
| GET | `/api/auth/mfa` | — | `{ "enabled": boolean }` |
| POST | `/api/auth/mfa/setup` | `{ "password": "..." }` | `{ "secret": "...", "otpauthUrl": "...", "expiresAt": "..." }` |
| DELETE | `/api/auth/mfa/setup` | — | `204` |
| POST | `/api/auth/mfa/confirm` | `{ "code": "123456" }` | `{ "enabled": true, "recoveryCodes": [...], "token": "..." }` |
| POST | `/api/auth/login` | `{ "email": "...", "senha": "..." }` | Sem MFA: `{ "token": "...", "user": {...} }`; com MFA: `{ "mfaRequired": true, "challengeToken": "..." }` |
| GET | `/api/auth/session` | Bearer JWT | `{ "active": true, "userId": "..." }`; serviços podem consultar para conferir revogação |
| POST | `/api/auth/mfa/verify` | `{ "challengeToken": "...", "code": "123456" }` ou `{ "challengeToken": "...", "recoveryCode": "..." }` | `{ "token": "...", "user": {...} }` |
| POST | `/api/auth/mfa/recovery-codes` | `{ "password": "...", "code": "123456" }` ou código de recuperação | `{ "recoveryCodes": [...], "token": "..." }` |
| POST | `/api/auth/mfa/disable` | `{ "password": "...", "code": "123456" }` ou código de recuperação | `{ "enabled": false, "token": "..." }` |

O frontend pode renderizar o QR code a partir de `otpauthUrl`; a chave manual é `secret`. Esses valores são mostrados apenas durante a configuração. Os códigos de recuperação são mostrados apenas quando gerados ou regenerados. Após ativação, desativação ou regeneração, substitua o JWT armazenado pelo `token` da resposta: a versão anterior da sessão é revogada.

## Propriedades de segurança

* O segredo TOTP é cifrado com AES-256-GCM antes de persistir e não aparece nas consultas ou respostas de perfil.
* Códigos de recuperação usam 128 bits aleatórios, são armazenados por hash e consumidos uma única vez por operação atômica.
* O desafio expira em cinco minutos e é de uso único. Um novo login substitui o desafio anterior. Ele usa uma chave de assinatura derivada e separada da chave dos JWTs de acesso, por isso microsserviços que validam apenas `JWT_SECRET` também o rejeitam.
* Cinco falhas de segundo fator bloqueiam novas tentativas por 15 minutos.
* A versão de sessão muda após ativar, regenerar códigos ou desativar MFA. Os validadores do backend e do serviço de mensagens conferem a versão e o estado do fator.

Em produção, configurar HTTPS e evitar registrar corpos de requisição ou respostas dos endpoints MFA. O fluxo de redefinição usa o código de recuperação com senha; não há redefinição automática por email.

## Ordem de implantação

1. Configurar `MFA_ENCRYPTION_KEY` no backend de cada ambiente e implantar o backend com `/api/auth/session`.
2. Publicar os serviços de posts e perfil com `JWT_SECRET` igual ao do backend e `AUTH_API_URL` apontando para o backend de autenticação (por padrão, `https://pet-joyful-backend.onrender.com`). Esses serviços consultam `/api/auth/session` a cada requisição protegida e negam acesso se a consulta falhar. Usar Node.js 18 ou superior, pois a consulta usa `fetch` nativo. O serviço de mensagens deste repositório confere a versão no banco compartilhado.
3. Publicar o app Expo da branch `develop` do repositório `Tela-Login-e-Cadastro-React-Native`. Ele usa `EXPO_PUBLIC_API_URL` para acessar o backend e mostra a configuração TOTP em Perfil > Segurança.
4. Validar o fluxo completo em homologação antes de habilitar MFA para usuários de produção. O app e os microsserviços foram testados localmente, mas dependem de os serviços atualizados e a chave de criptografia estarem publicados para o teste ponta a ponta.
