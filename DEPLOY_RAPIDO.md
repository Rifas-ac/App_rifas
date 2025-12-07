# 🚀 DEPLOY NA VERCEL - GUIA RÁPIDO

## ⚠️ O QUE ESTÁ ACONTECENDO

O build está falhando porque **SQLite não funciona na Vercel**.
A Vercel precisa de **PostgreSQL**.

## ✅ SOLUÇÃO EM 3 PASSOS

### 1. Criar Banco PostgreSQL na Vercel

1. Acesse seu projeto na Vercel
2. Vá em **Storage** (menu lateral)
3. Clique em **Create Database**
4. Escolha **Postgres**
5. Clique em **Continue** > **Create**

✅ A Vercel cria automaticamente a variável `DATABASE_URL`!

### 2. Fazer commit com o schema de produção

```bash
# Copie o schema de produção sobre o principal
cp prisma/schema.production.prisma prisma/schema.prisma

# Faça commit
git add prisma/schema.prisma
git commit -m "chore: Usa PostgreSQL para produção"
git push origin main
```

### 3. Aguardar o deploy

A Vercel vai detectar o push e fazer o deploy automaticamente!

## 📋 CHECKLIST DE VARIÁVEIS DE AMBIENTE

Vá em **Settings > Environment Variables** e confirme que tem:

- ✅ `DATABASE_URL` (criado automaticamente pelo Vercel Postgres)
- ✅ `MERCADOPAGO_ACCESS_TOKEN` (use credenciais de PRODUÇÃO!)
- ✅ `MERCADOPAGO_PUBLIC_KEY`
- ✅ `ADMIN_USERNAME`
- ✅ `ADMIN_PASSWORD`
- ✅ `NEXT_PUBLIC_SITE_URL` (ex: https://seu-app.vercel.app)
- ⚠️  `RESEND_API_KEY` (opcional, para enviar emails)

## 🔄 MANTER SQLite NO LOCAL

Para continuar usando SQLite localmente:

1. **NÃO** faça o push do schema alterado
2. **OU** mantenha dois arquivos:
   - `schema.prisma` (SQLite para local)
   - `schema.production.prisma` (PostgreSQL para Vercel)

3. Antes de fazer deploy, rode:
```bash
npm run build:production
```

## 🐛 SE CONTINUAR COM ERRO

Me envie print da mensagem de erro completa da Vercel!
