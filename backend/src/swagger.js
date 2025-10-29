// backend/src/swagger.js
// Gera swagger-output.json automaticamente com base nas rotas do app

const swaggerAutogenMod = await import('swagger-autogen');
const swaggerAutogen =
  swaggerAutogenMod.default || swaggerAutogenMod;

const doc = {
  info: {
    title: 'Pet Joyful API',
    description: 'Documentação automática da API Pet Joyful',
    version: '1.0.0'
  },
  host: 'pet-joyful-backend-1.onrender.com',
  schemes: ['https'],
  securityDefinitions: {
    BearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Token JWT no formato Bearer'
    }
  },
};

// 🚀 Importante: o arquivo será salvo dentro de src (onde o app lê)
const outputFile = './backend/src/swagger-output.json';

// ✅ O autogen vai analisar as rotas principais
const endpointsFiles = [
  './backend/src/routes/index.js',
  './backend/src/routes/userRoutes.js',
  './backend/src/routes/messagesRoutes.js'
];

try {
  await swaggerAutogen(outputFile, endpointsFiles, doc);
  console.log('✅ swagger-output.json gerado com sucesso em', outputFile);
} catch (err) {
  console.error('❌ Erro ao gerar swagger-output.json:', err);
}
