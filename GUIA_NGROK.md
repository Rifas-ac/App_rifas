# 🌐 GUIA COMPLETO - NGROK

## O que é ngrok?

O **ngrok** cria um túnel seguro para expor seu servidor local (localhost:3000) na internet.
Isso é necessário para o Mercado Pago enviar notificações (webhooks) quando um pagamento for aprovado.

---

## 🚀 INSTALAÇÃO E USO DO NGROK

### **Método 1: Download Direto (Mais Fácil)**

#### 1. **Baixar ngrok:**
- Acesse: https://ngrok.com/download
- Clique em **"Download for Windows"**
- Extraia o arquivo `ngrok.exe` para uma pasta (ex: `C:\ngrok\`)

#### 2. **Criar conta (grátis):**
- Acesse: https://dashboard.ngrok.com/signup
- Crie uma conta grátis
- Copie seu **token de autenticação**

#### 3. **Autenticar ngrok:**

Abra o PowerShell e execute:

```powershell
# Vá para a pasta onde está o ngrok.exe
cd C:\ngrok

# Autentique (substitua SEU_TOKEN pelo token copiado)
.\ngrok.exe config add-authtoken SEU_TOKEN
```

#### 4. **Executar ngrok:**

```powershell
# Inicia o túnel na porta 3000
.\ngrok.exe http 3000
```

**Você verá algo assim:**

```
ngrok                                                                                                                                                        
                                                                                                                                                               
Session Status                online                                                                                                                           
Account                       Seu Nome (Plan: Free)                                                                                                           
Version                       3.x.x                                                                                                                            
Region                        United States (us)                                                                                                               
Web Interface                 http://127.0.0.1:4040                                                                                                            
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000                                                                          
                                                                                                                                                               
Connections                   ttl     opn     rt1     rt5     p50     p90                                                                                      
                              0       0       0.00    0.00    0.00    0.00
```

**COPIE A URL:** `https://abc123.ngrok-free.app` ✅

---

### **Método 2: Via NPM (Se preferir)**

```powershell
# Instalar globalmente
npm install -g ngrok

# Autenticar
ngrok config add-authtoken SEU_TOKEN

# Executar
ngrok http 3000
```

---

## 🔧 CONFIGURAR NO MERCADO PAGO

### 1. **Acesse o painel do Mercado Pago:**
https://www.mercadopago.com.br/developers/panel/app/589577006/webhooks

### 2. **Configure o webhook:**

- **URL do Webhook:** `https://abc123.ngrok-free.app/api/webhook/payment`
  *(Substitua `abc123` pela sua URL do ngrok)*

- **Eventos:** Marque **`payment`** ✅

- Clique em **Salvar**

---

## ✅ TESTAR SE ESTÁ FUNCIONANDO

### 1. **Deixe o ngrok rodando** (não feche a janela!)

### 2. **Em outro terminal, inicie o Next.js:**
```powershell
npm run dev
```

### 3. **Acesse pelo navegador:**
- Local: http://localhost:3000
- Público (ngrok): https://abc123.ngrok-free.app

### 4. **Teste o webhook:**

No painel do ngrok (http://127.0.0.1:4040), você verá todas as requisições chegando.

---

## 🎯 RESUMO DOS COMANDOS

```powershell
# Terminal 1 - ngrok
cd C:\ngrok
.\ngrok.exe http 3000

# Terminal 2 - Next.js
cd "H:\Serviçõs\App_rifas"
npm run dev
```

---

## ⚠️ IMPORTANTE

- **NÃO FECHE** a janela do ngrok enquanto estiver testando
- Cada vez que reiniciar o ngrok, a URL muda (plano grátis)
- Precisará atualizar a URL no Mercado Pago toda vez
- Para URL fixa, precisa do plano pago do ngrok

---

## 📸 INTERFACE WEB DO NGROK

Acesse: http://127.0.0.1:4040

Lá você pode:
- Ver todas as requisições em tempo real
- Testar requisições manualmente
- Ver detalhes dos webhooks do Mercado Pago

---

## 🐛 PROBLEMAS COMUNS

### "ngrok não é reconhecido"
- Adicione a pasta do ngrok ao PATH
- Ou execute com caminho completo: `C:\ngrok\ngrok.exe http 3000`

### "Failed to listen on port 3000"
- O Next.js não está rodando
- Execute `npm run dev` primeiro

### "Webhook não chega"
- Verifique se a URL está correta no Mercado Pago
- Confirme se o ngrok está rodando
- Veja os logs em http://127.0.0.1:4040

---

🎉 **Pronto! Agora você tem um túnel seguro para receber webhooks!**
