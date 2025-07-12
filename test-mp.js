// test-mp.js

// Usamos 'require' pois este é um script Node.js simples
const { MercadoPagoConfig, Payment } = require('mercadopago');
const dotenv = require('dotenv');

// Carrega explicitamente as variáveis do arquivo .env
dotenv.config();

console.log('Iniciando teste de conexão isolado...');

// Pega o Access Token do seu .env
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!accessToken) {
  console.error('ERRO: Access Token não encontrado no arquivo .env!');
  process.exit(1);
}

console.log('Access Token carregado com sucesso.');

console.log(accessToken);

// Função principal assíncrona para rodar o teste
const runTest = async () => {
  try {
    // 1. Inicializa o cliente com a chave carregada
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);

    // 2. Cria um corpo (body) de pagamento MÍNIMO e VÁLIDO
    const paymentData = {
      transaction_amount: 50,
      description: 'Pagamento de teste de isolamento',
      payment_method_id: 'pix',
      payer: {
        email: 'test_user_12345678@testeuser.com' // E-mail de teste oficial do MP
      }
    };

    console.log('\nEnviando o seguinte objeto para o Mercado Pago:');
    console.log(paymentData);

    // 3. Tenta criar o pagamento
    console.log('\nCriando pagamento...');
    const result = await payment.create({
      body: paymentData
    });

    console.log(result);
  } catch (error) {
    // 5. Se falhar, mostra o erro detalhado
    console.error('\n❌ FALHA! Ocorreu um erro ao criar o pagamento:');
    console.error(error);
  }
};

// Executa a função de teste
runTest();
