# APIs Testadas por Arquivo

## Arquivo 1 — User (`userController.spec.ts`)

Testa os endpoints de **gerenciamento de usuários**, que exigem a chave de admin (`x-admin-key`) para funcionar.

| # | Método | Rota | O que faz |
|---|--------|------|-----------|
| API 7 | `POST` | `/api/users` | Criar usuário |
| API 8 | `GET` | `/api/users` | Listar todos os usuários |
| API 9 | `GET` | `/api/users/:id` | Buscar um usuário por ID |
| API 10 | `PUT` | `/api/users/:id` | Atualizar um usuário |
| API 11 | `DELETE` | `/api/users/:id` | Deletar um usuário |

**Total: 5 endpoints — 15 testes individuais**

---

## Arquivo 2 — Auth (`authController.spec.ts`)

Testa os endpoints de **autenticação**, como registro, login e operações no perfil do usuário logado.

| # | Método | Rota | O que faz |
|---|--------|------|-----------|
| API 1 | `POST` | `/api/auth/register` | Cadastrar novo usuário |
| API 2 | `POST` | `/api/auth/login` | Fazer login |
| API 3 | `GET` | `/api/auth/me` | Ver perfil do usuário logado |
| API 4 | `PUT` | `/api/auth/me` | Atualizar perfil do usuário logado |
| API 5 | `DELETE` | `/api/auth/me` | Deletar conta do usuário logado |

**Total: 5 endpoints — 18 testes individuais**

---

## Arquivo 3 — Messages (`messagesController.spec.ts`)

Testa os endpoints de **mensagens e denúncias**, cobrindo criação, listagem, atualização e remoção dos dois recursos.

| # | Método | Rota | O que faz |
|---|--------|------|-----------|
| API 1 | `POST` | `/api/messages/post` | Criar mensagem |
| API 2 | `GET` | `/api/messages/post` | Listar mensagens |
| API 3 | `POST` | `/api/messages/denuncia` | Criar denúncia |
| API 4 | `GET` | `/api/messages/denuncia` | Listar denúncias |
| API 5 | `PUT` | `/api/messages/post/:id` | Atualizar mensagem |
| API 6 | `DELETE` | `/api/messages/post/:id` | Deletar mensagem |
| API 7 | `PUT` | `/api/messages/denuncia/:id` | Atualizar denúncia |
| API 8 | `DELETE` | `/api/messages/denuncia/:id` | Deletar denúncia |

**Total: 8 endpoints — 19 testes individuais**

---

## Arquivo 4 — Middleware (`verifyApiKey.spec.ts`)

Testa o middleware de **verificação da chave de API**, garantindo que só passa quem tem a chave certa.

| # | O que testa |
|---|-------------|
| Teste 1 | Bloqueia a requisição e retorna 403 se a chave estiver errada |
| Teste 2 | Deixa passar e chama o next se a chave estiver correta |

**Total: 1 middleware — 2 testes individuais**

---

## Resumo Geral

| Arquivo | Endpoints | Testes |
|---------|-----------|--------|
| User | 5 | 15 |
| Auth | 5 | 18 |
| Messages | 8 | 19 |
| Middleware | 1 | 2 |
| **Total** | **19** | **54** |