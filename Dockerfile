FROM node:18

WORKDIR /app

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./
RUN npm install

# Copia todo o restante do projeto
COPY . .

# Expõe porta
EXPOSE 5000

# Comando para iniciar
CMD ["node", "server.js"]
