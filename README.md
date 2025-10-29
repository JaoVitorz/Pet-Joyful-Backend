# Pet-Joyful-Backend

## Sobre o projeto

Pet Joyful — Backend é um microserviço em Node.js/Express responsável por oferecer a API REST para gerenciar usuários (adotantes, ONGs e veterinários) do ecossistema Pet Joyful. O objetivo principal é prover endpoints seguros e escaláveis para autenticação, cadastro, leitura, atualização e remoção de usuários, mantendo a persistência em MongoDB e facilitando a integração com outros serviços (frontend em Next.js, serviços Java, etc.).

- Tecnologias principais: Node.js, Express, MongoDB, Mongoose, bcrypt.
- Escopo: gerenciamento de usuários e integração via rotas REST (CRUD).
- Objetivo: fornecer uma API limpa e reutilizável para o restante da plataforma Pet Joyful.

## Como este repositório está organizado (visão geral)

- backend/src/app.js — ponto de entrada do serviço e configuração das rotas.
- backend/src/controllers — lógica das operações (ex.: criação e autenticação).
- backend/src/models — esquemas e modelos do Mongoose (ex.: usuário).
- backend/src/database — conexão com MongoDB.
- backend/src/routes — definição das rotas da API.

## Observações rápidas

- Variáveis de ambiente: configure `MONGO_URL` para apontar ao MongoDB desejado.
- Porta padrão: 5000 (configurada em `backend/src/app.js`).

## Começando

### Pré-requisitos

- Node.js 18.x ou superior
- MongoDB instalado localmente ou string de conexão
- NPM ou Yarn

### Instalação e Execução

1. Clone o repositório

```bash
git clone https://github.com/JaoVitorz/Pet-Joyful-Backend.git
cd Pet-Joyful-Backend
```

2. Instale as dependências

```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente

```bash
# Crie um arquivo .env na raiz do projeto
MONGO_URL=sua_url_mongodb
PORT=5000
```

4. Execute o servidor de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

### Usando Docker

```bash
# Construir e executar os containers
docker-compose up -d

# Parar os containers
docker-compose down
```

O servidor estará rodando em `http://localhost:5000`
# 🐾 Pet Joyful

## Sobre o Projeto
O Pet Joyful é uma plataforma inovadora desenvolvida para conectar tutores de pets a serviços especializados para seus animais de estimação. O sistema oferece uma API robusta que permite o gerenciamento de usuários e autenticação, sendo parte de uma arquitetura em microsserviços que visa facilitar o acesso a serviços pet de forma segura e eficiente.

## 📚 Documentação do Projeto

### Funcionalidades Principais
- Autenticação segura de usuários
- Gerenciamento de perfis de usuários
- Integração com serviços via API RESTful
- Documentação automática via Swagger

### Requisitos Funcionais
- Cadastro e autenticação de usuários
- Gerenciamento de perfis
- Controle de acesso via tokens JWT
- Documentação de API acessível via Swagger UI

## 📅 Entregas de Sprints

| Sprint | Período | Entregas |
|--------|---------|----------|
| 1      | Out/2025| - Configuração inicial do projeto<br>- Implementação da estrutura base da API<br>- Setup do ambiente Docker |
| 2      | Out/2025| - Implementação do sistema de autenticação<br>- Desenvolvimento dos endpoints de usuários<br>- Integração com MongoDB |
| 3      | Out/2025| - Documentação da API com Swagger<br>- Implementação de middlewares de segurança<br>- Configuração do Nginx |

## 👥 Integrantes
- João Vitor (Owner do Repositório)
- [Adicionar outros integrantes]

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js com Express
- MongoDB com Mongoose
- JWT para autenticação
- Bcrypt para criptografia

### DevOps
- Docker e Docker Compose
- Nginx como proxy reverso

### Documentação
- Swagger UI Express
- Swagger Autogen

### Ferramentas de Desenvolvimento
- Git para controle de versão
- NPM para gerenciamento de pacotes
- Nodemon para desenvolvimento

## 🚀 Como Executar o Projeto

1. Clone o repositório:
```bash
git clone https://github.com/JaoVitorz/Pet-Joyful-Backend.git
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Acesse a documentação da API:
```
http://localhost5000/api-docs
```

## 📝 Licença
Este projeto está sob a licença ISC.

---

⌨️ com ❤️ por [Equipe Pet Joyful]
