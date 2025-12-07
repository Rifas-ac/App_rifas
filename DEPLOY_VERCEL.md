# 🚀 GUIA DE DEPLOY NA VERCEL

## ⚠️ PROBLEMA ATUAL: SQLite não funciona na Vercel!

A Vercel não suporta SQLite porque o sistema de arquivos é read-only. Você precisa usar PostgreSQL.

## ✅ SOLUÇÃO: Usar PostgreSQL (3 opções)

### OPÇÃO 1: Vercel Postgres (Recomendado - Mais Fácil)
1. No painel da Vercel, vá em seu projeto
2. Clique em "Storage"
3. Clique em "Create Database"
4. Escolha "Postgres"
5. Siga as instruções
6. A Vercel vai criar automaticamente a variável `DATABASE_URL`

### OPÇÃO 2: Supabase (Gratuito)
1. Crie conta em https://supabase.com
2. Crie um novo projeto
3. Copie a "Connection String" (está em Settings > Database)
4. Adicione na Vercel como variável de ambiente `DATABASE_URL`

### OPÇÃO 3: Neon (Gratuito)
1. Crie conta em https://neon.tech
2. Crie um novo projeto PostgreSQL
3. Copie a connection string
4. Adicione na Vercel como variável de ambiente `DATABASE_URL`

## 📝 PASSO A PASSO COMPLETO

### 1️⃣ Atualizar o Prisma Schema

No arquivo `prisma/schema.prisma`, mude de:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

Para:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2️⃣ Configurar Variáveis de Ambiente na Vercel

Vá em: **Settings > Environment Variables** e adicione:

```env
DATABASE_URL=postgresql://user:password@host:5432/database?schema=public
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token-de-producao
MERCADOPAGO_PUBLIC_KEY=APP_USR-sua-chave-publica
ADMIN_USERNAME=seu-email@gmail.com
ADMIN_PASSWORD=sua-senha-segura
RESEND_API_KEY=re_sua_chave_resend
NEXT_PUBLIC_SITE_URL=https://seu-app.vercel.app
```

**IMPORTANTE:** Use credenciais de PRODUÇÃO do Mercado Pago, não TEST!

### 3️⃣ Criar Migration e Push

Depois de atualizar o schema:

```bash
# Local (desenvolvimento)
npx prisma migrate dev --name change_to_postgresql

# Commit das alterações
git add .
git commit -m "chore: Muda de SQLite para PostgreSQL para deploy Vercel"
git push origin main
```

### 4️⃣ Deploy na Vercel

A Vercel vai detectar o push e fazer o deploy automaticamente.

Durante o build, o Prisma vai:
1. Gerar o client
2. Aplicar as migrations no banco PostgreSQL

### 5️⃣ Popular o Banco (Seed)

Após o primeiro deploy bem-sucedido, você pode rodar o seed diretamente:

**Opção A: Via Vercel CLI**
```bash
vercel env pull .env.production
npx prisma db seed
```

**Opção B: Via API**
Crie uma rota `/api/admin/seed` e chame ela uma vez (protegida por auth).

## 🐛 ERROS COMUNS E SOLUÇÕES

### Erro: "Can't reach database server"
- ✅ Verifique se a `DATABASE_URL` está correta
- ✅ Confirme que o banco PostgreSQL está acessível pela internet
- ✅ Verifique se há restrições de IP/firewall

### Erro: "Prisma Client not found"
- ✅ Certifique-se que `npx prisma generate` está no script de build
- ✅ Seu `package.json` deve ter: `"build": "npx prisma generate && next build"`

### Erro: "Environment variable not found: DATABASE_URL"
- ✅ Configure todas as variáveis no painel da Vercel
- ✅ Faça um novo deploy após adicionar as variáveis

## 📊 VERIFICAR SE O DEPLOY ESTÁ OK

1. Acesse: `https://seu-app.vercel.app/api/dbtest`
2. Deve retornar conexão bem-sucedida

## 🔄 AMBIENTE LOCAL vs PRODUÇÃO

### Local (SQLite)
```env
DATABASE_URL="file:./dev.db"
MERCADOPAGO_ACCESS_TOKEN="TEST-..."
```

### Vercel (PostgreSQL)
```env
DATABASE_URL="postgresql://..."
MERCADOPAGO_ACCESS_TOKEN="APP_USR-..."
```

Você pode manter SQLite local e PostgreSQL na Vercel!

## 📞 PRECISA DE AJUDA?

Se continuar com erro, me envie:
1. A mensagem de erro completa da Vercel
2. Screenshot do painel de Environment Variables
3. O commit hash que está sendo deployado
