import swaggerAutogen from 'swagger-autogen';

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
        required: ['email', 'mensagem'],
        properties: {
          nome: {type: 'string', example: 'Maria'},
          email: {type: 'string', example: 'maria@email.com'},
          mensagem: {type: 'string', example: 'Gostei do post!'},
          postId: {type: 'string', example: '65b8d7b2b9e'},
        },
      },
      Report: {
        type: 'object',
        required: ['email', 'descricao'],
        properties: {
          nome: {type: 'string', example: 'Carlos'},
          email: {type: 'string', example: 'carlos@email.com'},
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

void swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);