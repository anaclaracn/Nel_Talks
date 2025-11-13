# api_gateway/Dockerfile
FROM node:18-alpine

WORKDIR /usr/src/app

# Copia package.json e instala dependências
COPY package*.json ./
RUN npm install

# Copia o código-fonte
COPY src/ ./src/

# Define a variável de ambiente do contêiner (a porta externa é mapeada no docker-compose)
ENV PORT=8000
EXPOSE 8000

# Comando para rodar a aplicação
# CMD ["node", "src/server.js"] troquei por para padronização
CMD ["node", "index.js"] 