import swaggerAutogen from 'swagger-autogen';
import {readFile, writeFile} from 'node:fs/promises';

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'Pet Joyful API',
    version: '1.4.17',
    description:
      'Documentação completa da API Pet Joyful — gerenciamento de usuários, autenticação, mensagens, denúncias e chat com IA (Gemini).',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Servidor de desenvolvimento',
    },
    {
      url: 'https://pet-joyful-backend.onrender.com',
      description: 'Servidor de produção',
    },
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT no formato **Bearer {token}**',
      },
      AdminKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'x-admin-key',
        description:
          'Chave de admin para operações privilegiadas (use o valor de ADMIN_KEY do .env)',
      },
    },
    schemas: {
      User: {
        type: 'object',
        required: ['nome', 'email', 'senha'],
        properties: {
          nome: {type: 'string', example: 'João Silva'},
          email: {type: 'string', example: 'joao@email.com'},
          senha: {type: 'string', example: '123456'},
          tipo: {type: 'string', example: 'adotante'},
        },
      },
      Login: {
        type: 'object',
        required: ['email', 'senha'],
        properties: {
          email: {type: 'string', example: 'joao@email.com'},
          senha: {type: 'string', example: '123456'},
        },
      },
      Message: {
        type: 'object',
        required: ['mensagem'],
        properties: {
          mensagem: {type: 'string', example: 'Gostei do post!'},
          postId: {type: 'string', example: '65b8d7b2b9e'},
        },
      },
      Report: {
        type: 'object',
        required: ['descricao'],
        properties: {
          descricao: {type: 'string', example: 'Conteúdo ofensivo detectado'},
          alvoId: {type: 'string', example: '123abc456'},
          alvoTipo: {type: 'string', example: 'post'},
        },
      },
      ChatRequest: {
        type: 'object',
        required: ['message'],
        properties: {
          message: {
            type: 'string',
            example: 'Quais são os cuidados básicos para um cachorro?',
          },
        },
      },
      ChatResponse: {
        type: 'object',
        properties: {
          success: {type: 'boolean', example: true},
          response: {
            type: 'string',
            example:
              'Os cuidados básicos incluem alimentação adequada, exercícios...',
          },
        },
      },
    },
  },
  security: [{BearerAuth: []}],
  tags: [
    {name: 'Auth', description: 'Autenticação e gerenciamento de sessão'},
    {name: 'MFA', description: 'Autenticação em duas etapas por TOTP'},
    {name: 'Users', description: 'Operações relacionadas a usuários'},
    {name: 'Messages', description: 'Mensagens e comentários em postagens'},
    {name: 'Reports', description: 'Denúncias e moderação de conteúdo'},
    {name: 'Chat', description: 'Chat com IA (Gemini) para dúvidas sobre pets'},
  ],
};

const outputFile = './backend/src/config/swagger-output.json';

// Incluir app.ts como entrada principal garante que os prefixos /api e /api/chat sejam detectados
const endpointsFiles = [
  './backend/src/app.ts',
  './backend/src/routes/index.ts',
  './backend/src/routes/userRoutes.ts',
  './backend/src/routes/messagesRoutes.ts',
  './backend/src/routes/authRoutes.ts',
  './backend/src/routes/chatRoutes.ts',
];

await swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);

const generated = JSON.parse(await readFile(outputFile, 'utf8'));
generated.paths = Object.fromEntries(
  Object.entries(generated.paths).filter(([route]) => route === '/' || route.startsWith('/api/')),
);
const exportRoute = generated.paths['/api/users/{id}/data-export']?.get;
const deleteRoute = generated.paths['/api/users/{id}']?.delete;
const sessionRoute = generated.paths['/api/auth/session']?.get;
if (sessionRoute) {
  sessionRoute.tags = ['Auth'];
  sessionRoute.summary = 'Validar JWT de acesso e revogação da sessão';
  sessionRoute.security = [{BearerAuth: []}];
  sessionRoute.responses = {'200': {description: 'Sessão ativa'},
    '401': {description: 'Sessão inválida ou revogada'}};
}
if (exportRoute) {
  exportRoute.summary = 'Baixar JSON dos dados da própria conta';
  exportRoute.security = [{BearerAuth: []}];
  exportRoute.responses['200'] = {
    description: 'Arquivo JSON com conta, comentários, denúncias e posts vinculados',
    content: {'application/json': {schema: {type: 'object'}}},
  };
}
if (deleteRoute) {
  deleteRoute.summary = 'Excluir a própria conta e tratar os dados vinculados';
  deleteRoute.security = [{BearerAuth: []}];
}
const mfaOperations: Array<[string, string, string, object | null]> = [
  ['/api/auth/mfa', 'get', 'Consultar estado do MFA', null],
  ['/api/auth/mfa/setup', 'post', 'Iniciar configuração TOTP', {password: 'string'}],
  ['/api/auth/mfa/setup', 'delete', 'Cancelar configuração pendente', null],
  ['/api/auth/mfa/confirm', 'post', 'Confirmar TOTP e ativar MFA', {code: 'string'}],
  ['/api/auth/mfa/verify', 'post', 'Concluir desafio de login', {challengeToken: 'string', code: 'string', recoveryCode: 'string'}],
  ['/api/auth/mfa/recovery-codes', 'post', 'Renovar códigos de recuperação', {password: 'string', code: 'string', recoveryCode: 'string'}],
  ['/api/auth/mfa/disable', 'post', 'Desativar MFA', {password: 'string', code: 'string', recoveryCode: 'string'}],
];
for (const [route, method, summary, fields] of mfaOperations) {
  const operation = generated.paths[route]?.[method];
  if (!operation) continue;
  operation.tags = ['MFA'];
  operation.summary = summary;
  operation.security = route.endsWith('/verify') ? [] : [{BearerAuth: []}];
  if (fields) {
    operation.requestBody = {required: true, content: {'application/json': {schema: {
      type: 'object', properties: Object.fromEntries(Object.keys(fields).map(key =>
        [key, {type: 'string'}])),
    }}}};
  }
  operation.responses = {'200': {description: 'Operação concluída'},
    '400': {description: 'Dados inválidos'}, '401': {description: 'Não autorizado'},
    '429': {description: 'Tentativas excedidas'}};
}
await writeFile(outputFile, `${JSON.stringify(generated, null, 2)}\n`);
