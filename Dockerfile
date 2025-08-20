# Usa a imagem oficial do Node.js
FROM node:20-alpine

# Cria o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Exponha a porta padrão do Next.js
EXPOSE 3000

# Comando para iniciar o app
CMD ["npm", "run", "dev"]
