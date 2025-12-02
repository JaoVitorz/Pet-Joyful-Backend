# 🐾 Pet Joyful - Backend API

API RESTful completa para a plataforma Pet Joyful, desenvolvida com Node.js, Express e MongoDB. Sistema de gerenciamento de usuários, autenticação JWT e mensagens com **arquitetura de microsserviços escalável**.

---

## 👥 Equipe de Desenvolvimento

- **João Vitor dos Santos de Jesus** - joao.jesus18@fatec.sp.gov.br
- **Mateus Fernandes Alves** - mateus.alves10@fatec.sp.gov.br
- **Elton da Costa** - elton.costa@fatec.sp.gov.br

**Fatec São Paulo - Projeto Integrador 2024/2025**

---

## 📋 Sobre o Projeto

O **Pet Joyful** é uma rede social voltada à conexão entre instituições de adoção, adotantes e clínicas veterinárias. Nosso foco é a conscientização sobre cuidados com animais, vacinação e o incentivo à adoção responsável.

A plataforma facilita o acesso a informações, promove campanhas e eventos como forma de publicação para adoção, criando uma comunidade engajada com a causa animal através de uma arquitetura moderna de microsserviços.

---

## 🏗️ Arquitetura do Sistema

O projeto utiliza uma **arquitetura de microsserviços** com múltiplos backends independentes, garantindo escalabilidade, manutenibilidade e separação de responsabilidades.

### 🔗 Repositórios e Serviços

#### Frontend

- **Repositório:** [Pet-Joyful---Projeto-Integrador--NextJs](https://github.com/JaoVitorz/Pet-Joyful---Projeto-Integrador--NextJs)
- **URL Produção:** https://pet-joyful-projeto-integrador-next-nu.vercel.app/Home
- **Tecnologia:** Next.js 15, React 19, TypeScript
- **Deploy:** Vercel

#### Microsserviços Backend

##### 1. Backend Principal (Autenticação e Mensagens)

- **Repositório:** [Pet-Joyful-Backend](https://github.com/JaoVitorz/Pet-Joyful-Backend) (Este repositório)
- **URL Produção:** https://pet-joyful-backend-1.onrender.com
- **URL Documentação:** https://pet-joyful-backend-1.onrender.com/api-docs
- **Funcionalidades:**
  - Autenticação JWT (login/registro)
  - Gerenciamento de usuários
  - Sistema de mensagens
  - Sistema de denúncias
- **Porta Local:** `3001`
- **Deploy:** Render

##### 2. Microserviço de Eventos

- **Repositório:** [PET-JOYFUL-EVENTS-SERVICE](https://github.com/JaoVitorz/PET-JOYFUL-EVENTS-SERVICE)
- **URL Produção:** https://pet-joyful-events-service.onrender.com
- **Funcionalidades:**
  - CRUD completo de eventos
  - Campanhas de adoção
  - Gerenciamento de participantes
- **Porta Local:** `3002`
- **Deploy:** Render

##### 3. Microserviço de Perfil e Álbuns

- **Repositório:** [EDICAO-PERFIL-MICROSERVICE](https://github.com/JaoVitorz/EDICAO-PERFIL-MICROSERVICE)
- **URL Produção:** https://edicao-perfil-microservice.onrender.com
- **Funcionalidades:**
  - Edição de perfil de usuário
  - Upload de fotos de perfil
  - Gerenciamento de álbuns de fotos
  - Informações de pets cadastrados
- **Porta Local:** `3001`
- **Deploy:** Render

---

### 🎯 Funcionalidades Principais (Ecossistema Completo)

#### Autenticação e Autorização (Este Backend)

- ✅ **Autenticação JWT e Admin-Key** - Sistema seguro de login e registro
- ✅ **CRUD Completo de Usuários** - Gerenciamento administrativo
- ✅ **Múltiplos Perfis** - Adotantes, ONGs e Veterinários
- ✅ **Proteção de Rotas** - Middlewares de autenticação e autorização

#### Sistema de Mensagens e Denúncias (Este Backend)

- ✅ **Sistema de Mensagens** - Comentários em posts
- ✅ **Sistema de Denúncias** - Moderação de conteúdo
- ✅ **Validação de Dados** - Proteção contra spam e abuso

#### Eventos e Campanhas (Microserviço 2)

- ✅ **Criação de Eventos** - Campanhas de adoção e vacinação
- ✅ **Gerenciamento de Eventos** - CRUD completo
- ✅ **Sistema de Participação** - Controle de interessados

#### Perfil e Álbuns (Microserviço 3)

- ✅ **Edição de Perfil** - Atualização de dados pessoais
- ✅ **Upload de Imagens** - Fotos de perfil e álbuns
- ✅ **Gerenciamento de Álbuns** - Galeria de fotos temáticas
- ✅ **Perfis de Pets** - Cadastro e exibição de animais

#### Recursos Gerais

- ✅ **Documentação Swagger** - API totalmente documentada
- ✅ **Deploy em Nuvem** - Hospedado no Render
- ✅ **CORS Configurado** - Integração segura entre serviços
- ✅ **Validação de Dados** - Segurança e integridade

---

## 📊 Requisitos do Sistema

### Requisitos Funcionais

| Nº   | Nome                      | Descrição                                                             | Microsserviço |
| ---- | ------------------------- | --------------------------------------------------------------------- | ------------- |
| RF01 | Login                     | Fazer login na rede social                                            | Principal     |
| RF02 | Email de confirmação      | Enviar email de confirmação para validar conta do usuário             | Principal     |
| RF03 | Adicionar/Remover Amigos  | Adicionar amigos na rede social ou remover                            | Perfil        |
| RF04 | Preferências de usuário   | Alteração das preferências do usuário                                 | Perfil        |
| RF05 | Bloquear usuários         | Bloquear usuários que descumprirem as políticas do site               | Principal     |
| RF06 | Sistema de Doações        | Permitir que usuários façam e recebam doações pela plataforma         | Eventos       |
| RF07 | Filtros de Busca          | Barra de pesquisa com filtros para doadores, pets para adoção e ONGs  | Frontend      |
| RF08 | Notificações              | Enviar notificações para usuários sobre interações relevantes         | Futuro        |
| RF09 | Perfil de Pet             | Criar perfis para pets com nome, raça, idade e fotos                  | Perfil        |
| RF10 | Feedback e Avaliações     | Permitir avaliações sobre doações para promover confiança             | Futuro        |
| RF11 | Criar Álbum (Agrupamento) | Criar agrupamento de fotos para exibição                              | Perfil        |
| RF12 | Gerenciar Postagem        | Permitir incluir, alterar e excluir postagens feitas pelos usuários   | Eventos       |
| RF13 | Comentar                  | Realizar comentários em conteúdos e postagens                         | Principal     |
| RF14 | Chat (Comentar)           | Interação entre usuários via texto                                    | Principal     |
| RF15 | Adicionar/Remover Fotos   | Adicionar ou remover fotos no conteúdo principal da página            | Perfil        |
| RF16 | Editar Perfil             | Configurar perfil pessoal para editar informações e dados             | Perfil        |
| RF17 | Adicionar e criar Post    | Adicionar e criar postagens no conteúdo principal e no perfil pessoal | Eventos       |

---

### Requisitos Não Funcionais

| Nº    | Nome                            | Descrição                                                                   | Status |
| ----- | ------------------------------- | --------------------------------------------------------------------------- | ------ |
| RNF01 | Tempo de resposta               | O tempo de resposta deve ser menor que 2 segundos                           | ✅     |
| RNF02 | Compatibilidade com Navegadores | Deve ser compatível com Firefox, Chrome, Safari e outros navegadores        | ✅     |
| RNF03 | Criptografia dos dados          | Dados do usuário devem ser criptografados ao serem armazenados              | ✅     |
| RNF04 | Escalabilidade                  | O sistema deve ser escalável para suportar grande número de usuários        | ✅     |
| RNF05 | Disponibilidade                 | Alta disponibilidade (99,9%) para evitar quedas do sistema                  | ✅     |
| RNF06 | Acessibilidade                  | Conformidade com WCAG 2.1 para garantir acessibilidade                      | ✅     |
| RNF07 | Responsividade                  | Ajustar-se a diferentes tamanhos de tela (computador, tablet, smartphone)   | ✅     |
| RNF08 | Backup de Dados                 | Implementar política de backup regular dos dados do usuário                 | ✅     |
| RNF09 | Monitoramento e Logs            | Implementar mecanismo de monitoramento e geração de logs                    | 🔄     |
| RNF10 | Segurança de Autenticação       | Suportar autenticação via OAuth 2.0 ou métodos seguros (ex.: redes sociais) | ✅     |
| RNF11 | Tolerância a Falhas             | Garantir operação contínua mesmo em caso de falhas parciais                 | ✅     |
| RNF12 | Tempo de Recuperação            | Em caso de falha, recuperação deve ser inferior a 5 minutos                 | ✅     |
| RNF13 | Consumo de Recursos             | Aplicação otimizada para minimizar consumo de CPU, memória e banda          | ✅     |
| RNF14 | Conformidade com LGPD           | Estar em conformidade com a LGPD e regulamentos similares                   | ✅     |
| RNF15 | Gerenciamento de Sessões        | Sessões devem ter timeouts automáticos e serem gerenciadas com segurança    | ✅     |
| RNF16 | Verificação de duas etapas      | Implementar autenticação em duas etapas para segurança do usuário           | 📋     |

**Legenda:** ✅ Implementado | 🔄 Em Progresso | 📋 Planejado

## 🎭 Casos de Uso

### Diagrama de Casos de Uso

<img width="882" height="379" alt="image" src="https://github.com/user-attachments/assets/9b6d4f32-5714-40b7-b422-ac5c4528b5a8" />

---

## 🧩 Caso de Uso: Cadastrar

**Atores:** Usuário  
**Resumo:** O usuário realiza o cadastro no sistema, fornecendo as informações necessárias para criar uma conta.  
**Pré-condição:** O usuário deve fornecer dados válidos para o cadastro.  
**Pós-condição:** O usuário está registrado no sistema e pode realizar login.  
**Microsserviço:** Principal (Autenticação)

**Fluxo Principal:**

1. Usuário insere dados do cadastro.
2. Sistema valida as informações.
3. Sistema confirma o cadastro e cria a conta no sistema.

**Restrições/Validações:**

- O email deve ser único e válido.

---

## 🧩 Caso de Uso: Logoff

**Atores:** Usuário  
**Resumo:** O usuário encerra sua sessão no sistema, garantindo que suas credenciais não fiquem ativas.  
**Pré-condição:** O usuário deve estar autenticado.  
**Pós-condição:** O usuário é desconectado e precisará realizar login novamente.  
**Microsserviço:** Frontend + Principal

**Fluxo Principal:**

1. Usuário seleciona opção de logoff.
2. Sistema exibe confirmação de saída.
3. Usuário confirma logoff.
4. Sistema encerra sessão e redireciona para tela de login.

**Restrições/Validações:**

- O usuário deve estar logado.
- Após o logoff, as credenciais são removidas da sessão.

---

## 🧩 Caso de Uso: Fazer Login

**Atores:** Usuário  
**Resumo:** O usuário insere suas credenciais para acessar o sistema.  
**Pré-condição:** O usuário deve possuir cadastro válido.  
**Pós-condição:** O usuário estará autenticado no sistema.  
**Microsserviço:** Principal (Autenticação)

**Fluxo Principal:**

1. Inserir email e senha.
2. Sistema valida credenciais.
3. Sistema concede acesso ao sistema.

**Restrições/Validações:**

- Email e senha devem ser válidos.

---

## 🧩 Caso de Uso: Redefinir Senha

**Atores:** Usuário  
**Resumo:** O usuário solicita redefinição de senha e recebe link ou código para alteração.  
**Pré-condição:** O usuário deve ter email cadastrado.  
**Pós-condição:** A senha é alterada com sucesso.  
**Microsserviço:** Principal (Autenticação)

**Fluxo Principal:**

1. Usuário solicita redefinição e insere email válido.
2. Sistema envia link/código de verificação.
3. Usuário insere nova senha.
4. Sistema atualiza senha.

**Restrições/Validações:**

- Senha deve atender aos critérios de segurança.

---

## 🧩 Caso de Uso: Visualizar Post

**Atores:** Usuário  
**Resumo:** O usuário visualiza um post e pode interagir com ele.  
**Pré-condição:** O post deve estar disponível.  
**Pós-condição:** O usuário vê o conteúdo do post.  
**Microsserviço:** Frontend + Eventos

**Fluxo Principal:**

1. Usuário acessa o feed.
2. Sistema exibe posts em ordem decrescente.

---

## 🧩 Caso de Uso: Criar Post

**Atores:** Usuário  
**Resumo:** O usuário cria um post com informações sobre adoção ou doação.  
**Pré-condição:** O usuário deve estar logado.  
**Pós-condição:** O post é publicado.  
**Microsserviço:** Eventos

**Fluxo Principal:**

1. Inserir informações do post.
2. Sistema valida informações.
3. Confirmar criação.
4. Sistema publica o post.

**Restrições/Validações:**

- Conteúdo deve seguir as diretrizes do sistema.

---

## 🧩 Caso de Uso: Comentar

**Atores:** Usuário  
**Resumo:** O usuário comenta em um post.  
**Pré-condição:** O post deve permitir comentários.  
**Pós-condição:** O comentário é adicionado.  
**Microsserviço:** Principal (Mensagens)

**Fluxo Principal:**

1. Selecionar post.
2. Exibir post.
3. Inserir comentário.
4. Sistema publica comentário.

**Restrições/Validações:**

- O usuário deve estar autenticado.

---

## 🧩 Caso de Uso: Gerenciar Post

**Atores:** Usuário  
**Resumo:** O usuário pode incluir, alterar ou excluir postagens criadas.  
**Pré-condição:** O post deve existir e o usuário deve ter permissão.  
**Pós-condição:** O post é atualizado ou removido.  
**Microsserviço:** Eventos

**Fluxo Principal:**

1. Selecionar post.
2. Escolher ação (editar ou excluir).
3. Sistema processa ação.
4. Sistema salva alterações ou remove post.

**Restrições/Validações:**

- Apenas criador ou administrador pode gerenciar o post.

---

## 🧩 Caso de Uso: Bloquear Usuários

**Atores:** Administrador  
**Resumo:** O administrador bloqueia usuários que violem as regras.  
**Pré-condição:** Usuário infrator deve existir no sistema.  
**Pós-condição:** Usuário bloqueado perde acesso.  
**Microsserviço:** Principal (Usuários)

**Fluxo Principal:**

1. Administrador acessa painel.
2. Seleciona usuário.
3. Sistema verifica permissões.
4. Confirmar bloqueio.
5. Sistema atualiza status e notifica o usuário.

**Restrições/Validações:**

- Somente administradores podem executar esta ação.

---

## 🧩 Caso de Uso: Denunciar Post

**Atores:** Usuário  
**Resumo:** O usuário denuncia um post que viola as regras da plataforma.  
**Pré-condição:** O post deve estar visível e ativo.  
**Pós-condição:** Denúncia registrada para análise.  
**Microsserviço:** Principal (Denúncias)

**Fluxo Principal:**

1. Selecionar post.
2. Escolher "Denunciar".
3. Preencher motivo.
4. Sistema registra e notifica administradores.

**Restrições/Validações:**

- Usuário deve estar autenticado.
- Motivo da denúncia deve ser válido.

---

## 🧩 Caso de Uso: Validar CRMV

**Atores:** Veterinário, Sistema  
**Resumo:** O sistema valida o CRMV informado pelo veterinário durante o cadastro.  
**Pré-condição:** O veterinário deve fornecer CRMV válido.  
**Pós-condição:** Acesso liberado somente se CRMV for validado.  
**Microsserviço:** Principal (Autenticação)

**Fluxo Principal:**

1. Inserir número do CRMV.
2. Sistema valida via API.
3. Sistema retorna confirmação.

**Restrições/Validações:**

- CRMV deve ser consultado em base oficial.

---

## 🧩 Caso de Uso: Validar CNPJ

**Atores:** Representante da ONG, Sistema  
**Resumo:** O sistema valida o CNPJ da ONG no momento do cadastro.  
**Pré-condição:** ONG deve fornecer CNPJ válido.  
**Pós-condição:** Cadastro liberado após validação.  
**Microsserviço:** Principal (Autenticação)

**Fluxo Principal:**

1. Inserir número do CNPJ.
2. Sistema consulta base oficial.
3. Exibir resultado.
4. Continuar cadastro ou exibir erro.

**Restrições/Validações:**

- CNPJ deve estar ativo e válido na Receita Federal.

---

## 🧩 Caso de Uso: Curtir Post

**Atores:** Usuário, Sistema  
**Resumo:** O usuário curte um post, registrando interesse no conteúdo.  
**Pré-condição:** Usuário deve estar logado e o post visível.  
**Pós-condição:** O número de curtidas é atualizado.  
**Microsserviço:** Eventos

**Fluxo Principal:**

1. Visualizar post.
2. Clicar em "Curtir".
3. Sistema registra curtida e atualiza contador.

**Fluxo Alternativo (Descurtir):**

1. Clicar novamente em "Curtir".
2. Sistema remove curtida e atualiza contador.

**Restrições/Validações:**

- Um usuário só pode curtir uma vez.
- Sistema impede curtidas de usuários não logados.

---

## 🛠️ Stack Tecnológica

### Frontend 🚀

- **Next.js 15** - Framework React com SSR
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Framework CSS
- **Bootstrap 5** - Componentes UI
- **React-Bootstrap** - Bootstrap para React
- **React Icons / Lucide React** - Ícones
- **Formik** - Gerenciamento de formulários
- **Yup** - Validação de schemas
- **Axios** - Cliente HTTP

### Backend (Este Microsserviço)

- **Node.js 18+** - Runtime JavaScript
- **Express 5** - Framework web
- **MongoDB Atlas** - Banco de dados NoSQL
- **Mongoose 8** - ODM para MongoDB
- **JWT (jsonwebtoken)** - Autenticação
- **Bcryptjs** - Criptografia de senhas
- **CORS** - Políticas de origem cruzada
- **Dotenv** - Gerenciamento de variáveis de ambiente

### DevOps & Ferramentas

- **Docker** e Docker Compose - Containerização
- **Render** - Deploy backend (microsserviços)
- **Vercel** - Deploy frontend
- **Swagger UI / swagger-autogen** - Documentação automática
- **Nodemon** - Hot reload em desenvolvimento
- **Git** - Controle de versão
- **npm** - Gerenciador de pacotes

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18 ou superior - [Download](https://nodejs.org/)
- **npm** ou **yarn** - Gerenciador de pacotes
- **MongoDB Atlas** - Conta gratuita em [mongodb.com](https://www.mongodb.com/cloud/atlas)
- **Git** (opcional) - [Download](https://git-scm.com/)

### Clone o repositório

```bash
# Clone o repositório
git clone https://github.com/JaoVitorz/Pet-Joyful-Backend.git
cd Pet-Joyful-Backend
```

### Instale as dependências

```bash
npm install
```

**Dependências principais que serão instaladas:**

- express, mongoose, jsonwebtoken
- bcryptjs, cors, dotenv
- swagger-ui-express, swagger-autogen
- nodemon (dev dependency)

### Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=3001
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/petjoyful?retryWrites=true&w=majority

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d

# Admin
ADMIN_KEY=sua_admin_key_super_segura

# CORS (Frontend URL)
FRONTEND_URL=http://localhost:3000

# URLs dos outros microsserviços (para integração futura)
EVENTS_SERVICE_URL=http://localhost:3002
PROFILE_SERVICE_URL=http://localhost:3001
```

**⚠️ Importante:**

- Nunca commite o arquivo `.env` no Git
- Use senhas fortes para produção
- Para produção, configure as URLs dos serviços no Render

### Execute o projeto

#### Desenvolvimento

```bash
# Modo desenvolvimento com hot reload
npm run dev
```

#### Produção

```bash
# Build e start
npm start
```

O servidor estará rodando em `http://localhost:3001`

### Teste a API

Acesse a documentação Swagger em:

```
http://localhost:3001/api-docs
```

### 📚 Acesse a Documentação

- **Swagger Docs (Local)**: http://localhost:3001/api-docs
- **Swagger Docs (Produção)**: https://pet-joyful-backend-1.onrender.com/api-docs

> **Nota**: A documentação Swagger é gerada automaticamente a partir do código usando `swagger-autogen`

---

## 📡 Endpoints da API (Este Microsserviço)

### 🔐 Autenticação

| Método | Endpoint             | Descrição                     | Auth         |
| ------ | -------------------- | ----------------------------- | ------------ |
| POST   | `/api/auth/register` | Cadastrar novo usuário        | Não          |
| POST   | `/api/auth/login`    | Login (retorna JWT)           | Não          |
| GET    | `/api/auth/me`       | Perfil do usuário autenticado | Bearer Token |
| PUT    | `/api/auth/me`       | Atualizar perfil              | Bearer Token |
| DELETE | `/api/auth/me`       | Deletar conta                 | Bearer Token |

### 👤 Usuários

| Método | Endpoint         | Descrição                | Auth      |
| ------ | ---------------- | ------------------------ | --------- |
| GET    | `/api/users`     | Listar todos os usuários | Admin Key |
| GET    | `/api/users/:id` | Buscar usuário por ID    | Admin Key |
| POST   | `/api/users`     | Criar usuário            | Admin Key |
| PUT    | `/api/users/:id` | Atualizar usuário        | Admin Key |
| DELETE | `/api/users/:id` | Deletar usuário          | Admin Key |

### 💬 Mensagens

| Método | Endpoint                 | Descrição          | Auth      |
| ------ | ------------------------ | ------------------ | --------- |
| POST   | `/api/messages/post`     | Criar mensagem     | Não       |
| GET    | `/api/messages/post`     | Listar mensagens   | Não       |
| PUT    | `/api/messages/post/:id` | Atualizar mensagem | Admin Key |
| DELETE | `/api/messages/post/:id` | Deletar mensagem   | Admin Key |

### 🚨 Denúncias

| Método | Endpoint                     | Descrição          | Auth      |
| ------ | ---------------------------- | ------------------ | --------- |
| POST   | `/api/messages/denuncia`     | Criar denúncia     | Não       |
| GET    | `/api/messages/denuncia`     | Listar denúncias   | Admin Key |
| PUT    | `/api/messages/denuncia/:id` | Atualizar denúncia | Admin Key |
| DELETE | `/api/messages/denuncia/:id` | Deletar denúncia   | Admin Key |

---

## 📡 Endpoints dos Outros Microsserviços

### Microserviço de Eventos (Porta 3002)

| Método | Endpoint          | Descrição               |
| ------ | ----------------- | ----------------------- |
| GET    | `/api/events`     | Listar todos os eventos |
| GET    | `/api/events/:id` | Obter evento específico |
| POST   | `/api/events`     | Criar novo evento       |
| PUT    | `/api/events/:id` | Atualizar evento        |
| DELETE | `/api/events/:id` | Deletar evento          |

### Microserviço de Perfil e Álbuns (Porta 3001)

| Método | Endpoint                | Descrição                |
| ------ | ----------------------- | ------------------------ |
| GET    | `/api/profile/me`       | Obter perfil autenticado |
| PUT    | `/api/profile/me`       | Atualizar perfil         |
| POST   | `/api/profile/me/photo` | Upload foto de perfil    |
| GET    | `/api/profile/:userId`  | Obter perfil por ID      |
| GET    | `/api/albums`           | Listar álbuns            |
| POST   | `/api/albums`           | Criar álbum              |
| GET    | `/api/albums/:id`       | Obter álbum específico   |
| DELETE | `/api/albums/:id`       | Deletar álbum            |

---

## 🔑 Autenticação

### Bearer Token (JWT)

```http
Authorization: Bearer {token}
```

**Características:**

- Gerado no registro e login
- Validade padrão: 7 dias (configurável)
- Usado em rotas de perfil (`/api/auth/me`)
- Contém informações do usuário (id, email, tipo)

### Admin Key (Operações Administrativas)

```http
x-admin-key: {admin_key_from_env}
```

**Características:**

- Definida na variável de ambiente `ADMIN_KEY`
- Acesso total às operações administrativas
- Requerida para:
  - Gerenciamento de usuários
  - Atualização/exclusão de mensagens
  - Gerenciamento de denúncias

**Nota:** A Admin Key permite acesso total às operações protegidas. No código, o middleware `ensureAuth` aceita **tanto Bearer Token quanto Admin Key**.

---

### 🔐 Sistema de Autenticação

O projeto utiliza **dois mecanismos de autenticação**:

#### Bearer Token (JWT)

- Gerado no registro e login
- Validade de 7 dias
- Usado em rotas de perfil (`/api/auth/me`)

#### Admin Key

- Header: `x-admin-key`
- Requerida para operações administrativas:
  - Gerenciamento de usuários
  - Atualização/exclusão de mensagens
  - Gerenciamento de denúncias
- Definida na variável de ambiente `ADMIN_KEY`

**Importante:** O middleware `ensureAuth` aceita ambos os métodos.

---

## 💡 Exemplos de Uso

### Registrar Usuário

```bash
curl -X POST https://pet-joyful-backend-1.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "senha123",
    "tipo": "adotante"
  }'
```

**Resposta:**

```json
{
  "success": true,
  "message": "Usuário cadastrado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo": "adotante"
  }
}
```

### Login

```bash
curl -X POST https://pet-joyful-backend-1.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'
```

**Resposta:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "João Silva",
    "email": "joao@email.com",
    "tipo": "adotante"
  }
}
```

### Obter Perfil (Autenticado)

```bash
curl -X GET https://pet-joyful-backend-1.onrender.com/api/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

### Criar Mensagem

```bash
curl -X POST https://pet-joyful-backend-1.onrender.com/api/messages/post \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria",
    "email": "maria@email.com",
    "mensagem": "Gostei muito do post!",
    "postId": "123abc"
  }'
```

### Listar Usuários (Admin)

```bash
curl -X GET https://pet-joyful-backend-1.onrender.com/api/users \
  -H "x-admin-key: SUA_ADMIN_KEY_AQUI"
```

---

## 📁 Estrutura do Projeto

```
Pet-Joyful-Backend/
├── backend/
│   └── src/
│       ├── controllers/           # Lógica de negócio
│       │   ├── authController.js      # Autenticação (login/registro)
│       │   ├── userController.js      # CRUD de usuários
│       │   └── messagesController.js  # Mensagens e denúncias
│       ├── models/                # Schemas MongoDB (Mongoose)
│       │   ├── userModel.js           # Modelo de usuário
│       │   ├── postMessageModel.js    # Modelo de mensagem
│       │   └── denunciaMessageModel.js # Modelo de denúncia
│       ├── routes/                # Definição de rotas Express
│       │   ├── authRoutes.js          # Rotas de autenticação
│       │   ├── userRoutes.js          # Rotas de usuários
│       │   ├── messagesRoutes.js      # Rotas de mensagens
│       │   └── index.js               # Agregador de rotas
│       ├── middlewares/           # Middlewares customizados
│       │   ├── ensureAuth.js          # Verificação de JWT/Admin Key
│       │   ├── verifyToken.js         # Validação de JWT
│       │   ├── ensureAdminKey.js      # Validação de Admin Key
│       │   ├── verifyApiKey.js        # Validação de API Key
│       │   └── errorHandler.js        # Tratamento de erros
│       ├── database/              # Conexão com banco de dados
│       │   └── connection.js          # Config MongoDB/Mongoose
│       ├── config/                # Configurações gerais
│       │   ├── db.js                  # Config alternativa DB
│       │   └── swagger.json           # Config Swagger
│       ├── app.js                 # Express App (configuração)
│       ├── swagger.js             # Configuração Swagger Autogen
│       └── swagger-output.json    # Documentação gerada
├── api/
│   └── index.js                   # Vercel Serverless Handler
├── services/                      # Outros microsserviços (estrutura)
│   ├── gateway-service/
│   │   └── src/
│   │       └── index.js
│   └── messages-service/
│       ├── package.json
│       └── src/
│           ├── index.js
│           ├── controllers/
│           │   └── postsController.js
│           ├── database/
│           │   └── connection.js
│           ├── models/
│           │   └── postModel.js
│           └── routes/
│               └── postsRoutes.js
├── nginx/
│   └── nginx.conf                 # Configuração Nginx (se usar)
├── docker-compose.yml             # Orquestração Docker
├── Dockerfile                     # Imagem Docker
├── server.js                      # Entry point principal
├── package.json                   # Dependências e scripts
├── .env                           # Variáveis de ambiente (não commitar!)
├── .gitignore                     # Arquivos ignorados pelo Git
└── README.md                      # Este arquivo
```

---

## 🐛 Troubleshooting

### Erro: "Module not found"

```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Cannot connect to MongoDB"

Verifique:

1. A string de conexão `MONGO_URI` no `.env` está correta
2. Seu IP está na whitelist do MongoDB Atlas
3. As credenciais estão corretas

```bash
# Teste a conexão
node -e "require('./backend/src/database/connection.js')"
```

### Erro: "Port 3001 already in use"

```powershell
# Windows PowerShell
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Ou use outra porta
$env:PORT=3005; npm run dev
```

### Erro: "JWT malformed" ou "Invalid token"

- Verifique se o token está sendo enviado corretamente no header
- Certifique-se de que `JWT_SECRET` está configurado no `.env`
- Faça login novamente para obter um token válido

### Erro: "Cannot connect to other microservices"

Verifique as URLs dos microsserviços:

```bash
# Teste as URLs no navegador ou Postman
https://pet-joyful-events-service.onrender.com/api/events
https://edicao-perfil-microservice.onrender.com/api/profile/me
```

---

## 🔒 Segurança

### Implementações de Segurança

- ✅ **JWT Tokens** - Autenticação stateless
- ✅ **Bcrypt** - Hash de senhas com salt rounds
- ✅ **CORS** - Políticas de origem cruzada configuradas
- ✅ **Validação de Inputs** - Sanitização de dados
- ✅ **Rate Limiting** - Proteção contra DDoS (planejado)
- ✅ **Helmet.js** - Headers de segurança HTTP (planejado)
- ✅ **HTTPS** - Comunicação criptografada em produção
- ✅ **Environment Variables** - Segredos não expostos no código
- ✅ **Admin Key** - Camada extra para operações administrativas

### Boas Práticas

- Nunca commitar arquivos `.env`
- Usar senhas fortes para `JWT_SECRET` e `ADMIN_KEY`
- Implementar rate limiting em produção
- Monitorar logs de segurança
- Manter dependências atualizadas (`npm audit`)
- Validar todos os inputs do usuário
- Sanitizar dados antes de salvar no banco

---

## 🧪 Testes

### Ferramentas Recomendadas

- **Postman** - [Download](https://www.postman.com/downloads/)
- **Insomnia** - [Download](https://insomnia.rest/download)
- **Thunder Client** - Extensão VS Code

### Importar Documentação

1. Acesse `/api-docs` em ambiente local ou produção
2. Copie a especificação OpenAPI/Swagger
3. Importe no Postman/Insomnia
4. Configure as variáveis de ambiente:
   - `baseUrl`: URL do backend
   - `token`: JWT token após login
   - `adminKey`: Admin key do `.env`

### Collection Postman (Exemplo)

```json
{
  "info": {
    "name": "Pet Joyful API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    { "key": "baseUrl", "value": "https://pet-joyful-backend-1.onrender.com" },
    { "key": "token", "value": "" },
    { "key": "adminKey", "value": "" }
  ]
}
```

---

## Sprint Banco de Dados

| Atividade                                         | Início              | Término             | Status |
| :------------------------------------------------ | :------------------ | :------------------ | :----- |
| Integração de Dados Com Telas de Cadastro e Login | 2025-09-10 00:00:00 | 2025-10-28 00:00:00 | ✅     |
| Criação de Banco de Dados do Site                 | 2025-09-10 00:00:00 | 2025-10-02 00:00:00 | ✅     |
| Configuração do Banco no Projeto                  | 2025-09-25 00:00:00 | 2025-10-28 00:00:00 | ✅     |
| Configurar Conexão do Mongo no Back-End           | 2025-09-25 00:00:00 | 2025-10-21 00:00:00 | ✅     |
| Implementar CRUD de Usuários, Veterinários e ONGS | 2025-09-25 00:00:00 | 2025-10-28 00:00:00 | ✅     |
| Endpoint de Registro                              | 2025-09-25 00:00:00 | 2025-10-28 00:00:00 | ✅     |
| Endpoint de Login                                 | 2025-09-25 00:00:00 | 2025-10-28 00:00:00 | ✅     |
| Fazer Testes no Postman                           | 2025-10-13 00:00:00 | 2025-10-21 00:00:00 | ✅     |
| Microserviços                                     | 2025-10-28 00:00:00 | 2025-10-28 00:00:00 | ✅     |

## Sprint do Backend

| Atividade                                          | Início              | Término             | Status |
| :------------------------------------------------- | :------------------ | :------------------ | :----- |
| Criação da Estrutura de Pastas do Back-End         | 2025-10-02 00:00:00 | 2025-10-05 00:00:00 | ✅     |
| Configurar Docker e Containers                     | 2025-10-06 00:00:00 | 2025-10-08 00:00:00 | ✅     |
| Implementar Conexão com Banco de Dados             | 2025-10-09 00:00:00 | 2025-10-10 00:00:00 | ✅     |
| Criar Microserviços (Usuários, Eventos, Perfil)    | 2025-10-10 00:00:00 | 2025-10-12 00:00:00 | ✅     |
| Implementar Middleware de Autenticação JWT         | 2025-10-12 00:00:00 | 2025-10-13 00:00:00 | ✅     |
| Implementar Middleware de Autorização (checkAdmin) | 2025-10-13 00:00:00 | 2025-10-14 00:00:00 | ✅     |
| Criar Documentação da API com Swagger              | 2025-10-14 00:00:00 | 2025-10-15 00:00:00 | ✅     |
| Testar Endpoints com Insomnia / Postman            | 2025-10-15 00:00:00 | 2025-10-17 00:00:00 | ✅     |
| Deploy do Backend no Render                        | 2025-10-17 00:00:00 | 2025-10-19 00:00:00 | ✅     |
| Ajustar CORS e Variáveis de Ambiente               | 2025-10-19 00:00:00 | 2025-10-20 00:00:00 | ✅     |
| Revisão Final e Apresentação do Swagger UI         | 2025-10-20 00:00:00 | 2025-10-22 00:00:00 | ✅     |

## Sprint do Backlog

| Atividade                                             | Início | Término | Status |
| :---------------------------------------------------- | :----- | :------ | :----- |
| Integração com Front-End                              | ✅     | ✅      | ✅     |
| Upload de Imagens de Pets                             | ✅     | ✅      | ✅     |
| Sistema de Notificações (E-mail ou Push)              | -      | -       | 📋     |
| Recuperação de Senha (Esqueci minha senha)            | -      | -       | 📋     |
| Filtros e Paginação de Pets                           | ✅     | ✅      | ✅     |
| Dashboard Administrativo                              | -      | -       | 🔄     |
| Logs de Adoção                                        | -      | -       | 📋     |
| Testes Automatizados (Jest / Supertest)               | -      | -       | 📋     |
| Cache de Requisições (Redis)                          | -      | -       | 📋     |
| Monitoramento e Health Check                          | -      | -       | 🔄     |
| Integração com Serviços Externos (ex: Geolocalização) | -      | -       | 📋     |
| Sistema de Favoritos (Pets Favoritados por Usuário)   | -      | -       | 📋     |
| API de Feedback / Avaliação de Adoções                | -      | -       | 📋     |
| Melhorias de Segurança e Rate Limiting                | -      | -       | 🔄     |
| Criação de Gateway API para Microsserviços            | -      | -       | 🔄     |

**Legenda:** ✅ Concluído | 🔄 Em Progresso | 📋 Planejado

---

## 🌐 Deploy

### Ambientes

#### Produção

- **URL API Principal:** https://pet-joyful-backend-1.onrender.com
- **URL Swagger Docs:** https://pet-joyful-backend-1.onrender.com/api-docs
- **Plataforma:** Render
- **Banco de Dados:** MongoDB Atlas

#### Desenvolvimento

- **URL Local:** http://localhost:3001
- **Swagger Local:** http://localhost:3001/api-docs

### Configuração de Deploy no Render

1. **Criar novo Web Service no Render**
2. **Conectar repositório GitHub**
3. **Configurar Build Command:**
   ```bash
   npm install
   ```
4. **Configurar Start Command:**
   ```bash
   npm start
   ```
5. **Adicionar variáveis de ambiente:**
   - `MONGO_URI`
   - `JWT_SECRET`
   - `ADMIN_KEY`
   - `NODE_ENV=production`
   - `FRONTEND_URL`
   - `EVENTS_SERVICE_URL`
   - `PROFILE_SERVICE_URL`

### Integração com Frontend (Vercel)

O frontend em Next.js se conecta aos microsserviços através das variáveis:

```env
# Frontend .env.local
NEXT_PUBLIC_AUTH_API_URL=https://pet-joyful-backend-1.onrender.com
NEXT_PUBLIC_EVENTS_API_URL=https://pet-joyful-events-service.onrender.com
NEXT_PUBLIC_PROFILE_API_URL=https://edicao-perfil-microservice.onrender.com
```

---

## 📝 Licença

Este projeto está sob a licença **ISC**.

Desenvolvido para fins acadêmicos como parte do Projeto Integrador da Fatec São Paulo.

---

## 📞 Contato & Suporte

- **Documentação:** [Swagger Docs](https://pet-joyful-backend-1.onrender.com/api-docs)
- **Repositório Backend Principal:** [GitHub](https://github.com/JaoVitorz/Pet-Joyful-Backend)
- **Repositório Frontend:** [GitHub](https://github.com/JaoVitorz/Pet-Joyful---Projeto-Integrador--NextJs)
- **Issues:** [GitHub Issues](https://github.com/JaoVitorz/Pet-Joyful-Backend/issues)
- **Email Suporte:** joao.jesus18@fatec.sp.gov.br

---

## 📚 Documentação Adicional

### Microsserviços

- [Microserviço de Eventos](https://github.com/JaoVitorz/PET-JOYFUL-EVENTS-SERVICE)
- [Microserviço de Perfil e Álbuns](https://github.com/JaoVitorz/EDICAO-PERFIL-MICROSERVICE)

### Frontend

- [Integração de Backends](https://github.com/JaoVitorz/Pet-Joyful---Projeto-Integrador--NextJs/blob/main/pet-joyful/INTEGRACAO_BACKENDS.md)
- [Sistema de Álbuns](https://github.com/JaoVitorz/Pet-Joyful---Projeto-Integrador--NextJs/blob/main/SISTEMA_ALBUNS.md)
- [Análise de Acessibilidade](https://github.com/JaoVitorz/Pet-Joyful---Projeto-Integrador--NextJs/blob/main/ANALISE_ACESSIBILIDADE_USABILIDADE.md)
- [Fluxo de Registro](https://github.com/JaoVitorz/Pet-Joyful---Projeto-Integrador--NextJs/blob/main/pet-joyful/FLUXO_REGISTRO.md)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

<div align="center">

## 🐾 Conectando Corações e Patas

**Pet-Joyful** - Promovendo adoção responsável e cuidados com animais através da tecnologia.

**Desenvolvido com ❤️ pela Equipe Pet Joyful - Fatec São Paulo**

⭐ Se este projeto foi útil, considere dar uma estrela!

---

**[⬆ Voltar ao topo](#-pet-joyful---backend-api)**

</div>
