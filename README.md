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
