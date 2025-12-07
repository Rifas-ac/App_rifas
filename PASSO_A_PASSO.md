# ✅ GUIA COMPLETO - 4 PASSOS PARA TESTAR

## 🎯 OPÇÃO RÁPIDA (Recomendada!)

```powershell
# Execute apenas este comando:
.\start.ps1
```

O script vai:
1. ✅ Configurar o banco automaticamente (SQLite ou PostgreSQL)
2. ✅ Executar as migrações
3. ✅ Popular com rifas de exemplo
4. ✅ Iniciar o servidor

**Depois só falta configurar o ngrok (Passo 4 abaixo)!**

---

## 📋 OPÇÃO MANUAL (Passo a Passo)

### **1️⃣ CONFIGURAR DATABASE_URL NO .ENV**

#### **Opção A: SQLite (Mais Fácil - SEM INSTALAÇÃO)**

```powershell
# 1. Editar prisma/schema.prisma
# Mudar "postgresql" para "sqlite"

# 2. Editar .env
# Mudar DATABASE_URL para:
DATABASE_URL="file:./dev.db"
```

#### **Opção B: PostgreSQL (Se já tiver instalado)**

```powershell
# No .env, configure:
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/rifas_db"

# Exemplo:
DATABASE_URL="postgresql://postgres:admin123@localhost:5432/rifas_db"
```

---

### **2️⃣ EXECUTAR PRISMA MIGRATE**

```powershell
# Gerar Prisma Client
npx prisma generate

# Criar banco e tabelas
npx prisma migrate dev --name init

# Popular com rifas de exemplo
node prisma/seed_rifas.js
```

**Resultado esperado:**
```
✅ Rifa criada: Gol LS 1986
✅ Rifa criada: Chevette DL 92
🎉 Banco de dados populado com sucesso!
```

---

### **3️⃣ EXECUTAR NPM RUN DEV**

```powershell
npm run dev
```

**Resultado esperado:**
```
▲ Next.js 15.5.7
- Local: http://localhost:3000
- Ready in 2.3s
```

**Acesse:** http://localhost:3000

Você deve ver:
- ✅ Banner "Bem-vindo!"
- ✅ Card do Gol LS 1986 (colorido)
- ✅ Card do Chevette DL 92 (preto e branco)

---

### **4️⃣ CONFIGURAR NGROK**

#### **A. Baixar e Instalar:**

1. **Download:** https://ngrok.com/download
2. **Extrair** para: `C:\ngrok\`
3. **Criar conta:** https://dashboard.ngrok.com/signup
4. **Copiar token** da dashboard

#### **B. Autenticar:**

```powershell
cd C:\ngrok
.\ngrok.exe config add-authtoken SEU_TOKEN_AQUI
```

#### **C. Iniciar Túnel:**

**Abra um NOVO terminal** (deixe o `npm run dev` rodando no outro!)

```powershell
cd C:\ngrok
.\ngrok.exe http 3000
```

**Você verá:**
```
Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
```

**COPIE essa URL!** 👆

#### **D. Configurar no Mercado Pago:**

1. Acesse: https://www.mercadopago.com.br/developers/panel/app/589577006/webhooks
2. Clique em **"Webhooks"**
3. **URL:** Cole `https://abc123.ngrok-free.app/api/webhook/payment`
4. **Eventos:** Marque `payment` ✅
5. Clique em **Salvar**

---

## 🎯 RESUMO - VOCÊ TERÁ 2 TERMINAIS RODANDO:

```
Terminal 1 (Next.js):
> npm run dev
✓ Ready on http://localhost:3000

Terminal 2 (ngrok):
> ngrok http 3000
Forwarding: https://abc123.ngrok-free.app
```

---

## ✅ CHECKLIST FINAL

- [ ] Banco de dados configurado (SQLite ou PostgreSQL)
- [ ] `npx prisma migrate dev` executado
- [ ] `node prisma/seed_rifas.js` executado (2 rifas criadas)
- [ ] `npm run dev` rodando em http://localhost:3000
- [ ] ngrok rodando (URL pública gerada)
- [ ] Webhook configurado no Mercado Pago
- [ ] Página inicial mostrando Gol e Chevette

---

## 🧪 TESTAR O FLUXO COMPLETO

1. **Acesse:** http://localhost:3000
2. **Clique:** "Participar do Sorteio" (Gol)
3. **Faça login** (crie uma conta se não tiver)
4. **Preencha dados** e gere PIX
5. **Simule pagamento** (use cartão de teste do Mercado Pago)
6. **Aguarde 3-5 segundos**
7. **Popup de sucesso** deve aparecer com números animados! 🎉

---

## 📞 PRECISA DE AJUDA?

**Arquivos criados para você:**
- `CONFIGURACAO_BANCO.md` - Guia do banco de dados
- `GUIA_NGROK.md` - Guia completo do ngrok
- `start.ps1` - Script automatizado
- `PASSO_A_PASSO.md` - Este arquivo

**Execute apenas:**
```powershell
.\start.ps1
```

E depois configure o ngrok! 🚀
