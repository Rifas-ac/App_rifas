import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { Resend } from 'resend';
import { ConfirmacaoCompraEmail } from '@/components/emails/ConfirmacaoCompraEmail';

/**
 * Processa um pagamento aprovado: atualiza o banco e envia e-mail de confirmação.
 * @param paymentDetails - O objeto de pagamento completo obtido do Mercado Pago.
 */
async function handleApprovedPayment(paymentDetails: any) {
  const checkoutSessionId = String(paymentDetails.id);
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { usuario, ticketsAtualizados } = await prisma.$transaction(async tx => {
    const ticketsParaAtualizar = await tx.ticket.findMany({
      where: { checkoutSessionId, status: 'reservado' },
      include: { usuario: true, rifa: true }
    });

    if (ticketsParaAtualizar.length === 0 || !ticketsParaAtualizar[0].usuario) {
      return { usuario: null, ticketsAtualizados: [] };
    }

    await tx.ticket.updateMany({
      where: { id: { in: ticketsParaAtualizar.map(t => t.id) } },
      data: { status: 'pago' }
    });

    return { usuario: ticketsParaAtualizar[0].usuario, ticketsAtualizados: ticketsParaAtualizar };
  });

  if (usuario && ticketsAtualizados.length > 0) {
    try {
      await resend.emails.send({
        from: 'Rifas Online <onboarding@resend.dev>',
        to: [usuario.email],
        subject: `Confirmação de Compra - Rifa "${ticketsAtualizados[0].rifa.titulo}"`,
        react: await ConfirmacaoCompraEmail({
          nomeUsuario: usuario.nome,
          numerosComprados: ticketsAtualizados.map(t => t.numero),
          tituloRifa: ticketsAtualizados[0].rifa.titulo
        })
      });
      console.log(`E-mail de confirmação enviado para ${usuario.email}.`);
    } catch (emailError) {
      // Se o envio do e-mail falhar, o pagamento já foi confirmado.
      // É importante logar este erro para uma ação manual (ex: reenviar o e-mail).
      console.error(`Pagamento ${checkoutSessionId} confirmado, mas falha ao enviar e-mail:`, emailError);
    }
  }
}

/**
 * Endpoint de Webhook para notificações do Mercado Pago.
 */
export async function POST(request: Request) {
  const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });
  const payment = new Payment(client);

  try {
    // TODO: Em produção, validar a assinatura 'x-signature' do Mercado Pago para segurança.
    const body = await request.json();

    if (body.type === 'payment') {
      const paymentId = body.data.id;
      const paymentDetails = await payment.get({ id: paymentId });

      if (paymentDetails.status === 'approved') {
        switch (paymentDetails.payment_type_id) {
          case 'credit_card':
          case 'account_money': // PIX ou Saldo em Conta
          case 'ticket': // Boleto
            await handleApprovedPayment(paymentDetails);
            break;
          default:
            break;
        }
      }
    }

    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (error) {
    console.error('Erro no processamento do webhook:', error);
    return NextResponse.json({ status: 'error', message: 'Erro interno' }, { status: 500 });
  }
}
