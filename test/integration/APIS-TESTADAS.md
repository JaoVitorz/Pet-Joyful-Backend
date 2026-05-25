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

**Total: 5 endpoints — 18 testes individuais**

---

## Arquivo 2 — Auth 

Testa os endpoints de **autenticação**, como registro, login e operações no perfil do usuário logado.

| # | Método | Rota | O que faz |
|---|--------|------|-----------|
| API 1 | `POST` | `/api/auth/register` | Cadastrar novo usuário |
| API 2 | `POST` | `/api/auth/login` | Fazer login |
| API 3 | `GET` | `/api/auth/me` | Ver perfil do usuário logado |
| API 4 | `PUT` | `/api/auth/me` | Atualizar perfil do usuário logado |
| API 5 | `DELETE` | `/api/auth/me` | Deletar conta do usuário logado |

**Total: 5 endpoints — 20 testes individuais**

---

## Arquivo 3 — Messages 

Testa os endpoints de **mensagens e denúncias**, cobrindo criação, listagem, atualização e remoção dos dois recursos.

| # | Método | Rota | O que faz |
|---|--------|------|-----------|
| API 1 | `POST` | `/api/messages/post` | Criar mensagem |
| API 2 | `GET` | `/api/messages/post` | Listar mensagens |
| API 3 | `POST` | `/api/messages/denuncia` | Criar denúncia |
| API 4 | `GET` | `/api/messages/denuncia` | Listar denúncias |
| API 5 | `DELETE` | `/api/messages/post/:id` | Bloquear delete sem permissão |
| API 6 | `PUT` | `/api/messages/post/:id` | Atualizar mensagem |
| API 7 | `DELETE` | `/api/messages/post/:id` | Deletar mensagem |
| API 8 | `PUT` | `/api/messages/denuncia/:id` | Atualizar denúncia |
| API 9 | `DELETE` | `/api/messages/denuncia/:id` | Deletar denúncia |

**Total: 9 endpoints — 16 testes individuais**

---


