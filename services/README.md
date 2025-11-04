# Microservices (scaffold)

Este diretório contém os serviços scaffold para o projeto divididos em:

- `auth-service` (3001)
- `users-service` (3002)
- `messages-service` (3003)
- `reports-service` (3004)
- `gateway-service` (3000)
- `shared` (middlewares/utilities)

Cada serviço é um pequeno app Express com rotas placeholder. Para usar localmente:

1. Entre na pasta do serviço, copie `.env.example` para `.env` e preencha as variáveis.
2. Rode `npm install` e `npm run dev`.
3. Inicie primeiro os serviços individuais e o `gateway-service` se quiser expor via 3000.
