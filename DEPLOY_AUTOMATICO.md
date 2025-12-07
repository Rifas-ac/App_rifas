# 🚀 DEPLOY VERCEL - SOLUÇÃO AUTOMÁTICA

## ✅ O QUE EU FIZ

Criei um script que **detecta automaticamente** se está rodando:
- 💻 **Local** → Usa SQLite
- 🚀 **Vercel** → Usa PostgreSQL

Agora o build funciona em ambos os ambientes!

## 📋 PRÓXIMOS PASSOS

### 1️⃣ Criar Banco PostgreSQL na Vercel

1. Acesse: https://vercel.com/seu-projeto
2. Vá em **Storage** (menu lateral)
3. Clique em **Create Database**
4. Escolha **Postgres**
5. Clique em **Continue** > **Create**

✅ A Vercel criará automaticamente a variável `DATABASE_URL`!

### 2️⃣ Configurar Outras Variáveis de Ambiente

Vá em **Settings > Environment Variables** e adicione:

```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token-de-producao
MERCADOPAGO_PUBLIC_KEY=APP_USR-sua-chave-publica
ADMIN_USERNAME=seu-email@gmail.com
ADMIN_PASSWORD=sua-senha-segura
NEXT_PUBLIC_SITE_URL=https://seu-app.vercel.app
RESEND_API_KEY=re_sua_chave_resend
```

⚠️ **IMPORTANTE:** Use credenciais de **PRODUÇÃO** do Mercado Pago, não TEST!

### 3️⃣ Fazer Deploy

```bash
git add .
git commit -m "feat: Adiciona suporte automático PostgreSQL/SQLite"
git push origin main
```

A Vercel fará o deploy automaticamente! 🎉

## 🔍 COMO FUNCIONA

O script `scripts/setup-db.js`:
- Detecta se `process.env.VERCEL === '1'` (ambiente Vercel)
- Se for Vercel: substitui `provider = "sqlite"` por `provider = "postgresql"`
- Se for local: mantém SQLite

Você não precisa fazer nada manual! 🚀

## 🐛 SE DER ERRO

1. **Erro: Can't reach database server**
   - ✅ Verifique se criou o Postgres na Vercel
   - ✅ Confirme que a variável `DATABASE_URL` existe

2. **Erro: Environment variable not found**
   - ✅ Configure todas as variáveis no painel da Vercel
   - ✅ Faça um novo deploy após adicionar

3. **Outro erro?**
   - 📩 Me envie o log completo da Vercel (incluindo a parte do erro)

## ✨ BENEFÍCIOS

- ✅ SQLite no desenvolvimento (mais rápido)
- ✅ PostgreSQL na produção (Vercel exige)
- ✅ Sem necessidade de alterar código manualmente
- ✅ Um único schema.prisma para tudo
