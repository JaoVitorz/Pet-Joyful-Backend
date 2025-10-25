// swagger.js (ESM)
// Gera swagger-output.json com base nas rotas do app

// Observação: este arquivo roda como ESM (package.json contém "type": "module").
// Usa import dinâmico para carregar swagger-autogen compatível com ESM.

const swaggerAutogenMod = await import('swagger-autogen');
const swaggerAutogen = (swaggerAutogenMod && swaggerAutogenMod.default) ? swaggerAutogenMod.default : swaggerAutogenMod;

const doc = {
  info: {
    title: 'PetJoyful API',
    description: 'Documentação automática da API PetJoyful',
  },
  host: 'localhost:5000',
  schemes: ['http'],
  securityDefinitions: {
    ApiKeyAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'x-api-key',
      description: 'Chave de autenticação da API',
    },
    BearerAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization',
      description: 'Token JWT no formato Bearer',
    },
  },
};

const outputFile = './swagger-output.json';
// Ajuste: apontar para o entrypoint do app no projeto
const endpointsFiles = ['./backend/src/app.js']; // ponto inicial para ler suas rotas

try {
  await swaggerAutogen(outputFile, endpointsFiles, doc);
  console.log('✅ swagger-output.json gerado em', outputFile);
} catch (err) {
  console.error('Erro ao gerar swagger-output.json:', err);
}
