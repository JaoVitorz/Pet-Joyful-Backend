# 🐾 Pet Joyful - Backend API
## 👥 Integrantes do Grupo
João Vitor dos Santos de Jesus
Mateus Fernandes Alves
Elton da Costa

## 📝 Sobre o Projeto

O Pet Joyful é uma plataforma backend desenvolvida para conectar tutores de pets a serviços especializados. O sistema utiliza arquitetura de microsserviços e oferece uma API RESTful completa seguindo o padrão MVC.

## 🎯 Requisitos Implementados
✅ API RESTful completa (GET, POST, PUT, DELETE)
✅ Arquitetura MVC (Models, Views, Controllers)
✅ Microsserviços (Auth Service + Pet Service)
✅ Documentação Swagger automática
✅ Hospedagem em Nuvem (Railway/Render)

## 🏗️ Arquitetura - Microsserviços

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
         
Microsserviço 1: Auth Service
Autenticação de usuários (JWT)
Gerenciamento de perfis (adotante, ONG, veterinário)
Endpoints: /api/auth/register, /api/auth/login, /api/users/*
Microsserviço 2: Pet Service
Gerenciamento de pets
Vinculação pet ↔ proprietário
Endpoints: /api/pets/*

## 🛠️ Tecnologias Utilizadas
### Backend
Node.js v18+ com Express v5
MongoDB com Mongoose v8
JWT para autenticação
Bcryptjs para criptografia de senhas
DevOps
Docker e Docker Compose
Nginx como proxy reverso (opcional)
Railway/Render para hospedagem
Documentação
Swagger UI Express (OpenAPI 3.0)
Documentação disponível em: /api-docs

## 🚀 Como Executar Localmente

### Pré-requisitos
Node.js 18+
MongoDB (local ou Atlas)
Git

### 1️⃣ Clone o repositório
bash
git clone https://github.com/JaoVitorz/Pet-Joyful-Backend.git
cd Pet-Joyful-Backend
### 2️⃣ Configure as variáveis de ambiente
Auth Service (.env na pasta auth-service/)

env
PORT=5000
MONGO_URL=mongodb+srv://joaojesus:oULyKDlXfS0Stg4M@cluster0.hmlyx3e.mongodb.net/petjoyful?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=a2e6887fa57442d1040baa0393f31bcac2bfc15d486fed1e8e8dfaa197e3cc079d46c994790c8a871b404d49c54cf5e5d339a75befcd4860a5b4844a95fd7c83
API_KEY=3e3c34efc8bcee95716a861494d89a9ddbdef722c0303e7b2b3de6a9e539d861
PET_SERVICE_URL=http://pet-service:5001
Pet Service (.env na pasta pet-service/)

env
PORT=5001
MONGO_URL=mongodb+srv://joaojesus:oULyKDlXfS0Stg4M@cluster0.hmlyx3e.mongodb.net/petjoyful?retryWrites=true&w=majority&appName=Cluster0 
JWT_SECRET=a2e6887fa57442d1040baa0393f31bcac2bfc15d486fed1e8e8dfaa197e3cc079d46c994790c8a871b404d49c54cf5e5d339a75befcd4860a5b4844a95fd7c83
API_KEY=3e3c34efc8bcee95716a861494d89a9ddbdef722c0303e7b2b3de6a9e539d861
AUTH_SERVICE_URL=http://auth-service:5000

### 3️⃣ Instale as dependências
bash
#### Auth Service
cd auth-service
npm install

#### Pet Service
cd ../pet-service
npm install
### 4️⃣ Execute os serviços
bash
#### Auth Service (Terminal 1)
cd auth-service
npm run dev

#### Pet Service (Terminal 2)
cd pet-service
npm run dev
### 5️⃣ Acesse a documentação
Auth Service: http://localhost:5000/api-docs
Pet Service: http://localhost:5001/api-docs

# 📡 Endpoints da API
Auth Service (http://localhost:5000)
Método	Endpoint	Descrição	Autenticação
POST	/api/auth/register	Cadastrar novo usuário	Não
POST	/api/auth/login	Login (retorna JWT)	Não
GET	/api/users	Listar todos os usuários	API Key
GET	/api/users/:id	Buscar usuário por ID	API Key
PUT	/api/users/:id	Atualizar usuário	API Key
DELETE	/api/users/:id	Deletar usuário	API Key
Pet Service (http://localhost:5001)
Método	Endpoint	Descrição	Autenticação
POST	/api/pets	Cadastrar novo pet	API Key
GET	/api/pets	Listar todos os pets	API Key
GET	/api/pets/:id	Buscar pet por ID	API Key
GET	/api/pets/owner/:ownerId	Buscar pets por proprietário	API Key
PUT	/api/pets/:id	Atualizar pet	API Key
DELETE	/api/pets/:id	Deletar pet	API Key

# 🔐 Autenticação

API Key (Para comunicação entre serviços)
Adicione o header em todas as requisições:

http
x-api-key: petjoyful_api_key_2025
JWT Token (Para endpoints protegidos - futuro)
http
Authorization: Bearer <seu_token_jwt>

## 📋 Exemplos de Requisições

### Registrar Usuário
bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "senha123",
    "tipo": "adotante"
  }'
### Criar Pet
bash
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

Auth Service: https://pet-joyful-auth.up.railway.app
Pet Service: https://pet-joyful-pets.up.railway.app

# 📁 Estrutura do Projeto

Pet-Joyful-Backend/
├── auth-service/           # Microsserviço de Autenticação
│   ├── src/
│   │   ├── controllers/    # Lógica de negócio (Controller)
│   │   ├── models/         # Schemas do MongoDB (Model)
│   │   ├── routes/         # Definição de rotas
│   │   ├── middlewares/    # API Key, JWT, etc.
│   │   ├── config/         # Swagger, DB
│   │   └── app.js          # Express App
│   ├── Dockerfile
│   └── package.json
│
├── pet-service/            # Microsserviço de Pets
│   ├── src/
│   │   ├── controllers/    # Lógica de negócio (Controller)
│   │   ├── models/         # Schemas do MongoDB (Model)
│   │   ├── routes/         # Definição de rotas
│   │   └── app.js
│   └── package.json
│
├── docker-compose.yml      # Orquestração dos serviços
└── README.md

# 📅 Entregas de Sprints

| Sprint | Atividade | Início | Término |
|--------|------------|--------|----------|
| 1 | Integração de Dados com Telas de Cadastro e Login | 10/09/2025 | 28/10/2025 |
| 1 | Criação de Banco de Dados do Site | 10/09/2025 | 02/10/2025 |
| 2 | Configuração do Banco no Projeto | 25/09/2025 | 28/10/2025 |
| 2 | Configurar Conexão do Mongo no Back-End | 25/09/2025 | 21/10/2025 |
| 3 | Implementar CRUD de Usuários, Veterinários e ONGs | 25/09/2025 | 28/10/2025 |
| 3 | Endpoint de Registro | 25/09/2025 | 28/10/2025 |
| 3 | Endpoint de Login | 25/09/2025 | 28/10/2025 |
| 4 | Fazer Testes no Postman | 13/10/2025 | 21/10/2025 |
| 4 | Implementação de Microsserviços | 28/10/2025 | 28/10/2025 |
| 4 | Sprint Final do Backend | — | — |

---

📌 **Resumo:**
- **Sprint 1:** Foco na criação do banco de dados e integração com telas.  
- **Sprint 2:** Configuração do banco e conexão com o backend.  
- **Sprint 3:** Implementação dos CRUDs e endpoints principais.  
- **Sprint 4:** Testes, refino e finalização do backend com microsserviços.

# 🤝 Contribuindo
Faça um fork do projeto
Crie uma branch: git checkout -b feature/nova-funcionalidade
Commit suas mudanças: git commit -m 'feat: adiciona nova funcionalidade'
Push para a branch: git push origin feature/nova-funcionalidade
Abra um Pull Request
📝 Licença
Este projeto está sob a licença ISC.

📞 Contato
Emails: joao.jesus18@fatec.sp.gov.br, mateus.alves10@fatec.sp.gov.br, elton.costa@fatec.sp.gov.br
Documentação Swagger: /api-docs
⌨️ com ❤️ por [Equipe Pet Joyful]

