# Migração Asaas → Mercado Pago

## ✅ Mudanças Realizadas

### 1. **Biblioteca de Pagamento**
- ✅ Removido: `src/lib/asaas.ts`
- ✅ Criado: `src/lib/mercadopago.ts` com integração completa do Mercado Pago

### 2. **Schema do Banco de Dados**
- ✅ Removido campo `asaasCustomerId` da tabela `Usuario`
- ⚠️ **Ação necessária**: Rodar migração do Prisma

### 3. **API de Checkout**
- ✅ Atualizado `src/app/api/checkout/route.ts` para usar Mercado Pago
- ✅ Implementado geração de PIX via Mercado Pago
- ✅ Reserva automática de números da rifa

### 4. **Webhook de Pagamento**
- ✅ Atualizado `src/app/api/webhook/payment/route.ts`
- ✅ Processamento de notificações do Mercado Pago
- ✅ Confirmação automática de pagamentos aprovados

### 5. **Utilidades**
- ✅ Adicionada função `gerarNumerosUnicos()` em `src/utils/geradorDeNumeros.ts`

---

## 🔧 Configuração Necessária

### Variáveis de Ambiente (.env)

**REMOVER:**
```env
# Asaas (Remover estas variáveis)
ASAAS_API_URL=
ASAAS_API_KEY=
ASAAS_WEBHOOK_SECRET=
```

**ADICIONAR:**
```env
# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=seu_access_token_aqui
```

### Como obter o Access Token do Mercado Pago:

1. Acesse: https://www.mercadopago.com.br/developers/panel
2. Vá em "Suas integrações" → "Credenciais"
3. Copie o **Access Token de Produção** (ou Teste)
4. Cole no arquivo `.env`

---

## 📋 Próximos Passos

### 1. Criar migração do banco de dados:
```bash
npx prisma migrate dev --name remove_asaas_add_mercadopago
```

### 2. Aplicar migração em produção:
```bash
npx prisma migrate deploy
```

### 3. Configurar Webhook no Mercado Pago:

1. Acesse: https://www.mercadopago.com.br/developers/panel/webhooks
2. Clique em "Criar webhook"
3. Configure:
   - **URL**: `https://seu-dominio.com/api/webhook/payment`
   - **Eventos**: Marque apenas "Pagamentos"
4. Salve o webhook

---

## 🧪 Testando a Integração

### Testar criação de PIX:
1. Acesse sua aplicação
2. Escolha quantidade de números
3. Preencha os dados
4. Clique em "Gerar PIX"
5. Verifique se o QR Code é exibido

### Testar pagamento:
1. Use o app do Mercado Pago (modo sandbox/teste)
2. Escaneie o QR Code gerado
3. Confirme o pagamento
4. Verifique se:
   - Webhook foi recebido
   - Tickets foram atualizados para "pago"
   - Email de confirmação foi enviado

---

## 🔍 Funções Principais

### `criarCobrancaPix()`
Cria um pagamento PIX no Mercado Pago e retorna:
- QR Code (base64)
- Código PIX (copia e cola)
- ID da transação
- Tempo de expiração

### `buscarPagamento()`
Consulta status de um pagamento pelo ID

### `verificarPagamentoAprovado()`
Verifica se um pagamento foi aprovado

---

## 📦 Dependências Instaladas

```json
{
  "mercadopago": "^2.x.x"
}
```

---

## ⚠️ Importante

- O Mercado Pago **não exige** criação prévia de clientes (diferente do Asaas)
- Pagamentos PIX expiram em 30 minutos por padrão
- O webhook é essencial para confirmar pagamentos automaticamente
- Teste sempre em ambiente de sandbox antes de produção

---

## 🆘 Troubleshooting

### Erro: "Access Token inválido"
- Verifique se copiou o token completo
- Confirme se está usando o token de produção (não o público)

### Webhook não está funcionando:
- Confirme que a URL está acessível publicamente
- Verifique os logs do Mercado Pago no painel
- Teste manualmente com ferramentas como Postman

### PIX não está sendo gerado:
- Verifique se o Access Token está configurado
- Confira os logs do console para erros detalhados
- Certifique-se de que todos os dados do usuário estão preenchidos
