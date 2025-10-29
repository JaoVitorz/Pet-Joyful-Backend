🐾 Pet Joyful - Backend API
👥 Integrantes do Grupo

João Vitor dos Santos de Jesus

Mateus Fernandes Alves

Elton da Costa

📝 Sobre o Projeto

Pet Joyful é uma plataforma backend desenvolvida para conectar tutores de pets a serviços especializados.
O sistema segue o padrão MVC e utiliza arquitetura de microsserviços, oferecendo uma API RESTful completa.

🎯 Requisitos Implementados

✅ API RESTful completa (GET, POST, PUT, DELETE)

✅ Arquitetura MVC (Models, Views, Controllers)

✅ Microsserviços (Auth Service + Pet Service)

✅ Documentação Swagger automática

✅ Hospedagem em nuvem (Vercel)

🏗️ Arquitetura - Microsserviços
┌─────────────────┐      ┌─────────────────┐
│  Auth Service   │      │  Pet Service    │
│   (Porta 5000)  │◄────►│  (Porta 5001)   │
└────────┬────────┘      └────────┬────────┘
         │                        │
         └────────┬───────────────┘
                  │
         ┌────────▼────────┐
         │    MongoDB      │
         └─────────────────┘

🔐 Auth Service

Autenticação de usuários (JWT)

Gerenciamento de perfis (adotante, ONG, veterinário)

Endpoints:

POST /api/auth/register

POST /api/auth/login

GET/PUT/DELETE /api/users/*

🐶 Pet Service

Gerenciamento de pets

Associação entre pet ↔ proprietário

Endpoints:

GET/POST/PUT/DELETE /api/pets/*

🛠️ Tecnologias Utilizadas
Backend

Node.js v18+ com Express v5

MongoDB + Mongoose v8

JWT para autenticação

Bcrypt.js para criptografia de senhas

DevOps

Docker e Docker Compose

Nginx (proxy reverso, opcional)

Railway/Render para hospedagem

Documentação

Swagger UI Express (OpenAPI 3.0)

Disponível em /api-docs

🚀 Como Executar Localmente
🔧 Pré-requisitos

Node.js 18+

MongoDB (local ou Atlas)

Git

1️⃣ Clone o repositório
git clone https://github.com/JaoVitorz/Pet-Joyful-Backend.git
cd Pet-Joyful-Backend

2️⃣ Configure as variáveis de ambiente
Auth Service (auth-service/.env)
PORT=5000
MONGO_URL=<sua_url_mongodb>
JWT_SECRET=<seu_jwt_secret>
API_KEY=<sua_api_key>
PET_SERVICE_URL=http://pet-service:5001

Pet Service (pet-service/.env)
PORT=5001
MONGO_URL=<sua_url_mongodb>
JWT_SECRET=<seu_jwt_secret>
API_KEY=<sua_api_key>
AUTH_SERVICE_URL=http://auth-service:5000


⚠️ Importante: Nunca exponha segredos ou URLs sensíveis em arquivos públicos.

3️⃣ Instale as dependências
# Auth Service
cd auth-service
npm install

# Pet Service
cd ../pet-service
npm install

4️⃣ Execute os serviços
# Terminal 1
cd auth-service
npm run dev

# Terminal 2
cd pet-service
npm run dev

5️⃣ Acesse a documentação

Auth Service: http://localhost:5000/api-docs

Pet Service: http://localhost:5001/api-docs

🐳 Executar com Docker
# Subir todos os serviços
docker-compose up -d

# Verificar logs
docker-compose logs -f

# Parar os serviços
docker-compose down

📡 Endpoints da API
🔐 Auth Service (http://localhost:5000)
Método	Endpoint	Descrição	Autenticação
POST	/api/auth/register	Cadastrar novo usuário	Não
POST	/api/auth/login	Login (retorna JWT)	Não
GET	/api/users	Listar todos os usuários	API Key
GET	/api/users/:id	Buscar usuário por ID	API Key
PUT	/api/users/:id	Atualizar usuário	API Key
DELETE	/api/users/:id	Deletar usuário	API Key
🐾 Pet Service (http://localhost:5001)
Método	Endpoint	Descrição	Autenticação
POST	/api/pets	Cadastrar novo pet	API Key
GET	/api/pets	Listar todos os pets	API Key
GET	/api/pets/:id	Buscar pet por ID	API Key
GET	/api/pets/owner/:ownerId	Buscar pets por proprietário	API Key
PUT	/api/pets/:id	Atualizar pet	API Key
DELETE	/api/pets/:id	Deletar pet	API Key
🔐 Autenticação
API Key (comunicação entre microsserviços)

Adicione o cabeçalho em todas as requisições:

x-api-key: petjoyful_api_key_2025

JWT Token (para endpoints protegidos - futuro)
Authorization: Bearer <seu_token_jwt>

📋 Exemplos de Requisições
Registrar Usuário
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "senha123",
    "tipo": "adotante"
  }'

Criar Pet
curl -X POST http://localhost:5001/api/pets \
  -H "Content-Type: application/json" \
  -H "x-api-key: petjoyful_api_key_2025" \
  -d '{
    "name": "Rex",
    "species": "dog",
    "breed": "Golden Retriever",
    "age": 3,
    "ownerId": "673f8a1b2c3d4e5f6g7h8i9j"
  }'

📁 Estrutura do Projeto
Pet-Joyful-Backend/
├── auth-service/           
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── config/
│   │   └── app.js
│   ├── Dockerfile
│   └── package.json
│
├── pet-service/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   └── package.json
│
├── docker-compose.yml
└── README.md

📅 Entregas de Sprints
Sprint	Período	Entregas
1	Out/2025	Configuração inicial + Estrutura MVC
2	Out/2025	Sistema de autenticação + CRUD de usuários
3	Out/2025	Microsserviço de Pets + Documentação Swagger
4	Out/2025	Deploy em produção (Railway/Render)
🤝 Contribuindo

Faça um fork do projeto

Crie uma branch: git checkout -b feature/nova-funcionalidade

Commit suas mudanças: git commit -m 'feat: adiciona nova funcionalidade'

Envie para o repositório: git push origin feature/nova-funcionalidade

Abra um Pull Request

📝 Licença

Este projeto está licenciado sob a ISC License.

📞 Contato

GitHub/Emails:

joao.jesus18@fatec.sp.gov.br

mateus.alves10@fatec.sp.gov.br

elton.costa@fatec.sp.gov.br

Swagger Docs: /api-docs

⌨️ com ❤️ pela Equipe Pet Joyful
