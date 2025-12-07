# 🧪 GUIA DE TESTES - MERCADO PAGO

## 📋 Pré-requisitos

✅ Credenciais configuradas no arquivo `.env`
✅ Banco de dados configurado e rodando
✅ Servidor Next.js rodando (`npm run dev`)

---

## 🔧 PASSO 1: Configurar o Webhook no Mercado Pago

### No painel do Mercado Pago:

1. Acesse: https://www.mercadopago.com.br/developers/panel/app/589577006/webhooks
2. Clique em "Webhooks" no menu lateral
3. Configure a URL do webhook:
   - **Em desenvolvimento (teste local)**: Use **ngrok** ou **localtunnel**
   - **Em produção**: `https://seu-dominio.com/api/webhook/payment`

### Como usar ngrok para testes locais:

```bash
# Instalar ngrok (se não tiver)
# Baixe em: https://ngrok.com/download

# Executar ngrok apontando para sua porta local
ngrok http 3000

# Copie a URL que aparece (exemplo: https://abc123.ngrok.io)
# Configure no Mercado Pago: https://abc123.ngrok.io/api/webhook/payment
```

4. Selecione os eventos que deseja receber:
   - ✅ `payment` (obrigatório)
   - ✅ `merchant_order` (recomendado)

5. Salve a configuração

---

## 🧪 PASSO 2: Testar a Criação de PIX

### 2.1. Preparar o banco de dados

```powershell
# Executar migração do Prisma
npx prisma migrate dev

# Criar uma rifa de teste (se não tiver)
npx prisma studio
# Abra o Prisma Studio e crie uma rifa manualmente
```

### 2.2. Iniciar o servidor

```powershell
npm run dev
```

### 2.3. Testar no navegador

1. Acesse: http://localhost:3000
2. Faça login (ou crie uma conta)
3. Clique em "Participar" de uma rifa
4. Preencha os dados:
   - Nome: Teste Usuario
   - Email: seu@email.com
   - Telefone: (11) 99999-9999
   - CPF: Use um CPF válido de teste
   - Quantidade: 3 números

5. Clique em "Gerar PIX"
6. **Verifique se aparece**:
   - ✅ QR Code do PIX
   - ✅ Código PIX para copiar
   - ✅ Valor total
   - ✅ Contador regressivo (30 minutos)

---

## 💳 PASSO 3: Testar o Pagamento

### 3.1. Usar cartões de teste do Mercado Pago

O Mercado Pago fornece cartões de teste para simular pagamentos:

**Para PIX (modo sandbox):**
- Use o aplicativo do Mercado Pago em modo sandbox
- Ou use a API de teste diretamente

**Cartões de crédito de teste:**

| Bandeira   | Número              | CVV | Validade | Resultado  |
|------------|---------------------|-----|----------|------------|
| Mastercard | 5031 4332 1540 6351 | 123 | 11/30    | ✅ Aprovado |
| Visa       | 4235 6477 2802 5682 | 123 | 11/30    | ✅ Aprovado |
| Amex       | 3753 651535 56885   | 1234| 11/30    | ✅ Aprovado |
| Mastercard | 5031 7557 3453 0604 | 123 | 11/30    | ❌ Recusado |

### 3.2. Simular pagamento via API (Recomendado para testes)

```bash
# Instale o Postman ou use curl

curl -X POST https://api.mercadopago.com/v1/payments/:payment_id \
  -H "Authorization: Bearer TEST-5279228678414113-112113-acd97197cc432448dfbd29fc14453031-589577006" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "approved"
  }'
```

---

## 🎯 PASSO 4: Verificar se o Webhook Funcionou

### 4.1. Verificar logs do servidor

No terminal onde o Next.js está rodando, você deve ver:

```
✅ Webhook recebido: payment
📋 Payment ID: 123456789
✅ Pagamento aprovado!
🎫 Gerando 3 números...
✅ 3 tickets criados com sucesso
📧 Email enviado para: seu@email.com
```

### 4.2. Verificar no banco de dados

```powershell
npx prisma studio
```

Verifique se:
- ✅ Novos tickets foram criados
- ✅ Status dos tickets está como "pago"
- ✅ Números foram gerados corretamente

### 4.3. Verificar popup de sucesso

No navegador:
- ✅ Dialog de checkout deve fechar
- ✅ Popup de "Parabéns!" deve aparecer
- ✅ Números devem aparecer um por um (animação)

---

## 📊 PASSO 5: Verificar a Página de Status

1. Acesse: http://localhost:3000/cliente/status
2. Verifique se:
   - ✅ Suas participações aparecem
   - ✅ Os números estão corretos
   - ✅ Status está como "Confirmado" (verde)

---

## 🐛 Resolução de Problemas

### ❌ Webhook não está sendo chamado

- Verifique se o ngrok está rodando
- Confirme a URL no painel do Mercado Pago
- Verifique logs do ngrok: `http://localhost:4040`

### ❌ Erro ao criar PIX

- Verifique se o Access Token está correto
- Confirme se a rifa existe no banco
- Verifique logs do servidor

### ❌ Popup não aparece após pagamento

- Verifique se o webhook foi chamado
- Abra o DevTools (F12) → Console
- Verifique se o polling está rodando

### ❌ Números não foram gerados

- Verifique os logs do webhook
- Confirme se o `external_reference` está no formato correto
- Verifique o banco de dados

---

## 🚀 Checklist de Produção

Antes de colocar em produção:

- [ ] Trocar credenciais de TESTE para PRODUÇÃO no `.env`
- [ ] Configurar webhook com URL de produção
- [ ] Configurar DATABASE_URL de produção
- [ ] Configurar domínio em NEXT_PUBLIC_SITE_URL
- [ ] Testar com pagamento real (valor pequeno)
- [ ] Configurar SSL/HTTPS
- [ ] Habilitar logs de erro (Sentry, LogRocket, etc.)

---

## 📞 Suporte

Se precisar de ajuda:
- Documentação Mercado Pago: https://www.mercadopago.com.br/developers/pt/docs
- Status da API: https://status.mercadopago.com/
