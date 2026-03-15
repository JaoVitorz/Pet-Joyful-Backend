FROM node:18

WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./
# Instala dependências primeiro (camada cacheável)
RUN npm install --production

# Copia todo o restante do projeto
COPY . .

# Gera build TypeScript para que `dist/` exista dentro da imagem
RUN npm run build

# Expõe porta
EXPOSE 5000

# Executa o build compilado
CMD ["node", "dist/server.js"]
