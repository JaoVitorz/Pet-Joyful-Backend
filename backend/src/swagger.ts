import swaggerAutogen from 'swagger-autogen';

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'Pet Joyful API',
    version: '1.0.0',
    description:
      'Documentação completa da API Pet Joyful — gerenciamento de usuários, autenticação, mensagens e denúncias.',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Servidor de teste',
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
    },
  },
  security: [{BearerAuth: []}],
  tags: [
    {name: 'Auth', description: 'Autenticação e gerenciamento de sessão'},
    {name: 'Users', description: 'Operações relacionadas a usuários'},
    {name: 'Messages', description: 'Mensagens e comentários em postagens'},
    {name: 'Reports', description: 'Denúncias e moderação de conteúdo'},
  ],
};

const outputFile = './src/config/swagger-output.json';

const endpointsFiles = [
  './src/routes/index.ts',
  './src/routes/userRoutes.ts',
  './src/routes/messagesRoutes.ts',
  './src/routes/authRoutes.ts',
];

void swaggerAutogen({openapi: '3.0.0'})(outputFile, endpointsFiles, doc);
