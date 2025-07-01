# === ESTÁGIO 1: Base e Dependências ===
# Usamos uma imagem Node.js mais específica para garantir consistência
FROM node:18-alpine AS base

# Definimos o diretório de trabalho dentro do container
WORKDIR /app

# Copiamos os arquivos de gerenciamento de pacotes
COPY package.json package-lock.json* ./

# ---

# === ESTÁGIO 2: Instalação de Dependências de Produção ===
FROM base AS deps
# Instala SOMENTE as dependências de produção
RUN npm install --production

# ---

# === ESTÁGIO 3: Build da Aplicação ===
FROM base AS builder
# Instala TODAS as dependências (incluindo as de desenvolvimento, como o prisma)
RUN npm install
# Copia o schema do Prisma para gerar o client
COPY prisma ./prisma/
# Gera o Prisma Client, essencial para a aplicação funcionar
RUN npx prisma generate
# Copia o resto do código da aplicação
COPY . .
# Roda o build do Next.js
RUN npm run build

# ---

# === ESTÁGIO 4: Imagem Final de Produção ===
FROM base AS runner
WORKDIR /app

# Define o ambiente como produção, o que desabilita features de dev do Next.js
ENV NODE_ENV=production

# Em "ESTÁGIO 4: Imagem Final de Produção"
COPY --from=builder /app/node_modules ./node_modules
# Copia a pasta .next com a aplicação buildada do estágio 'builder'
COPY --from=builder /app/.next ./.next
# Copia a pasta 'public'
COPY --from=builder /app/public ./public
# Copia o Prisma Client gerado do estágio 'builder'
COPY --from=builder /app/prisma ./prisma
# Copia o 'package.json' para poder rodar o 'npm start'
COPY package.json .

# Expõe a porta que o Next.js usa por padrão
EXPOSE 3000

# O comando para iniciar a aplicação
# `npm start` é o script padrão do Next.js para produção
CMD ["npm", "start"]