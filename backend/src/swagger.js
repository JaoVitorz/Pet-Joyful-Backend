// backend/src/swagger.js
// Gera swagger-output.json automaticamente com base nas rotas do app

const swaggerAutogenMod = await import("swagger-autogen");
const swaggerAutogen = swaggerAutogenMod.default || swaggerAutogenMod;

const doc = {
  info: {
    title: "Pet Joyful API",
    description: "Documentação automática da API Pet Joyful",
    version: "1.0.0",
  },
  host: "pet-joyful-backend-1.onrender.com",
  schemes: ["https"],
  securityDefinitions: {
    BearerAuth: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description:
        "Token JWT no formato Bearer [token]. Exemplo: Bearer eyJhbGciOiJIUzI1NiIs...",
    },
  },
  definitions: {
    LoginInput: {
      type: "object",
      properties: {
        email: { type: "string", example: "user@example.com" },
        senha: { type: "string", example: "123456" },
      },
    },
    RegisterInput: {
      type: "object",
      properties: {
        nome: { type: "string", example: "John Doe" },
        email: { type: "string", example: "user@example.com" },
        senha: { type: "string", example: "123456" },
        tipo: { type: "string", example: "cliente" },
      },
    },
    AuthResponse: {
      type: "object",
      properties: {
        token: { type: "string" },
        user: {
          type: "object",
          properties: {
            id: { type: "string" },
            nome: { type: "string" },
            email: { type: "string" },
            tipo: { type: "string" },
          },
        },
      },
    },
  },
};

// 🚀 Importante: o arquivo será salvo dentro de src (onde o app lê)
const outputFile = "./backend/src/swagger-output.json";

// ✅ O autogen vai analisar as rotas principais
const endpointsFiles = [
  "./backend/src/routes/index.js",
  "./backend/src/routes/userRoutes.js",
  "./backend/src/routes/messagesRoutes.js",
  "./backend/src/routes/authRoutes.js",
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
