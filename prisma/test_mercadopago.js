/**
 * SCRIPT DE TESTE - MERCADO PAGO
 * 
 * Execute este script para testar a integração com o Mercado Pago
 * Comando: node prisma/test_mercadopago.js
 */

async function testarMercadoPago() {
  console.log("🔍 Iniciando testes do Mercado Pago...\n");

  // 1. Verificar variáveis de ambiente
  console.log("1️⃣ Verificando variáveis de ambiente:");
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  const publicKey = process.env.MERCADOPAGO_PUBLIC_KEY;

  if (!accessToken) {
    console.log("❌ MERCADOPAGO_ACCESS_TOKEN não encontrado!");
    return;
  }
  if (!publicKey) {
    console.log("❌ MERCADOPAGO_PUBLIC_KEY não encontrada!");
    return;
  }

  console.log(`✅ Access Token: ${accessToken.substring(0, 20)}...`);
  console.log(`✅ Public Key: ${publicKey.substring(0, 20)}...`);
  console.log("");

  // 2. Testar criação de pagamento PIX
  console.log("2️⃣ Testando criação de pagamento PIX:");

  try {
    const response = await fetch("http://localhost:3000/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cookie": "userId=test-user-123" // ID de usuário de teste
      },
      body: JSON.stringify({
        rifaId: "sua-rifa-id-aqui", // Substitua pelo ID real de uma rifa
        quantidade: 3,
        nome: "Teste Usuario",
        email: "teste@exemplo.com",
        telefone: "11999999999",
        cpf: "12345678900"
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Pagamento PIX criado com sucesso!");
      console.log("📋 Dados do PIX:");
      console.log(`   - QR Code: ${data.qrCode.substring(0, 50)}...`);
      console.log(`   - Valor: R$ ${data.valor.toFixed(2)}`);
      console.log(`   - Transaction ID: ${data.transactionId}`);
      console.log(`   - Expira em: ${data.tempoExpiracao} segundos`);
    } else {
      const error = await response.text();
      console.log("❌ Erro ao criar pagamento:");
      console.log(error);
    }
  } catch (error) {
    console.log("❌ Erro na requisição:");
    console.log(error.message);
  }

  console.log("\n✅ Testes concluídos!");
}

// Executar testes
testarMercadoPago().catch(console.error);
