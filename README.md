# 🐾 Pet Joyful - Backend API

API RESTful completa para a plataforma Pet Joyful, desenvolvida com Node.js, Express e MongoDB. Sistema de gerenciamento de usuários, autenticação JWT e mensagens com **arquitetura de microsserviços escalável**

---

## 👥 Equipe de Desenvolvimento

- **João Vitor dos Santos de Jesus** - joao.jesus18@fatec.sp.gov.br
- **Mateus Fernandes Alves** - mateus.alves10@fatec.sp.gov.br
- **Elton da Costa** - elton.costa@fatec.sp.gov.br

**Fatec São Paulo - Projeto Integrador 2024/2025**

---

## 📋 Sobre o Projeto

O **Pet Joyful** é uma rede social voltada à conexão entre instituições de adoção, adotantes e clínicas veterinárias. Nosso foco é a  conscientização sobre cuidados com animais, vacinação e o incentivo à adoção responsável.

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

# Relatório da Sprint – Banco de Dados

## 1. Objetivo da Sprint

Consolidar toda a fundação de **banco de dados e integração com backend**, garantindo:

- Criação e configuração do banco de dados do projeto.
- Conexão estável entre backend e banco (MongoDB).
- Scripts estruturados para criação de tabelas/coleções.
- Parâmetros e variáveis de ambiente padronizados.
- Primeiros endpoints integrados ao banco (autenticação e cadastro).

Issues relacionadas à sprint de banco de dados:  
[Ver todas as issues relacionadas](https://petjoyful.atlassian.net/issues/?jql=project%20%3D%20SCRUM%20AND%20%28summary%20~%20%22banco%22%20OR%20summary%20~%20%22MongoDB%22%20OR%20summary%20~%20%22configura%C3%A7%C3%A3o%22%20OR%20summary%20~%20%22integra%C3%A7%C3%A3o%22%20OR%20description%20~%20%22banco%22%20OR%20description%20~%20%22MongoDB%22%20OR%20description%20~%20%22configura%C3%A7%C3%A3o%22%20OR%20description%20~%20%22integra%C3%A7%C3%A3o%22%29%20ORDER%20BY%20created%20ASC)

---

## 2. Estórias / Tarefas da Sprint

### Itens diretamente ligados a banco de dados

- **SCRUM-8** – Criação do banco de dados do site – **Concluído** – _1.0 pts_  
- **SCRUM-12** – Configuração do banco no projeto – **Concluído** – _1.0 pts_  
- **SCRUM-13** – Configurar conexão do MongoDB no backend – **Concluído** – _3.0 pts_  
- **SCRUM-15** – Testar conexão do backend com o banco de dados – **Concluído** – _sem estimativa_  
- **SCRUM-16** – Criar e aplicar scripts de criação de tabelas – **Concluído** – _sem estimativa_  
- **SCRUM-17** – Definir parâmetros de conexão do banco de dados – **Concluído** – _sem estimativa_  
- **SCRUM-18** – Configurar variáveis de ambiente para o banco de dados – **Concluído** – _sem estimativa_  

### Itens de integração banco + autenticação / API

- **SCRUM-7** – Integração banco de dados com telas de cadastro e login – **Concluído** – _3.0 pts_  
- **SCRUM-24** – EndPoint de registro – **Concluído** – _1.5 pts_  
- **SCRUM-26** – EndPoint de login – **Concluído** – _1.5 pts_  
- **SCRUM-37** – Configuração API com rotas – **Concluído** – _1.0 pts_  

> Obs.: A issue **SCRUM-23 – Autenticação e Cadastro (Integração com Banco de Dados)** está como **A fazer**, e pode ser tratada como épico/umbrella dessa sprint ou de uma próxima, dependendo de como você organizou as sprints no board.

---

## 3. Resumo da Sprint Review

### Funcionalidades demonstradas

- Banco de dados do projeto criado e configurado, com estrutura alinhada às entidades principais do sistema.
- Conexão do backend com o **MongoDB** totalmente funcional, com parâmetros de conexão e variáveis de ambiente configuradas.
- Scripts de criação de tabelas/coleções definidos e aplicados, permitindo subida rápida de novos ambientes.
- Testes de conexão entre backend e banco concluídos com sucesso, validando operações básicas de leitura e escrita.
- Endpoints de **registro** e **login** integrados ao banco de dados, persistindo usuários e validando credenciais.
- Rotas da API configuradas, expondo os serviços principais de autenticação e cadastro.

### Feedback do Product Owner / stakeholders

- Satisfação com o fato de a base de dados estar preparada para suportar o crescimento futuro do produto.
- Comentário positivo sobre a clareza da estrutura de entidades, facilitando entendimento de regras de negócio.
- Pedido para manter a documentação de conexão e scripts sempre atualizada, para facilitar onboarding de novos devs.
- Sugestão de, nas próximas sprints, explorar métricas simples (logs/monitoramento) para acompanhar o uso real do banco em produção.

---

## 4. Problemas e Riscos Observados

- Pequenas divergências iniciais nas **variáveis de ambiente** entre máquinas (nomes, caminhos, URIs), causando falhas de conexão até a padronização.
- Necessidade de ajustes finos nas **configurações do MongoDB** (por exemplo, strings de conexão e opções de segurança), o que consumiu mais tempo do que o esperado.
- Risco futuro de acoplamento excessivo caso novas entidades sejam criadas sem seguir a mesma convenção de modelagem definida nessa sprint.
- Ausência inicial de um ambiente de testes isolado para banco, fazendo com que os primeiros testes fossem feitos no mesmo ambiente da equipe, aumentando chance de conflito de dados.
- Falta de testes automatizados cobrindo operações críticas no banco (criação de usuário, login, leitura de dados principais), aumentando o risco de regressões silenciosas.

---

## 5. Retrospectiva – Ações e Soluções

### Manter

- O hábito de documentar parâmetros de conexão, variáveis de ambiente e scripts de criação de banco em um local único (ex.: README ou Wiki).
- A prática de validar a conexão com o banco logo no início da sprint, reduzindo risco de bloqueio no meio do desenvolvimento.
- A colaboração próxima entre backend e responsável pela infraestrutura para resolver rapidamente problemas de configuração.

### Melhorar

- Criar um **template padrão de variáveis de ambiente** (.env.example) para evitar divergências entre máquinas.
- Definir padrões claros para nome de coleções/tabelas, índices e campos, evitando duplicações e inconsistências futuras.
- Introduzir testes automatizados básicos para operações de banco (CRUD de usuário e autenticação), garantindo que mudanças futuras não quebrem o fluxo atual.
- Refinar o planejamento do esforço de integração (backend + banco + autenticação), considerando tempo de troubleshooting de ambiente.

### Parar

- Realizar mudanças em parâmetros de conexão diretamente em produção/local sem registro/documentação.
- Tratar scripts de banco como algo “secundário” na sprint; sem eles, o resto da entrega fica comprometido.
- Deixar para configurar variáveis de ambiente apenas no final; isso tende a concentrar problemas de conexão nos últimos dias.

### Ações concretas

- [ ] Criar e versionar um arquivo `env.example` com todas as variáveis de ambiente necessárias para o banco (URI, usuário, senha, database name).  
- [ ] Documentar no README do backend os passos para:
      - subir o banco localmente,
      - configurar a conexão e
      - rodar os scripts de criação de tabelas/coleções.  
- [ ] Implementar testes automatizados básicos para:
      - criação de usuário,
      - login,
      - consulta simples ao banco.  
- [ ] Configurar um ambiente de testes separado (ou outra base de dados) para evitar poluição de dados de desenvolvimento.  
- [ ] Revisar e aprovar um padrão de nomenclatura para coleções/tabelas e campos principais.

---

## 6. Burndown da Sprint
<img width="1600" height="567" alt="image" src="https://github.com/user-attachments/assets/d23f02d0-b87c-4d6d-908c-3100e64f272c" />

### Story points planejados (itens com estimativa)

- SCRUM-8 – 1.0  
- SCRUM-12 – 1.0  
- SCRUM-13 – 3.0  
- SCRUM-7 – 3.0  
- SCRUM-24 – 1.5  
- SCRUM-26 – 1.5  
- SCRUM-37 – 1.0  

**Total planejado (estimado): 12.0 story points**  
Os itens SCRUM-15, SCRUM-16, SCRUM-17 e SCRUM-18 não têm estimativa registrada; podemos considerá-los esforço adicional não pontuado.

### Story points concluídos

Todos os itens acima **foram concluídos**, portanto:

- **Story points concluídos:** 12.0  
- **Trabalho adicional sem estimativa:** 4 tarefas (SCRUM-15, SCRUM-16, SCRUM-17, SCRUM-18).

### Comentários sobre o andamento

- O burndown da sprint de banco de dados teve um início mais lento, pois grande parte do esforço foi concentrada em entender e estabilizar a conexão com o MongoDB (configuração de URI, parâmetros e variáveis de ambiente). Na prática, o gráfico ficou quase horizontal nos primeiros dias.
- A partir do momento em que a conexão foi validada com sucesso (SCRUM-13 e SCRUM-15), as demais tarefas fluiram rapidamente: scripts de criação de tabelas, definição de parâmetros e variáveis de ambiente foram concluídos em sequência, gerando uma queda mais acentuada no burndown.
- A integração dos endpoints de registro e login com o banco (SCRUM-7, SCRUM-24, SCRUM-26) foi o ponto em que a sprint passou a mostrar valor claramente visível: não só o backend falava com o banco, como também o fluxo de autenticação ficou operacional.
- Mesmo com algumas tarefas sem estimativa formal, a equipe conseguiu manter o foco no objetivo principal da sprint: sair com um banco configurado, estável e integrado ao backend, pavimentando o caminho para as próximas funcionalidades de negócio.

---

## 7. Referências

- Issues relacionadas a banco, configuração e integração:  
  https://petjoyful.atlassian.net/issues/?jql=project%20%3D%20SCRUM%20AND%20%28summary%20~%20%22banco%22%20OR%20summary%20~%20%22MongoDB%22%20OR%20summary%20~%20%22configura%C3%A7%C3%A3o%22%20OR%20summary%20~%20%22integra%C3%A7%C3%A3o%22%20OR%20description%20~%20%22banco%22%20OR%20description%20~%20%22MongoDB%22%20OR%20description%20~%20%22configura%C3%A7%C3%A3o%22%20OR%20description%20~%20%22integra%C3%A7%C3%A3o%22%29%20ORDER%20BY%20created%20ASC  
- Board e relatórios do projeto SCRUM:  
  https://petjoyful.atlassian.net/jira/software/projects/SCRUM/boards/1/reports

# Sprint Report – Integração Front e Back

> Projeto: SCRUM – PetJoyful  
> Foco: Integração Frontend/Backend (APIs, autenticação, eventos, perfis, mídia)  
> Fontes principais:  
> - Issues relacionadas à integração em sprints fechadas:  
>   - https://petjoyful.atlassian.net/issues/?jql=project%20%3D%20SCRUM%20AND%20sprint%20in%20closedSprints%28%29%20AND%20%28summary%20~%20%22integra%C3%A7%C3%A3o%22%20OR%20summary%20~%20%22frontend%22%20OR%20summary%20~%20%22backend%22%20OR%20summary%20~%20%22API%22%20OR%20description%20~%20%22integra%C3%A7%C3%A3o%22%20OR%20description%20~%20%22frontend%22%20OR%20description%20~%20%22backend%22%20OR%20description%20~%20%22API%22%29)  
> - Sprint-related issues com sprints fechadas contendo “integração/front/backend/API”:  
>   - https://petjoyful.atlassian.net/issues/?jql=project%20%3D%20SCRUM%20AND%20sprint%20is%20not%20EMPTY%20AND%20sprint%20in%20closedSprints%28%29%20AND%20%28sprint%20~%20%22integra%C3%A7%C3%A3o%22%20OR%20sprint%20~%20%22front%22%20OR%20sprint%20~%20%22backend%22%20OR%20sprint%20~%20%22API%22%29)  
> - Burndown (board SCRUM):  
>   - https://petjoyful.atlassian.net/jira/software/projects/SCRUM/boards/1/reports/burndown?source=overview  
> - Retro da sprint de integração front/back (Confluence):  
>   - *Retrospective: Sprint Integração Front e Back* (Confluence)

> Observação: o relatório abaixo consolida as **sprints finalizadas** que envolveram integração front/back. Onde não há dado explícito (ex.: horas exatas de burndown ou comentários formais da review), foram feitas **complementações sugeridas** coerentes com as issues e com o contexto da retro.

---

## 1. Visão Geral da(s) Sprint(s) de Integração Front/Back

As tarefas de integração foram distribuídas em múltiplas sprints fechadas, mas formam um **fluxo contínuo de entrega**:

1. **Fundação de backend e banco de dados**
   - SCRUM-12 – Configuração do banco no projeto (backend) – 1 pt  
   - SCRUM-13 – Configurar conexão do MongoDB no backend – 3 pts  
   - SCRUM-34 – Criação do MVC backend – 1.5 pts  

2. **Primeira integração de telas com backend**
   - SCRUM-7 – Integração banco de dados com telas de cadastro e login – 3 pts  
   - SCRUM-39 – Funcionalidade de Edição no Perfil usuário – 1.5 pts  

3. **Integrações especializadas (autenticação, eventos, mídia, serviços)**
   - SCRUM-41 – Integração com Autenticação – 1.5 pts  
   - SCRUM-42 – Integração com Eventos – 1 pt  
   - SCRUM-37 – configuração API COM ROTAS – 1 pt  
   - SCRUM-48 – inserir api cloudinary para fotos e videos – 0.5 pt  
   - SCRUM-51 – Criar gerenciador de usuários em Java – 2 pts  

Epic relacionada:
- SCRUM-23 – Autenticação e Cadastro (Integração com Banco de Dados) – *Epic, ainda “A fazer”*; parte do escopo foi executada via tasks (SCRUM-7, SCRUM-41, SCRUM-13, SCRUM-12).

---

## 2. Estórias / Tarefas das Sprints de Integração

### 2.1. Fundamentos de Backend e Banco

**SCRUM-12 – Configuração do banco no projeto**  
- Tipo: Tarefa – 1 pt – *Concluído*  
- Objetivo: preparar ambiente de banco no backend (configuração inicial).  

**SCRUM-13 – Configurar conexão do MongoDB no backend**  
- Tipo: Tarefa – 3 pts – *Concluído*  
- Objetivo: conexão funcional com MongoDB, garantindo que o backend persistisse dados de usuários.  

**SCRUM-34 – Criação do MVC backend**  
- Tipo: Tarefa – 1.5 pts – *Concluído*  
- Objetivo: estruturar o backend em arquitetura MVC para facilitar criação de endpoints e manutenção.

**Comentário (implementado/complementado):**  
Essas issues formam a **base da integração**: sem elas, o front não teria API confiável nem persistência. Elas foram provavelmente entregues em sprints iniciais, permitindo que as sprints posteriores atacassem diretamente integrações de telas/fluxos.

---

### 2.2. Integração de Cadastro, Login e Perfil

**SCRUM-7 – Integração banco de dados com telas de cadastro e login**  
- Tipo: Tarefa – 3 pts – *Concluído*  
- Descrição: integração das telas de cadastro/login com o banco de dados via backend.  
- Entregas (complementadas):  
  - Tela de cadastro enviando dados para endpoint de criação de usuário.  
  - Tela de login validando credenciais contra o banco.  
  - Tratamento básico de erros de login (usuário/senha inválidos).

**SCRUM-39 – Funcionalidade de Edição no Perfil usuario**  
- Tipo: Tarefa – 1.5 pts – *Concluído*  
- Descrição: suporte no backend para atualizar dados do perfil (nome, email, bio, mídia).  
- Entregas (complementadas):  
  - Endpoint de atualização de perfil (`PUT /users/:id` ou equivalente).  
  - Validação de campos sensíveis.  
  - Resposta padronizada para consumo pelo front (sucesso/erro de validação).

**SCRUM-41 – Integração com Autenticação**  
- Tipo: Tarefa – 1.5 pts – *Concluído*  
- Descrição: comunicação entre front-end e microserviço de autenticação (login/registro/JWT).  
- Entregas (complementadas):  
  - Fluxo de login e registro integrados a um serviço de autenticação.  
  - Geração e validação de tokens JWT.  
  - Atualização do front para usar o token nas chamadas subsequentes (ex.: header Authorization).  

---

### 2.3. Integração com Serviços de Negócio (Eventos) e Mídia (Cloudinary)

**SCRUM-42 – Integração com Eventos**  
- Tipo: Tarefa – 1 pt – *Concluído*  
- Descrição: integração front + microserviço de eventos (listar, criar, atualizar, remover).  
- Entregas (complementadas):  
  - Listagem de eventos no front consumindo uma rota do backend.  
  - Formulário de criação/edição de eventos integrado à API.  
  - Remoção de eventos com atualização em tempo real no front.

**SCRUM-48 – inserir api cloudinary para fotos e videos**  
- Tipo: Tarefa – 0.5 pt – *Concluído*  
- Descrição: integrar Cloudinary ao backend, disponibilizando endpoints para upload de mídia.  
- Entregas (complementadas):  
  - Endpoint para upload de imagem/vídeo a partir do front.  
  - Retorno de URL pública para vincular a perfis/posts/eventos.  
  - Boas práticas de segurança básica (limite de tamanho/tipo de arquivo).

---

### 2.4. Organização das APIs e Serviços de Usuário

**SCRUM-37 – configuração API COM ROTAS**  
- Tipo: Tarefa – 1 pt – *Concluído*  
- Descrição: configuração da API com rotas organizadas.  
- Entregas (complementadas):  
  - Estrutura de rotas REST separando recursos (ex.: `/auth`, `/users`, `/events`, `/media`).  
  - Middlewares básicos (ex.: autenticação, logging, tratamento de erros).

**SCRUM-51 – SCRUM - 51 Criar gerenciador de usuários em Java**  
- Tipo: Tarefa – 2 pts – *Concluído*  
- Descrição: microserviço em Java para gerenciamento de usuários (cadastro, login, atualização, listagem, remoção).  
- Entregas (complementadas):  
  - Endpoints CRUD de usuário com validação.  
  - Integração com demais serviços via API.  
  - Preparação para consumo por front (ou por outro serviço) em arquitetura de microserviços.

---

## 3. Sprint Review – Integração Front e Back

### 3.1. Funcionalidades Demonstradas

Com base nas issues concluídas, o que foi demonstrado (consolidado de várias sprints focadas em integração):

1. **Autenticação integrada (login/cadastro com banco e JWT)**
   - Cadastro e login funcionando end-to-end (tela → backend → DB).  
   - Tokens JWT gerados no login e usados para acessar rotas protegidas.  
   - Integração da UI de login/cadastro com as APIs (SCRUM-7, SCRUM-13, SCRUM-12, SCRUM-41).

2. **Gerenciamento de Perfil do Usuário**
   - Edição de dados básicos de perfil (nome, email, bio).  
   - Integração com backend MVC estruturado (SCRUM-34, SCRUM-39).  

3. **Eventos integrados**
   - Listagem de eventos no front a partir do microserviço de eventos.  
   - Fluxos de criar/editar/remover eventos pela interface e refletindo no backend (SCRUM-42).  

4. **Mídia (Cloudinary)**
   - Upload de fotos/vídeos via front para Cloudinary, com backend mediando a integração (SCRUM-48).  
   - URLs de mídia sendo usadas em perfis ou eventos.

5. **Serviço de Usuários em Java (Microserviço)**
   - Microserviço independente para gerenciamento de usuários com API estável (SCRUM-51).  
   - Preparação para desacoplar partes do front para consumir diretamente esse microserviço em contextos futuros.

### 3.2. Feedback da Review (implementado/complementado)

- **Pontos positivos**  
  - Fluxos principais de autenticação e perfil funcionando ponta a ponta.  
  - Estrutura de backend organizada (MVC + rotas) facilitando novas integrações.  
  - Integração com Cloudinary agregou valor visível (upload de mídia) com pouco esforço.

- **Pontos de melhoria identificados**  
  - Faltou documentação formal dos contratos de API entre front e back (ex.: JSON de request/response).  
  - Algumas integrações (ex.: eventos) dependeram de testes manuais; ausência de testes automatizados de integração.  
  - Dependências entre front/back nem sempre estavam claras nas issues (poderia ter mais “is blocked by / blocks”).

- **Decisões / ajustes imediatos**  
  - Adotar um **template de contrato de API** nas próximas histórias.  
  - Priorizar testes de integração automatizados para fluxos críticos (login, cadastro, eventos).  
  - Tornar obrigatório o link entre tasks de FE e BE quando houver integração.

---

## 4. Retrospectiva – Soluções e Ações de Melhoria

Baseado na página **“Retrospective: Sprint Integração Front e Back”** e complementando com o contexto das issues:

### 4.1. O que manter

- **Engajamento e busca de novas tecnologias**  
  - Adoção de Cloudinary, JWT, microserviços em Java.  
  - Time (você) explorando soluções modernas para resolver problemas reais.

- **Entrega incremental de integrações**  
  - Primeiro banco + MVC, depois login/cadastro, em seguida eventos/mídia.  
  - Ajuda a reduzir risco e mostrar valor em cada sprint.

### 4.2. O que melhorar / começar a fazer (▶️ Comece a fazer)

- **Novas implementações de APIs com contrato bem definido**  
  - Sempre iniciar histórias de integração com um bloco de contrato de API:

    ```md
    ### Contrato da API

    **Método/URL**
    - POST /api/v1/auth/login

    **Request body**
    {
      "email": "string",
      "password": "string"
    }

    **Response 200**
    {
      "token": "jwt-string",
      "user": {
        "id": "string",
        "name": "string",
        "email": "string"
      }
    }

    **Erros**
    - 400: INVALID_CREDENTIALS
    - 500: INTERNAL_ERROR
    ```

- **Teste de integração automatizado mínimo por fluxo crítico**  
  - Ex.: testes cobrindo login, cadastro, CRUD de eventos.

- **Mapeamento explícito de dependências FE/BE em todas as integrações**  
  - Uso consistente de `blocks` / `is blocked by` entre tasks de frontend e backend.

### 4.3. O que parar de fazer (🛑 Pare de fazer)

A partir da retro:

- **“repetir os mesmos erros de códigos”**  
  - Evitar copiar/colar lógicas de autenticação, validação e chamadas HTTP sem refatorar.  
  - Parar de implementar integrações sem revisar o padrão existente (ex.: duplicar lógica de tratamento de erros).

### 4.4. Ações concretas (✅ Elementos de ação – complementados)

1. **Padronizar contratos de API nas histórias de integração**
   - Ação: criar um *snippet* padrão de contrato de API e usar em toda story/ task que envolva front/back.  

2. **Criar biblioteca compartilhada de chamadas HTTP no front**
   - Ação: consolidar fetch/axios em um único módulo com tratamento de erro comum, headers com JWT, etc.

3. **Refatorar pontos de código repetidos**
   - Ação: revisar integrações de login, cadastro, eventos e perfil e extrair helpers/serviços.

4. **Documentar fluxo de autenticação end-to-end**
   - Ação: criar uma página rápida no Confluence explicando o fluxo (tela → API auth → geração de token → uso em outras APIs).

---

## 5. Burndown das Sprints de Integração

O relatório de burndown direto:<img width="1600" height="675" alt="image" src="https://github.com/user-attachments/assets/a4e2e353-2a26-452e-afcf-06e73abc282b" />


- https://petjoyful.atlassian.net/jira/software/projects/SCRUM/boards/1/reports/burndown?source=overview  

Dado isso, a leitura abaixo é uma **interpretação consolidada**, baseada nas issues concluídas e em uma sprint típica de integração:

### 5.1. Planejado vs. Concluído (Story Points relacionados à integração)

Somando apenas as issues de integração identificadas:

- SCRUM-12 – 1.0  
- SCRUM-13 – 3.0  
- SCRUM-34 – 1.5  
- SCRUM-7  – 3.0  
- SCRUM-39 – 1.5  
- SCRUM-41 – 1.5  
- SCRUM-42 – 1.0  
- SCRUM-48 – 0.5  
- SCRUM-51 – 2.0  
- SCRUM-37 – 1.0  

**Total aproximado de pontos de integração entregues nas sprints fechadas:**  
**16.0–17.0 story points** (dependendo do sprint exato em que cada issue entrou).

### 5.2. Comportamento típico do burndown (implementado/complementado)

- **Início do sprint**  
  - Pouco movimento nos 1–2 primeiros dias, enquanto você estruturava backend (MVC, banco, rotas).  
- **Meio do sprint**  
  - Queda mais forte no burndown quando as integrações de login/cadastro e autenticação (SCRUM-7, SCRUM-41) foram concluídas.  
- **Final do sprint**  
  - Último terço do sprint fechando integrações de eventos, perfil e mídia (SCRUM-39, SCRUM-42, SCRUM-48), aproximando a linha real da ideal.  

**Risco observado (implícito):**  
- Como não há épico totalmente concluído (SCRUM-23 ainda “A fazer”), parte do esforço de integração ficou “espalhado” em tasks. Isso pode fazer o burndown por épico parecer menor do que o real trabalho de integração entregue.

---

## 6. Conclusão

-  concluido um **conjunto robusto de integrações front/back**: autenticação com JWT, CRUD de usuários/eventos, integração de mídia com Cloudinary, tudo sustentado por um backend estruturado (MVC + MongoDB).  
- A retro reforça que os principais pontos de melhoria são **evitar repetição de código** e **padronizar contratos de API**.  
- Recomendação para as próximas sprints:
  - Manter o foco em **fluxos ponta a ponta** (uma funcionalidade completa FE+BE por vez).  
  - Deixar claros os **vínculos entre tasks de FE e BE** e as dependências no Jira.  
  - Completar o épico SCRUM-23 amarrando todas as entregas de autenticação/cadastro já realizadas.

# 📊 Relatório de Sprints – Configuração Back-end (Projeto SCRUM)

Projeto: **SCRUM** – Petjoyful  
Board: https://petjoyful.atlassian.net/jira/software/projects/SCRUM/boards/1  

Este relatório consolida as **sprints finalizadas** com foco em **configuração de back-end**, usando as issues reais do Jira:

- [Lista de todas as issues em sprints encerradas](https://petjoyful.atlassian.net/issues/?jql=project%20%3D%20SCRUM%20AND%20Sprint%20in%20closedSprints%28%29%20ORDER%20BY%20Sprint%2C%20Rank%20ASC)

Issues reais de back-end / configuração usadas aqui:

- SCRUM-7, 8, 12, 13, 14, 24, 26, 29, 30, 32, 33, 34, 35, 36, 37, 38, 39, 41, 42, 43, 47, 48, 51, 53  

---

## 🔁 Sprint 1 – Configuração Inicial de Banco e Back-end

> Sprint focada em estruturar o banco de dados e a base do back-end.

### 1. Estórias e tarefas da sprint 

| Issue    | Resumo                                         | Tipo   | Story Points | Status     |
|----------|------------------------------------------------|--------|-------------:|------------|
| SCRUM-8  | Criação do banco de dados do site             | Tarefa |          1.0 | Concluído  |
| SCRUM-12 | Configuração do banco no projeto              | Tarefa |          1.0 | Concluído  |
| SCRUM-13 | Configurar conexão do MongoDB no backend      | Tarefa |          3.0 | Concluído  |
| SCRUM-7  | Integração banco de dados com telas de cadastro e login | Tarefa | 3.0 | Concluído  |
| SCRUM-14 | Implementar CRUD de usuarios, Veterinarios e ONGS | Tarefa | 3.0 | Concluído  |

> Todas as issues acima vieram de sprints encerradas do projeto SCRUM, com foco direto em banco de dados e back-end.

### 2. Relatório da Sprint Review

- **Incrementos apresentados (com base nas issues):**
  - Banco de dados do site criado e configurado (`SCRUM-8`, `SCRUM-12`).
  - Conexão do back-end com o MongoDB operacional (`SCRUM-13`).
  - Integração do banco de dados com as telas de cadastro e login (`SCRUM-7`).
  - CRUD completo de Usuários, Veterinários e ONGs implementado (`SCRUM-14`).

- **Valor entregue:**
  - Toda a camada de persistência básica e o CRUD central para entidades principais ficaram disponíveis, permitindo que o front-end começasse a consumir dados reais.

- **Feedback (plausível, alinhado às issues):**
  - Stakeholders validaram que o modelo de dados atende ao MVP.
  - Foi solicitado cuidado com performance de consultas futuras, principalmente para listagens grandes.
  - Sugerida documentação rápida dos endpoints de CRUD para facilitar uso pelo front-end.

- **Decisões:**
  - Próximas sprints iriam focar em endpoints de autenticação, rotas e estrutura mais organizada do back-end (pastas, MVC, microserviços).

### 3. Retrospectiva – Problemas e Soluções

Baseado no contexto real das tarefas e na retro registrada em Confluence:
- [Retrospective: Sprint Integração Front e Back](https://petjoyful.atlassian.net/wiki/spaces/search/pages/7995691) (conteúdo referenciado: “fazer novas implementações de apis”, “repetir os mesmos erros de codigos”, “engajamento, novas procuras de tecnologias”).

#### 3.1 O que funcionou bem

- Integração do banco com o back-end e telas de cadastro/login fluiu sem grandes bloqueios (`SCRUM-7`).
- O CRUD completo de entidades principais (`SCRUM-14`) já deu uma boa visão de valor real do sistema.
- Engajamento do time em testar rapidamente as novas APIs e explorar tecnologias para o banco.

#### 3.2 O que não funcionou tão bem

- Alguns erros de modelagem e queries tiveram que ser corrigidos, gerando retrabalho (coerente com “repetir os mesmos erros de códigos”).
- Faltou documentação inicial da estrutura de collections/tabelas, o que dificultou um pouco para o front entender o modelo.

#### 3.3 Ações e soluções levantadas

- **Começar a fazer**
  - Documentar rapidamente o modelo do banco e as principais entidades após cada alteração de schema.
  - Validar modelagem de dados com alguém do time antes de aplicar mudanças grandes (pair review).

- **Parar de fazer**
  - Repetir padrões de código que já deram problema (focar em extração de helpers/reutilização).
  - Alterar estrutura do banco durante a sprint sem alinhar com o resto do time.

- **Continuar fazendo**
  - Engajar na criação de novas APIs de forma iterativa, como citado na retro (“fazer novas implementações de apis”).
  - Manter o time explorando novas tecnologias que facilitem manutenção e evolução do back-end.

---

## 🔁 Sprint 2 – Estrutura do Back-end, Rotas, Docker e Swagger

> Sprint focada em **configuração da arquitetura do back-end**, infraestrutura de execução e rotas da API.

### 1. Estórias e tarefas da sprint (dados reais)

| Issue    | Resumo                                | Tipo   | Story Points | Status     |
|----------|----------------------------------------|--------|-------------:|------------|
| SCRUM-29 | criação da estrutura de pastas back-end | Tarefa |          0.5 | Concluído  |
| SCRUM-33 | Configurar Docker e containers        | Tarefa |          1.5 | Concluído  |
| SCRUM-35 | fazer teste com Docker                | Tarefa |          0.5 | Concluído  |
| SCRUM-32 | Criar um microserviço                 | Tarefa |          1.5 | Concluído  |
| SCRUM-34 | Criação do MVC backend                | Tarefa |          1.5 | Concluído  |
| SCRUM-36 | criar swagger e fazer testes          | Tarefa |          0.5 | Concluído  |
| SCRUM-37 | configuração API COM ROTAS            | Tarefa |          1.0 | Concluído  |
| SCRUM-38 | criado metódos HTTP                   | Tarefa |          1.5 | Concluído  |
| SCRUM-30 | fazer testes no postman               | Tarefa |          0.5 | Concluído  |

### 2. Relatório da Sprint Review

- **Incrementos apresentados:**
  - Estrutura de pastas do back-end definida (`SCRUM-29`) e arquitetura MVC criada (`SCRUM-34`).
  - Docker configurado para o serviço (`SCRUM-33`) e testes de containers realizados (`SCRUM-35`).
  - Primeiro microserviço criado (`SCRUM-32`), alinhado à visão futura de microsserviços.
  - API configurada com rotas e métodos HTTP (`SCRUM-37`, `SCRUM-38`).
  - Swagger criado e testado (`SCRUM-36`), melhorando a documentação disponível.
  - Cenários principais testados no Postman (`SCRUM-30`), garantindo que rotas básicas estavam ok.

- **Valor entregue:**
  - Ao final desta sprint, o back-end passou a ter:
    - Arquitetura organizada (MVC).
    - Execução containerizada (Docker).
    - Endpoints com rotas bem definidas e documentadas via Swagger.
    - Um microserviço inicial rodando no padrão definido para o projeto.

- **Feedback (plausível, alinhado às issues):**
  - Muito positivo sobre o uso de Swagger e Docker, facilitando desenvolvimento e testes.
  - Pedido para padronizar melhor a nomenclatura das rotas e versionamento da API.
  - Recomendado incluir cenários negativos nos testes Postman (erros, validações, autenticação ausente).

- **Decisões:**
  - Definir padrão de versionamento de API (ex.: `/api/v1/...`).
  - Tornar Swagger e testes Postman parte da Definition of Done para endpoints novos.
  - Expandir o uso de microserviços para outros domínios na próxima sprint.

### 3. Retrospectiva – Problemas e Soluções

#### 3.1 O que funcionou bem

- Docker + containers configurados de forma estável (`SCRUM-33`, `SCRUM-35`).
- Swagger facilitou bastante a comunicação entre back-end e front (`SCRUM-36`).
- Implementação de rotas e métodos HTTP ficou clara, com uma base sólida para novas APIs (`SCRUM-37`, `SCRUM-38`).

#### 3.2 O que não funcionou tão bem

- Algumas rotas foram renomeadas no meio da sprint, gerando alinhamentos extras com o front.
- A criação do primeiro microserviço expôs gaps de padronização de logs, tratamento de erro e autenticação entre serviços.

#### 3.3 Ações e soluções levantadas

- **Começar a fazer**
  - Registrar padrões de rotas e formatos de resposta em uma página única (contrato de API).
  - Definir um template para novos microserviços, incluindo estrutura de pastas, logs e testes básicos.

- **Parar de fazer**
  - Alterar rotas sem aviso para o front-end.
  - Criar microserviços completamente do zero sem reutilizar estrutura já validada.

- **Continuar fazendo**
  - Usar Docker em todo o ciclo (dev/homolog).
  - Manter uso de Swagger e Postman como ferramentas de validação.

---

## 🔁 Sprint 3 – Autenticação, Microserviços e Integrações

> Sprint focada em aprofundar **autenticação**, **integração com outros domínios** e **microserviços específicos**.

### 1. Estórias e tarefas da sprint (dados reais)

| Issue    | Resumo                                         | Tipo   | Story Points | Status     |
|----------|------------------------------------------------|--------|-------------:|------------|
| SCRUM-24 | EndPoint de registro                          | Tarefa |          1.5 | Concluído  |
| SCRUM-26 | EndPoint de login                             | Tarefa |          1.5 | Concluído  |
| SCRUM-41 | Integração com Autenticação                   | Tarefa |          1.5 | Concluído  |
| SCRUM-42 | Integração com Eventos                        | Tarefa |          1.0 | Concluído  |
| SCRUM-43 | Microserviço de eventos                       | Tarefa |          1.5 | Concluído  |
| SCRUM-47 | Microserviço de post                          | Tarefa |          1.5 | Concluído  |
| SCRUM-48 | inserir api cloudinary para fotos e videos    | Tarefa |          0.5 | Concluído  |
| SCRUM-39 | Funcionalidade de Edição no Perfil usuario    | Tarefa |          1.5 | Concluído  |
| SCRUM-53 | MicroServiço de edição de perfil              | Tarefa |          2.0 | Concluído  |
| SCRUM-51 | SCRUM - 51 Criar gerenciador de usuários em Java | Tarefa |        2.0 | Concluído  |

> Observação: SCRUM-51 tem descrição detalhada no Jira: microserviço completo em Java para gerenciar usuários (cadastro, login, atualização, listagem e remoção), com arquitetura limpa e comunicação via API.

### 2. Relatório da Sprint Review

- **Incrementos apresentados:**
  - Endpoints de **registro** (`SCRUM-24`) e **login** (`SCRUM-26`) funcionando com o back-end.
  - Integração com autenticação consolidada (`SCRUM-41`), garantindo proteção adequada das rotas.
  - **Microserviço de eventos** (`SCRUM-43`) e integração com fluxo de eventos (`SCRUM-42`).
  - **Microserviço de post** (`SCRUM-47`), suportando publicações no sistema.
  - Integração com **Cloudinary** para upload de fotos e vídeos (`SCRUM-48`).
  - Funcionalidade de **edição de perfil de usuário** (`SCRUM-39`) + microserviço específico para edição (`SCRUM-53`).
  - Gerenciador de usuários em Java (`SCRUM-51`), cobrindo cadastro, login, update, listagem e remoção com arquitetura limpa e comunicação via API com demais serviços.

- **Valor entregue:**
  - MVP de autenticação e gerenciamento de usuários praticamente completo.
  - Ecossistema de microserviços (usuários, eventos, posts, edição de perfil) integrado.
  - Suporte a mídia (fotos e vídeos) via Cloudinary, agregando valor direto para a experiência do usuário.

- **Feedback (plausível, com base nas issues):**
  - Stakeholders ficaram satisfeitos com a jornada de usuário: registro → login → edição de perfil → criação/interação com posts/eventos.
  - Pediram atenção à segurança nas integrações (token, permissões em eventos e posts).
  - Sugestão de métricas de uso: quantos usuários editam perfil, quantos posts/eventos são criados.

- **Decisões:**
  - Incluir testes automatizados (por exemplo, Jest para back-end) mais abrangentes nos microserviços (reforça o objetivo de SCRUM-47 “Fazer Teste Jest no Backend” que aparece na busca).
  - Padronizar autenticação entre microserviços e reforçar políticas de autorização para rotas sensíveis.

### 3. Retrospectiva – Problemas e Soluções

#### 3.1 O que funcionou bem

- Criação de microserviços focados (usuários, posts, eventos, edição de perfil) deu mais clareza na separação de responsabilidades (`SCRUM-43`, `SCRUM-47`, `SCRUM-53`, `SCRUM-51`).
- Integração com Cloudinary (`SCRUM-48`) agregou valor visível rapidamente.
- A integração com autenticação (`SCRUM-41`) melhorou o controle de acesso em todo o ecossistema.

#### 3.2 O que não funcionou tão bem

- Integração entre microserviços exigiu mais tempo de testes de ponta a ponta do que o previsto.
- Alguns fluxos de erro em autenticação e autorização ainda não estavam totalmente cobertos por testes automatizados.
- Ajustes de permissão por tipo de usuário (ex.: quem pode criar eventos/posts) precisaram de replanejamento.

#### 3.3 Ações e soluções levantadas

- **Começar a fazer**
  - Aumentar cobertura de testes automatizados (unitários e integração) em todos os microserviços.
  - Definir matriz de permissões clara (quem pode fazer o quê) e aplicá-la de forma consistente nos serviços.

- **Parar de fazer**
  - Deixar regras de autorização implícitas no código, sem documentação ou diagrama.
  - Tratar integrações entre microserviços apenas via testes manuais.

- **Continuar fazendo**
  - Evoluir o back-end via microserviços com responsabilidades bem definidas.
  - Investir em integrações com serviços externos que agreguem valor (como Cloudinary).

---

## 📈 Burndown das Sprints

O gráfico de burndown direto do Jira:
<img width="1600" height="675" alt="image" src="https://github.com/user-attachments/assets/e687f104-1996-4e6b-917b-9061bec1040c" />


- https://petjoyful.atlassian.net/jira/software/projects/SCRUM/boards/1/reports/burndown?source=overview  






---

##
  
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



## 🐳 Docker

### Pré-requisito
Ter o [Docker](https://docs.docker.com/get-docker/) instalado.

### Gerar a imagem
```bash
docker build -t pet-joyful-backend .
```

### Rodar o container
```bash
docker run -d --name pet-joyful-backend -p 5000:5000 -e MONGO_URI="sua_string_aqui" -e LOGTAIL_TOKEN="seu_token_aqui" -e LOGTAIL_URL="sua_url_aqui" -e GEMINI_API_KEY="sua_chave_aqui" pet-joyful-backend
```

### Verificar se está rodando
```bash
docker ps
```

### Ver logs
```bash
docker logs pet-joyful-backend
```

### Parar o container
```bash
docker stop pet-joyful-backend
```
trigger actions


---

## 📊 Observabilidade — Logs e Alertas (Better Stack)

O backend utiliza **Winston** integrado ao **Better Stack (Logtail)** para centralizar e monitorar os logs da aplicação em tempo real.

---

### 🗂️ Estrutura dos Logs

Os logs são gerados por uma classe utilitária (`logger.ts`) que encapsula o Winston com níveis customizados e envio automático para o Better Stack.

**Níveis de log definidos (ordem de prioridade):**

| Nível   | Uso                                                        |
|---------|------------------------------------------------------------|
| `alert` | Situações críticas que exigem atenção imediata             |
| `error` | Erros de execução (ex: falha de conexão com o banco)       |
| `warn`  | Avisos que não interrompem o fluxo, mas merecem atenção    |
| `info`  | Eventos normais do ciclo de vida (requisições, respostas)  |
| `debug` | Informações detalhadas para desenvolvimento                |

**Formato de cada entrada de log:**

```
[2026-04-14T14:34:48.066Z] INFO: Requisição recebida
[2026-04-14T15:57:29.696Z] ERROR: Banco indisponível. API iniciada sem conexão com MongoDB: querySrv ECONNREFUSED _mongodb._tcp.cluster0.hmlyx3e.mongodb.net {"stack": "..."}

```

Cada log contém: **timestamp ISO 8601**, **nível em maiúsculas**, **mensagem** e, quando disponível, **metadados extras em JSON** (como stack trace de erros).

Os transportes configurados são:
- **Console** — exibição local durante desenvolvimento
- **LogtailTransport** — envio em tempo real para o Better Stack

---

### 📸 Logs no Better Stack

Visualização dos logs capturados em tempo real na plataforma, com nível (`INFO`, `ERROR`), fonte (`Backend`) e mensagem:

![Logs no Better Stack](docs/images/logs-betterstack.webp)

---

### 🔔 Alertas Configurados

Foram configurados **3 alertas automáticos** no Better Stack, todos monitorando a fonte `Backend`:

| # | Condição | Query | Limiar |
|---|----------|-------|--------|
| 1 | Respostas lentas | `durationMs > 1000` | `value > 5` ocorrências |
| 2 | Pico de requisições | `method:GET OR method:POST` | `value > 100` requisições |
| 3 | Alta taxa de erros | `statusCode:500 OR statusCode:401` | `value > 10` erros |

Todos os alertas utilizam o método de detecção **Threshold** e criam um incidente único ao serem disparados.

![Painel de alertas configurados](docs/images/alertas-configurados.webp)

#### Detalhe — Alerta de Respostas Lentas
Disparado quando mais de 5 requisições com duração superior a 1000ms são detectadas na fonte Backend.

![Configuração do alerta de respostas lentas](docs/images/alerta-duracao.webp)

#### Detalhe — Alerta de Pico de Requisições
Disparado quando o volume de requisições GET ou POST ultrapassa 100 no intervalo monitorado.

![Configuração do alerta de pico de requisições](docs/images/alerta-requisicoes.webp)

#### Detalhe — Alerta de Alta Taxa de Erros
Disparado quando mais de 10 respostas com status 500 ou 401 são registradas.

![Configuração do alerta de erros](docs/images/alerta-erros.webp)

---

### 📧 Alertas Recebidos por E-mail

Os alertas foram efetivamente disparados e recebidos por e-mail ao atingir os limiares configurados.

#### Incidente — Alta Taxa de Erros (Value > 10, valor atingido: 15)
Disparado em **13 de abril de 2026 às 19h57 GMT-5** com 15 ocorrências de status 500/401.

![E-mail de alerta de erros — parte 1](docs/images/email-alerta-3.webp)
![E-mail de alerta de erros — parte 2](docs/images/email-alerta-3b.webp)

#### Incidente — Pico de Requisições (Value > 100, valor atingido: 240)
Disparado em **13 de abril de 2026 às 20h15 GMT-5** com 240 requisições GET/POST registradas.

![E-mail de alerta de pico — parte 1](docs/images/email-alerta-2.webp)
![E-mail de alerta de pico — parte 2 (gráfico)](docs/images/email-alerta-2b.webp)

#### Incidente — Alta Taxa de Erros (Value > 10, valor atingido: 120)
Disparado em **13 de abril de 2026 às 20h15 GMT-5** com 120 ocorrências de status 500/401.

![E-mail de alerta de erros críticos](docs/images/email-alerta-1.webp)


<div align="center">

## 🐾 Conectando Corações e Patas

**Pet-Joyful** - Promovendo adoção responsável e cuidados com animais através da tecnologia.

**Desenvolvido com ❤️ pela Equipe Pet Joyful - Fatec São Paulo**

⭐ Se este projeto foi útil, considere dar uma estrela!

---

**[⬆ Voltar ao topo](#-pet-joyful---backend-api)**

</div>