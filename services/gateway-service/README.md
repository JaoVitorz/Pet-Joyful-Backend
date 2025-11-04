# gateway-service

Gateway que roteia chamadas externas para os serviços internos:

- /api/auth -> auth-service (3001)
- /api/users -> users-service (3002)
- /api/messages -> messages-service (3003)
- /api/reports -> reports-service (3004)

Port: 3000

Como rodar:

1. Copie `.env.example` para `.env` e preencha variáveis.
2. npm install
3. npm run dev
