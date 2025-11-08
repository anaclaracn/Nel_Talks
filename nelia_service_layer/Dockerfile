# Usa uma imagem base oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos package.json e package-lock.json (ou yarn.lock)
# Estes são copiados separadamente para aproveitar o cache do Docker
# Se as dependências não mudarem, as camadas anteriores não serão reconstruídas
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install --production

# Copia o restante do código da sua aplicação para o diretório de trabalho
COPY . .

# Expõe a porta em que a aplicação Node.js estará ouvindo
# Isso é apenas para documentação, não publica a porta automaticamente
EXPOSE 8001

# Define o comando para iniciar a aplicação quando o container for iniciado
# O "npm start" deve estar configurado no seu package.json para "node src/main.js"
CMD [ "npm", "start" ]