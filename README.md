# 🐾 Pet Joyful - Backend API

API RESTful completa para a plataforma Pet Joyful, desenvolvida com Node.js, Express e MongoDB. Sistema de gerenciamento de usuários, autenticação JWT e mensagens com arquitetura escalável.

---

## 👥 Equipe de Desenvolvimento

- **João Vitor dos Santos de Jesus** - joao.jesus18@fatec.sp.gov.br
- **Mateus Fernandes Alves** - mateus.alves10@fatec.sp.gov.br
- **Elton da Costa** - elton.costa@fatec.sp.gov.br

---

## 📋 Sobre o Projeto

O **Pet Joyful** é uma plataforma que conecta tutores de pets, ONGs e veterinários através de uma API RESTful moderna e escalável. O sistema oferece autenticação segura, gerenciamento completo de usuários e sistema de mensagens/denúncias.

## 🔗 Repositórios do Projeto

**Backend:** https://github.com/JaoVitorz/Pet-Joyful-Backend (Este repositório)

**Frontend:** https://pet-joyful-projeto-integrador-next-nu.vercel.app/Home



### 🎯 Funcionalidades Principais

- ✅ **Autenticação JWT e Admin-Key** - Sistema seguro de login e registro
- ✅ **CRUD Completo** - Gerenciamento de usuários, mensagens e denúncias
- ✅ **Múltiplos Perfis** - Adotantes, ONGs e Veterinários
- ✅ **Sistema de Mensagens** - Comentários em posts
- ✅ **Sistema de Denúncias** - Moderação de conteúdo
- ✅ **Documentação Swagger** - API totalmente documentada
- ✅ **Deploy em Nuvem** - Hospedado no Render

---

## 📊 Requisitos do Sistema

### Requisitos Funcionais

| Nº    | Nome                         | Descrição                                                                 |
|-------|------------------------------|---------------------------------------------------------------------------|
| RF01  | Login                        | Fazer login na rede social                                                |
| RF02  | Email de confirmação         | Enviar email de confirmação para validar conta do usuário                 |
| RF03  | Adicionar/Remover Amigos     | Adicionar amigos na rede social ou remover                                |
| RF04  | Preferências de usuário      | Alteração das preferências do usuário                                     |
| RF05  | Bloquear usuários            | Bloquear usuários que descumprirem as políticas do site                   |
| RF06  | Sistema de Doações           | Permitir que usuários façam e recebam doações pela plataforma             |
| RF07  | Filtros de Busca             | Barra de pesquisa com filtros para doadores, pets para adoção e ONGs      |
| RF08  | Notificações                 | Enviar notificações para usuários sobre interações relevantes             |
| RF09  | Perfil de Pet                | Criar perfis para pets com nome, raça, idade e fotos                      |
| RF10  | Feedback e Avaliações        | Permitir avaliações sobre doações para promover confiança                 |
| RF11  | Criar Álbum (Agrupamento)    | Criar agrupamento de fotos para exibição                                  |
| RF12  | Gerenciar Postagem           | Permitir incluir, alterar e excluir postagens feitas pelos usuários       |
| RF13  | Comentar                     | Realizar comentários em conteúdos e postagens                             |
| RF14  | Chat (Comentar)              | Interação entre usuários via texto                                        |
| RF15  | Adicionar/Remover Fotos      | Adicionar ou remover fotos no conteúdo principal da página                |
| RF16  | Editar Perfil                | Configurar perfil pessoal para editar informações e dados                 |
| RF17  | Adicionar e criar Post       | Adicionar e criar postagens no conteúdo principal e no perfil pessoal     |

---
### Requisitos Não Funcionais

| Nº     | Nome                          | Descrição                                                                 |
|--------|-------------------------------|---------------------------------------------------------------------------|
| RNF01  | Tempo de resposta             | O tempo de resposta deve ser menor que 2 segundos                         |
| RNF02  | Compatibilidade com Navegadores| Deve ser compatível com Firefox, Chrome, Safari e outros navegadores      |
| RNF03  | Criptografia dos dados        | Dados do usuário devem ser criptografados ao serem armazenados            |
| RNF04  | Escalabilidade                | O sistema deve ser escalável para suportar grande número de usuários      |
| RNF05  | Disponibilidade               | Alta disponibilidade (99,9%) para evitar quedas do sistema                |
| RNF06  | Acessibilidade                | Conformidade com WCAG 2.1 para garantir acessibilidade                    |
| RNF07  | Responsividade                | Ajustar-se a diferentes tamanhos de tela (computador, tablet, smartphone) |
| RNF08  | Backup de Dados               | Implementar política de backup regular dos dados do usuário               |
| RNF09  | Monitoramento e Logs          | Implementar mecanismo de monitoramento e geração de logs                  |
| RNF10  | Segurança de Autenticação     | Suportar autenticação via OAuth 2.0 ou métodos seguros (ex.: redes sociais)|
| RNF11  | Tolerância a Falhas           | Garantir operação contínua mesmo em caso de falhas parciais              |
| RNF12  | Tempo de Recuperação          | Em caso de falha, recuperação deve ser inferior a 5 minutos               |
| RNF13  | Consumo de Recursos           | Aplicação otimizada para minimizar consumo de CPU, memória e banda        |
| RNF14  | Conformidade com LGPD         | Estar em conformidade com a LGPD e regulamentos similares                 |
| RNF15  | Gerenciamento de Sessões      | Sessões devem ter timeouts automáticos e serem gerenciadas com segurança  |
| RNF16  | Verificação de duas etapas    | Implementar autenticação em duas etapas para segurança do usuário         |


## 🎭 Casos de Uso

### Diagrama de Casos de Uso

<img width="882" height="379" alt="image" src="https://github.com/user-attachments/assets/9b6d4f32-5714-40b7-b422-ac5c4528b5a8" />

---

## 🧩 Caso de Uso: Cadastrar

**Atores:** Usuário  
**Resumo:** O usuário realiza o cadastro no sistema, fornecendo as informações necessárias para criar uma conta.  
**Pré-condição:** O usuário deve fornecer dados válidos para o cadastro.  
**Pós-condição:** O usuário está registrado no sistema e pode realizar login.  

**Fluxo Principal:**  
1. Usuário insere dados do cadastro.  
2. Sistema valida as informações.  
3. Sistema confirma o cadastro e cria a conta no sistema.  

**Restrições/Validações:**  
- O email deve ser único e válido.

---

## 🧩 Caso de Uso: Logoff

**Atores:** Usuário  
**Resumo:** O usuário encerra sua sessão no sistema, garantindo que suas credenciais não fiquem ativas.  
**Pré-condição:** O usuário deve estar autenticado.  
**Pós-condição:** O usuário é desconectado e precisará realizar login novamente.  

**Fluxo Principal:**  
1. Usuário seleciona opção de logoff.  
2. Sistema exibe confirmação de saída.  
3. Usuário confirma logoff.  
4. Sistema encerra sessão e redireciona para tela de login.  

**Restrições/Validações:**  
- O usuário deve estar logado.  
- Após o logoff, as credenciais são removidas da sessão.

---

## 🧩 Caso de Uso: Fazer Login

**Atores:** Usuário  
**Resumo:** O usuário insere suas credenciais para acessar o sistema.  
**Pré-condição:** O usuário deve possuir cadastro válido.  
**Pós-condição:** O usuário estará autenticado no sistema.  

**Fluxo Principal:**  
1. Inserir email e senha.  
2. Sistema valida credenciais.  
3. Sistema concede acesso ao sistema.  

**Restrições/Validações:**  
- Email e senha devem ser válidos.

---

## 🧩 Caso de Uso: Redefinir Senha

**Atores:** Usuário  
**Resumo:** O usuário solicita redefinição de senha e recebe link ou código para alteração.  
**Pré-condição:** O usuário deve ter email cadastrado.  
**Pós-condição:** A senha é alterada com sucesso.  

**Fluxo Principal:**  
1. Usuário solicita redefinição e insere email válido.  
2. Sistema envia link/código de verificação.  
3. Usuário insere nova senha.  
4. Sistema atualiza senha.  

**Restrições/Validações:**  
- Senha deve atender aos critérios de segurança.

---

## 🧩 Caso de Uso: Visualizar Post

**Atores:** Usuário  
**Resumo:** O usuário visualiza um post e pode interagir com ele.  
**Pré-condição:** O post deve estar disponível.  
**Pós-condição:** O usuário vê o conteúdo do post.  

**Fluxo Principal:**  
1. Usuário acessa o feed.  
2. Sistema exibe posts em ordem decrescente.

---

## 🧩 Caso de Uso: Criar Post

**Atores:** Usuário  
**Resumo:** O usuário cria um post com informações sobre adoção ou doação.  
**Pré-condição:** O usuário deve estar logado.  
**Pós-condição:** O post é publicado.  

**Fluxo Principal:**  
1. Inserir informações do post.  
2. Sistema valida informações.  
3. Confirmar criação.  
4. Sistema publica o post.  

**Restrições/Validações:**  
- Conteúdo deve seguir as diretrizes do sistema.

---

## 🧩 Caso de Uso: Comentar

**Atores:** Usuário  
**Resumo:** O usuário comenta em um post.  
**Pré-condição:** O post deve permitir comentários.  
**Pós-condição:** O comentário é adicionado.  

**Fluxo Principal:**  
1. Selecionar post.  
2. Exibir post.  
3. Inserir comentário.  
4. Sistema publica comentário.  

**Restrições/Validações:**  
- O usuário deve estar autenticado.

---

## 🧩 Caso de Uso: Gerenciar Post

**Atores:** Usuário  
**Resumo:** O usuário pode incluir, alterar ou excluir postagens criadas.  
**Pré-condição:** O post deve existir e o usuário deve ter permissão.  
**Pós-condição:** O post é atualizado ou removido.  

**Fluxo Principal:**  
1. Selecionar post.  
2. Escolher ação (editar ou excluir).  
3. Sistema processa ação.  
4. Sistema salva alterações ou remove post.  

**Restrições/Validações:**  
- Apenas criador ou administrador pode gerenciar o post.

---

## 🧩 Caso de Uso: Bloquear Usuários

**Atores:** Administrador  
**Resumo:** O administrador bloqueia usuários que violem as regras.  
**Pré-condição:** Usuário infrator deve existir no sistema.  
**Pós-condição:** Usuário bloqueado perde acesso.  

**Fluxo Principal:**  
1. Administrador acessa painel.  
2. Seleciona usuário.  
3. Sistema verifica permissões.  
4. Confirmar bloqueio.  
5. Sistema atualiza status e notifica o usuário.  

**Restrições/Validações:**  
- Somente administradores podem executar esta ação.

---

## 🧩 Caso de Uso: Denunciar Post

**Atores:** Usuário  
**Resumo:** O usuário denuncia um post que viola as regras da plataforma.  
**Pré-condição:** O post deve estar visível e ativo.  
**Pós-condição:** Denúncia registrada para análise.  

**Fluxo Principal:**  
1. Selecionar post.  
2. Escolher "Denunciar".  
3. Preencher motivo.  
4. Sistema registra e notifica administradores.  

**Restrições/Validações:**  
- Usuário deve estar autenticado.  
- Motivo da denúncia deve ser válido.

---

## 🧩 Caso de Uso: Validar CRMV

**Atores:** Veterinário, Sistema  
**Resumo:** O sistema valida o CRMV informado pelo veterinário durante o cadastro.  
**Pré-condição:** O veterinário deve fornecer CRMV válido.  
**Pós-condição:** Acesso liberado somente se CRMV for validado.  

**Fluxo Principal:**  
1. Inserir número do CRMV.  
2. Sistema valida via API.  
3. Sistema retorna confirmação.  

**Restrições/Validações:**  
- CRMV deve ser consultado em base oficial.  

---

## 🧩 Caso de Uso: Validar CNPJ

**Atores:** Representante da ONG, Sistema  
**Resumo:** O sistema valida o CNPJ da ONG no momento do cadastro.  
**Pré-condição:** ONG deve fornecer CNPJ válido.  
**Pós-condição:** Cadastro liberado após validação.  

**Fluxo Principal:**  
1. Inserir número do CNPJ.  
2. Sistema consulta base oficial.  
3. Exibir resultado.  
4. Continuar cadastro ou exibir erro.  

**Restrições/Validações:**  
- CNPJ deve estar ativo e válido na Receita Federal.
- 
---

## 🧩 Caso de Uso: Curtir Post

**Atores:** Usuário, Sistema  
**Resumo:** O usuário curte um post, registrando interesse no conteúdo.  
**Pré-condição:** Usuário deve estar logado e o post visível.  
**Pós-condição:** O número de curtidas é atualizado.  

**Fluxo Principal:**  
1. Visualizar post.  
2. Clicar em "Curtir".  
3. Sistema registra curtida e atualiza contador.  

**Fluxo Alternativo (Descurtir):**  
1. Clicar novamente em "Curtir".  
2. Sistema remove curtida e atualiza contador.  

**Restrições/Validações:**  
- Um usuário só pode curtir uma vez.  
- Sistema impede curtidas de usuários não logados.


---

## 🛠️ Stack Tecnológica

### Backend
- **Node.js 18+** com Express 5
- **MongoDB Atlas** (Mongoose 8)
- **JWT** para autenticação
- **Bcryptjs** para criptografia

### DevOps & Tools
- **Docker** e Docker Compose
- **Vercel** para deploy
- **Swagger UI** para documentação
- **Nodemon** para desenvolvimento

---

## 🚀 Instalação

```bash
# Clone o repositório
git clone https://github.com/JaoVitorz/Pet-Joyful-Backend.git
cd Pet-Joyful-Backend
```

### 📚 Acesse a Documentação

- **Swagger Docs**: https://petjoyful-backend.vercel.app/api-docs

> **Nota**: A documentação Swagger é gerada automaticamente a partir do código usando `swagger-autogen`

---

## 📡 Endpoints da API

### 🔐 Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/register` | Cadastrar novo usuário | Não |
| POST | `/api/auth/login` | Login (retorna JWT) | Não |
| GET | `/api/auth/me` | Perfil do usuário autenticado | Bearer Token |
| PUT | `/api/auth/me` | Atualizar perfil | Bearer Token |
| DELETE | `/api/auth/me` | Deletar conta | Bearer Token |

### 👤 Usuários

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/users` | Listar todos os usuários | Admin Key |
| GET | `/api/users/:id` | Buscar usuário por ID | Admin Key |
| POST | `/api/users` | Criar usuário | Admin Key |
| PUT | `/api/users/:id` | Atualizar usuário | Admin Key |
| DELETE | `/api/users/:id` | Deletar usuário | Admin Key |

### 💬 Mensagens

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/messages/post` | Criar mensagem | Não |
| GET | `/api/messages/post` | Listar mensagens | Não |
| PUT | `/api/messages/post/:id` | Atualizar mensagem | Admin Key |
| DELETE | `/api/messages/post/:id` | Deletar mensagem | Admin Key |

### 🚨 Denúncias

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/messages/denuncia` | Criar denúncia | Não |
| GET | `/api/messages/denuncia` | Listar denúncias | Admin Key |
| PUT | `/api/messages/denuncia/:id` | Atualizar denúncia | Admin Key |
| DELETE | `/api/messages/denuncia/:id` | Deletar denúncia | Admin Key |

---

## 🔑 Autenticação

### Bearer Token (JWT)
```http
Authorization: Bearer {token}
```

### Admin Key (Operações Administrativas)
```http
x-admin-key: {admin_key_from_env}
```

**Nota:** A Admin Key permite acesso total às operações protegidas. No código, o middleware `ensureAuth` aceita **tanto Bearer Token quanto Admin Key**.

---

### 🔐 Sistema de Autenticação

O projeto utiliza **dois mecanismos de autenticação**:

#### Bearer Token (JWT)
- Gerado no registro e login
- Validade de 7 dias
- Usado em rotas de perfil (`/api/auth/me`)

#### Admin Key
- Header: `x-admin-key`
- Requerida para operações administrativas:
  - Gerenciamento de usuários
  - Atualização/exclusão de mensagens
  - Gerenciamento de denúncias
- Definida na variável de ambiente `ADMIN_KEY`

**Importante:** O middleware `ensureAuth` aceita ambos os métodos.

---

## 💡 Exemplos de Uso

### Registrar Usuário
```bash
curl -X POST https://petjoyful-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "senha123",
    "tipo": "adotante"
  }'
```

### Login
```bash
curl -X POST https://petjoyful-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "senha123"
  }'
```

### Criar Mensagem
```bash
curl -X POST https://petjoyful-backend.vercel.app/api/messages/post \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria",
    "email": "maria@email.com",
    "mensagem": "Gostei muito do post!",
    "postId": "123abc"
  }'
```

---

## 📁 Estrutura do Projeto

```
Pet-Joyful-Backend/
├── backend/
│   └── src/
│       ├── controllers/       # Lógica de negócio
│       ├── models/            # Schemas MongoDB
│       ├── routes/            # Definição de rotas
│       ├── middlewares/       # Auth, validações
│       ├── database/          # Conexão DB
│       ├── app.js             # Express App
│       └── swagger-output.json
├── api/
│   └── index.js               # Vercel Serverless
├── docker-compose.yml
├── Dockerfile
├── server.js                  # Entry point
└── package.json
```

---

## Sprint Banco de Dados

| Atividade                                         | Início              | Término             |
|:--------------------------------------------------|:--------------------|:--------------------|
| Integração de Dados Com Telas de Cadastro e Login | 2025-09-10 00:00:00 | 2025-10-28 00:00:00 |
| Criação de Banco de Dados do Site                 | 2025-09-10 00:00:00 | 2025-10-02 00:00:00 |
| Configuração do Banco no Projeto                  | 2025-09-25 00:00:00 | 2025-10-28 00:00:00 |
| Configurar Conexão do Mongo no Back-End           | 2025-09-25 00:00:00 | 2025-10-21 00:00:00 |
| Implementar CRUD de Usuários, Veterinários e ONGS | 2025-09-25 00:00:00 | 2025-10-28 00:00:00 |
| Endpoint de Registro                              | 2025-09-25 00:00:00 | 2025-10-28 00:00:00 |
| Endpoint de Login                                 | 2025-09-25 00:00:00 | 2025-10-28 00:00:00 |
| Fazer Testes no Postman                           | 2025-10-13 00:00:00 | 2025-10-21 00:00:00 |
| Microserviços                                     | 2025-10-28 00:00:00 | 2025-10-28 00:00:00 |

## Sprint do Backend

 | Atividade                                          | Início              | Término                 |
| :------------------------------------------------- | :------------------ | :---------------------- |
| Criação da Estrutura de Pastas do Back-End         | 2025-10-02 00:00:00 | 2025-10-05 00:00:00     |
| Configurar Docker e Containers                     | 2025-10-06 00:00:00 | 2025-10-08 00:00:00     |
| Implementar Conexão com Banco de Dados             | 2025-10-09 00:00:00 | 2025-10-10 00:00:00     |
| Criar um Microserviço (ex: Usuários /)        | 2025-10-10 00:00:00 | 2025-10-12 00:00:00     |
| Implementar Middleware de Autenticação JWT         | 2025-10-12 00:00:00 | 2025-10-13 00:00:00     |
| Implementar Middleware de Autorização (checkAdmin) | 2025-10-13 00:00:00 | 2025-10-14 00:00:00     |
| Criar Documentação da API com Swagger              | 2025-10-14 00:00:00 | 2025-10-15 00:00:00     |
| Testar Endpoints com Insomnia / Postman            | 2025-10-15 00:00:00 | 2025-10-17 00:00:00     |
| Deploy do Backend na Vercel                        | 2025-10-17 00:00:00 | 2025-10-19 00:00:00     |
| Ajustar CORS e Variáveis de Ambiente               | 2025-10-19 00:00:00 | 2025-10-20 00:00:00     |
| Revisão Final e Apresentação do Swagger UI         | 2025-10-20 00:00:00 | **2025-10-22 00:00:00** |

## Sprint do Backlog

| Atividade                                             | Início | Término |
| :---------------------------------------------------- | :----- | :------ |
| Integração com Front-End                              |        |         |
| Upload de Imagens de Pets                             |        |         |
| Sistema de Notificações (E-mail ou Push)              |        |         |
| Recuperação de Senha (Esqueci minha senha)            |        |         |
| Filtros e Paginação de Pets                           |        |         |
| Dashboard Administrativo                              |        |         |
| Logs de Adoção                                        |        |         |
| Testes Automatizados (Jest / Supertest)               |        |         |
| Cache de Requisições (Redis)                          |        |         |
| Monitoramento e Health Check                          |        |         |
| Integração com Serviços Externos (ex: Geolocalização) |        |         |
| Sistema de Favoritos (Pets Favoritados por Usuário)   |        |         |
| API de Feedback / Avaliação de Adoções                |        |         |
| Melhorias de Segurança e Rate Limiting                |        |         |
| Criação de Microserviço de Relatórios                 |        |         |



## 🌐 Deploy

### URL de Produção
- **API:** https://pet-joyful-backend-1.onrender.com
- **Swagger Docs:** https://pet-joyful-backend-1.onrender.com/api-docs

---

## 🧪 Testes

Utilize o Postman ou Insomnia importando a documentação Swagger:
- Collection disponível em `/api-docs`
- Exemplos de requisições incluídos

---

## 📝 Licença

Este projeto está sob a licença **ISC**.

---

## 📞 Contato & Suporte

- **Documentação**: [Swagger Docs](https://pet-joyful-backend-1.onrender.com/api-docs/#/Auth/post_api_auth_login)
- **Repositório**: [GitHub](https://github.com/JaoVitorz/Pet-Joyful-Backend)
- **Issues**: [GitHub Issues](https://github.com/JaoVitorz/Pet-Joyful-Backend/issues)

---

<div align="center">

**Desenvolvido com ❤️ pela Equipe Pet Joyful**

⭐ Se este projeto foi útil, considere dar uma estrela!

</div>
