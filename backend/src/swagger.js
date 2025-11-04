// backend/src/swagger.js
// Gera swagger-output.json automaticamente com base nas rotas do app

const swaggerAutogenMod = await import("swagger-autogen");
const swaggerAutogen = swaggerAutogenMod.default || swaggerAutogenMod;

const doc = {
  openapi: "3.0.0",
  info: {
    title: "Pet Joyful API",
    version: "1.0.0",
    description:
      "Documentação completa da API Pet Joyful — gerenciamento de usuários, autenticação, mensagens e denúncias.",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Servidor de teste",
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Insira o token JWT no formato **Bearer {token}**",
      },
      AdminKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "x-admin-key",
        description:
          "Chave de admin para operações privilegiadas (use o valor de ADMIN_KEY do .env)",
      },
    },
    schemas: {
      User: {
        type: "object",
        required: ["nome", "email", "senha"],
        properties: {
          nome: { type: "string", example: "João Silva" },
          email: { type: "string", example: "joao@email.com" },
          senha: { type: "string", example: "123456" },
          tipo: { type: "string", example: "cliente" },
        },
      },
      Login: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: { type: "string", example: "joao@email.com" },
          senha: { type: "string", example: "123456" },
        },
      },
      Message: {
        type: "object",
        required: ["nome", "email", "mensagem"],
        properties: {
          nome: { type: "string", example: "Maria" },
          email: { type: "string", example: "maria@email.com" },
          mensagem: { type: "string", example: "Gostei do post!" },
          postId: { type: "string", example: "65b8d7b2b9e" },
        },
      },
      Report: {
        type: "object",
        required: ["descricao", "alvoId", "alvoTipo"],
        properties: {
          nome: { type: "string", example: "Carlos" },
          email: { type: "string", example: "carlos@email.com" },
          descricao: { type: "string", example: "Conteúdo ofensivo detectado" },
          alvoId: { type: "string", example: "123abc456" },
          alvoTipo: { type: "string", example: "mensagem" },
        },
      },
    },
  },
  security: [{ BearerAuth: [] }],
  tags: [
    {
      name: "Auth",
      description: "Autenticação e gerenciamento de sessão do usuário",
    },
    { name: "Users", description: "Operações relacionadas a usuários" },
    { name: "Messages", description: "Mensagens e comentários em postagens" },
    { name: "Reports", description: "Denúncias e moderação de conteúdo" },
  ],
};

// 🚀 Importante: o arquivo será salvo dentro de src (onde o app lê)
const outputFile = "./swagger-output.json";

// ✅ O autogen vai analisar as rotas principais
const endpointsFiles = [
  "./routes/index.js",
  "./routes/userRoutes.js",
  "./routes/messagesRoutes.js",
  "./routes/authRoutes.js",
];

// Opções para garantir formatação consistente
const options = {
  openapi: "3.0.0", // Versão do OpenAPI/Swagger
  autoHeaders: true, // Adiciona headers automaticamente
  autoQuery: true, // Adiciona query parameters automaticamente
  autoBody: true, // Adiciona body parameters automaticamente
  indentation: "  ", // 2 espaços para indentação
};

try {
  await swaggerAutogen(outputFile, endpointsFiles, doc, options);
  console.log("✅ swagger-output.json gerado com sucesso em", outputFile);
} catch (err) {
  console.error("❌ Erro ao gerar swagger-output.json:", err);
}
