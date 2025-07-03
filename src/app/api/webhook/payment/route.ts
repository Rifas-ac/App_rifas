import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';

// Inicializa o cliente do Mercado Pago com suas credenciais
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!
});

// Instancia o controlador de Pagamentos
const payment = new Payment(client);

/**
 * Endpoint de Webhook para receber e processar notificações do Mercado Pago.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Webhook recebido:', body);

    // Verificamos se a notificação é sobre um pagamento
    if (body.type === 'payment') {
      const paymentId = body.data.id;

      // 1. Busca os detalhes completos do pagamento no Mercado Pago
      // Isso é uma medida de segurança para garantir que o status é oficial.
      console.log(`Buscando detalhes do pagamento ID: ${paymentId}`);
      const paymentDetails = await payment.get({ id: paymentId });
      console.log('Detalhes do pagamento obtidos:', paymentDetails);

      // 2. Verifica se o pagamento foi realmente aprovado ('approved')
      if (paymentDetails.status === 'approved') {
        const checkoutSessionId = String(paymentDetails.id);

        console.log(`Pagamento ${checkoutSessionId} aprovado. Atualizando banco de dados...`);

        // 3. Atualiza os tickets no nosso banco de dados
        // Encontramos os tickets que foram reservados com este ID de pagamento
        // e mudamos o status para 'pago'.
        const updatedTickets = await prisma.ticket.updateMany({
          where: {
            checkoutSessionId: checkoutSessionId,
            status: 'reservado' // Garante que só atualizemos tickets que estavam aguardando
          },
          data: {
            status: 'pago'
          }
        });

        console.log(`${updatedTickets.count} tickets foram atualizados para 'pago'.`);
        // Lógicas futuras:
        // - Enviar um e-mail de confirmação para o comprador.
        // - Notificar um administrador.
      } else {
        console.log(`Status do pagamento ${paymentDetails.id} é '${paymentDetails.status}'. Nenhuma ação necessária.`);
      }
    }

    // 4. Responde 200 OK para o Mercado Pago para confirmar o recebimento
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao processar webhook do Mercado Pago:', error);
    return NextResponse.json({ status: 'error', message: 'Erro interno do servidor' }, { status: 500 });
  }
}
