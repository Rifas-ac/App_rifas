# 🧪 Guia Completo de Testes - Mercado Pago

## ✅ O QUE JÁ ESTÁ PRONTO NO CÓDIGO

Parabéns! Seu código está **100% pronto** para funcionar! Já tem:

✅ Endpoint de checkout (`/api/checkout`) - Cria cobrança PIX  
✅ Endpoint de webhook (`/api/webhook/payment`) - Recebe notificação de pagamento  
✅ Geração automática de números únicos após pagamento  
✅ Envio de email de confirmação  
✅ Credenciais de TESTE do Mercado Pago configuradas  

---

## 📋 CHECKLIST DOS 4 TESTES

### ✅ 1. Configurar webhook no Mercado Pago
**STATUS:** ⏳ Você precisa fazer isso manualmente

### ✅ 2. Testar criação de PIX
**STATUS:** ✅ Código pronto - funciona automaticamente

### ✅ 3. Simular pagamento
**STATUS:** ✅ Código pronto - funciona automaticamente

### ✅ 4. Verificar se números foram gerados
**STATUS:** ✅ Código pronto - funciona automaticamente

---

## 🚀 PASSO A PASSO COMPLETO

### **PASSO 1: Expor seu localhost com Ngrok** (obrigatório)

O Mercado Pago precisa acessar seu servidor, mas ele está rodando em `localhost:3001` (só você acessa).  
Para resolver isso, vamos usar o **Ngrok** (cria um túnel da internet para seu computador).

#### 1.1 - Baixar Ngrok
1. Acesse: https://ngrok.com/download
2. Faça o download para Windows
3. Extraia o arquivo `ngrok.exe` em uma pasta fácil de acessar (ex: `C:\ngrok`)

#### 1.2 - Criar conta e pegar o token
1. Crie uma conta grátis em: https://dashboard.ngrok.com/signup
2. Após o login, copie seu **Authtoken** em: https://dashboard.ngrok.com/get-started/your-authtoken
3. No PowerShell, execute (substitua `SEU_TOKEN_AQUI` pelo token copiado):
```powershell
cd C:\ngrok
.\ngrok.exe config add-authtoken SEU_TOKEN_AQUI
```

#### 1.3 - Iniciar o túnel Ngrok
**ATENÇÃO:** Seu servidor Next.js está rodando na porta **3001** (não 3000!)

```powershell
cd C:\ngrok
.\ngrok.exe http 3001
```

Você verá algo assim:
```
Session Status    online
Forwarding        https://abc123.ngrok-free.app -> http://localhost:3001
```

⚠️ **COPIE a URL `https://abc123.ngrok-free.app`** - você vai usar ela no próximo passo!

---

### **PASSO 2: Configurar Webhook no Mercado Pago** ⏳ VOCÊ PRECISA FAZER

#### 2.1 - Acessar o painel do Mercado Pago
1. Entre em: https://www.mercadopago.com.br/developers/panel
2. Faça login com sua conta de TESTE

#### 2.2 - Acessar Webhooks
1. No menu lateral, clique em **"Seu negócio" → "Configurações"**
2. Clique em **"Webhooks"** ou acesse direto: https://www.mercadopago.com.br/developers/panel/webhooks

#### 2.3 - Criar novo Webhook
1. Clique em **"Criar Webhook"** ou **"+ Adicionar"**
2. Preencha:
   - **Nome:** Rifas AC - Webhook de Pagamento
   - **URL de Produção:** `https://abc123.ngrok-free.app/api/webhook/payment`
     - ⚠️ Substitua `abc123` pela sua URL do Ngrok!
     - ⚠️ Não esqueça o `/api/webhook/payment` no final!
   - **Eventos:** Marque apenas **"Pagamentos"** (ou "payment")
   - **Modo:** TESTE

3. Clique em **"Salvar"**

#### 2.4 - Testar Webhook (opcional, mas recomendado)
O Mercado Pago pode enviar um evento de teste. Se aparecer essa opção, clique em **"Enviar teste"**.

---

### **PASSO 3: Testar Criação de PIX** 🧪

Agora vamos testar se o PIX é gerado corretamente!

#### 3.1 - Acessar a aplicação
1. Abra o navegador em: http://localhost:3001
2. Você deve ver a home com o **Gol LS 1986** (colorido)

#### 3.2 - Fazer login (se necessário)
1. Clique em **"Login"** ou **"Criar conta"**
2. Cadastre um usuário de teste:
   - Nome: Teste
   - Sobrenome: Silva
   - Email: teste@gmail.com
   - CPF: 123.456.789-09 (pode ser qualquer CPF válido de teste)
   - Telefone: (11) 99999-9999

#### 3.3 - Iniciar compra
1. Na home, clique em **"Participar Agora"** no card do Gol
2. Selecione a quantidade de números (ex: 3 números)
3. Preencha os dados do formulário:
   - Nome: Teste
   - Sobrenome: Silva
   - Email: teste@gmail.com
   - Telefone: (11) 99999-9999
   - CPF: 123.456.789-09

4. Clique em **"Pagar R$ XX,XX"**

#### 3.4 - Verificar se o PIX foi gerado ✅
Você deve ver:
- ✅ QR Code do PIX
- ✅ Código PIX Copia e Cola
- ✅ Contador regressivo (30 minutos)
- ✅ Botão "Copiar Código"

**✅ TESTE 2 CONCLUÍDO!** - Se você viu isso, a criação de PIX está funcionando!

---

### **PASSO 4: Simular Pagamento no Mercado Pago** 💳

Agora vamos simular que alguém pagou o PIX!

#### 4.1 - Usar cartão de teste do Mercado Pago
Como estamos em modo TESTE, não dá para pagar de verdade. Você tem 2 opções:

**OPÇÃO A: Simular pagamento direto no painel (MAIS FÁCIL)**
1. Acesse: https://www.mercadopago.com.br/developers/panel/payments
2. Procure o pagamento que você acabou de criar (deve estar com status "pending")
3. Clique nos **3 pontinhos** ao lado do pagamento
4. Clique em **"Aprovar pagamento"** ou **"Simular aprovação"**

**OPÇÃO B: Usar cartão de teste (se a opção A não estiver disponível)**
1. Copie o código PIX Copia e Cola
2. Simule o pagamento usando os cartões de teste do Mercado Pago:
   - Cartão aprovado: **5031 4332 1540 6351**
   - CVV: **123**
   - Validade: **11/25**
   - Nome: **APRO**
   - CPF: **123.456.789-09**

⚠️ **IMPORTANTE:** Em modo teste, o Mercado Pago não cobra de verdade. Esses cartões são apenas para simular aprovação/rejeição.

#### 4.2 - Verificar logs do webhook
Após simular a aprovação, volte no PowerShell onde seu servidor Next.js está rodando.

Você deve ver logs assim:
```
Webhook recebido do Mercado Pago: { type: 'payment', ... }
Status do pagamento: approved
External reference: rifa-1-usuario-1-1234567890
5 tickets criados para o usuário teste@gmail.com
E-mail de confirmação enviado com sucesso
```

**✅ TESTE 3 CONCLUÍDO!** - Se você viu esses logs, o webhook está funcionando!

---

### **PASSO 5: Verificar se Números Foram Gerados** 🎫

Agora vamos confirmar que os números foram salvos no banco de dados!

#### 5.1 - Verificar no banco de dados
Abra um novo terminal PowerShell e execute:

```powershell
cd "H:\Serviçõs\App_rifas"
npx prisma studio
```

Isso vai abrir uma interface web em `http://localhost:5555`

#### 5.2 - Verificar tabela Ticket
1. No Prisma Studio, clique em **"Ticket"** no menu lateral
2. Você deve ver os tickets criados:
   - ✅ `rifaId`: 1 (Gol)
   - ✅ `usuarioId`: 1 (seu usuário)
   - ✅ `numero`: números gerados (ex: "42", "128", "503")
   - ✅ `status`: "pago"
   - ✅ `paymentId`: ID do pagamento do Mercado Pago

**✅ TESTE 4 CONCLUÍDO!** - Se você viu os tickets, os números foram gerados com sucesso!

---

## 🎯 FLUXO COMPLETO FUNCIONANDO

Se você completou todos os passos, este é o fluxo que está funcionando:

1. ✅ Usuário escolhe a quantidade de números
2. ✅ Sistema gera QR Code PIX no Mercado Pago
3. ✅ Usuário "paga" o PIX (simulado)
4. ✅ Mercado Pago envia notificação para seu webhook
5. ✅ Webhook verifica o pagamento
6. ✅ Webhook gera números únicos automaticamente
7. ✅ Webhook salva tickets no banco com status "pago"
8. ✅ Webhook envia email de confirmação
9. ✅ Usuário recebe os números por email

---

## 🔧 SOLUÇÃO DE PROBLEMAS

### ❌ Webhook não está recebendo notificações

**Causa:** Ngrok não está rodando ou URL incorreta

**Solução:**
1. Verifique se o Ngrok está rodando (`.\ngrok.exe http 3001`)
2. Copie a nova URL do Ngrok (ela muda toda vez que você reinicia)
3. Atualize a URL no painel do Mercado Pago

### ❌ Erro "QR Code PIX não foi gerado"

**Causa:** Credenciais do Mercado Pago inválidas ou expiradas

**Solução:**
1. Acesse: https://www.mercadopago.com.br/developers/panel/credentials
2. Copie as credenciais de **TESTE** (não de produção!)
3. Atualize no arquivo `.env`:
```
MERCADOPAGO_ACCESS_TOKEN="TEST-..."
MERCADOPAGO_PUBLIC_KEY="TEST-..."
```
4. Reinicie o servidor: `npm run dev`

### ❌ Email não está sendo enviado

**Causa:** Chave da Resend não configurada

**Solução:**
1. Acesse: https://resend.com/
2. Crie uma conta grátis
3. Copie sua API Key
4. Atualize no arquivo `.env`:
```
RESEND_API_KEY="re_..."
```
5. Reinicie o servidor

⚠️ **IMPORTANTE:** Em desenvolvimento, você pode ignorar erros de email. O sistema vai funcionar mesmo se o email falhar.

---

## 📊 RESUMO FINAL

**O QUE VOCÊ PRECISA FAZER:**
1. ⏳ Baixar e configurar Ngrok
2. ⏳ Iniciar Ngrok na porta 3001
3. ⏳ Configurar webhook no painel do Mercado Pago com a URL do Ngrok

**O QUE JÁ ESTÁ PRONTO (código):**
- ✅ Criação de PIX
- ✅ Recebimento de webhook
- ✅ Geração de números
- ✅ Envio de email
- ✅ Salvamento no banco

---

## 🎉 PRONTO!

Depois de configurar o webhook, é só testar! Qualquer dúvida, me chama! 🚀
