import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { randomUUID } from 'crypto';
import { geradorDeNumeros } from '@/utils/geradorDeNumeros';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!
});
const payment = new Payment(client);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rifaId, quantidade, comprador } = body;

    if (!rifaId || !quantidade || !comprador) {
      return NextResponse.json({ message: 'Dados incompletos.' }, { status: 400 });
    }

    const externalReference = randomUUID(); // Gera um ID único para a transação

    // --- Ínicio da transação Prisma ---
    const dadosParaPagamento = await prisma.$transaction(async tx => {
      // 1. Busca a rifa e conta quantos tickets já foram vendidos/reservados
      const rifa = await tx.rifa.findUniqueOrThrow({
        where: { id: rifaId }
      });
      const ticketsVendidos = await tx.ticket.count({
        where: { rifaId: rifa.id }
      });

      // 2. Validação: Verifica se ainda há números disponíveis na rifa
      if (ticketsVendidos + quantidade > rifa.totalNumeros) {
        throw new Error('Quantidade de tickets solicitada excede o total disponível na rifa.');
      }

      // 3. Gera números aleatórios únicos para esta compra
      const novosNumeros = await geradorDeNumeros(tx, quantidade, rifaId);

      // 4. Cria ou atualiza o comprador
      const usuario = await tx.usuario.upsert({
        where: { email: comprador.email },
        update: { nome: comprador.nome, telefone: comprador.telefone },
        create: { ...comprador }
      });

      // 5. Prepara os dados dos novos tickets para serem criados
      const ticketsParaCriar = novosNumeros.map(numero => ({
        numero: numero,
        rifaId: rifa.id,
        status: 'reservado',
        usuarioId: usuario.id,
        checkoutSessionId: externalReference // Associa o ID da sessão de checkout
      }));

      // 6.Cria os tickets no banco de dados
      await tx.ticket.createMany({
        data: ticketsParaCriar
      });

      // 7. Prepara os dados para o Mercado Pago
      const valorTotal = quantidade * rifa.valorCota;

      return { valorTotal, usuario, rifa };
    });
    // --- Fim da transação Prisma ---

    // 8. Cria o pagamento no Mercado Pago
    const paymentData = {
      transaction_amount: dadosParaPagamento.valorTotal,
      description: `${quantidade} ticket(s) para a rifa: ${dadosParaPagamento.rifa.titulo}`,
      payment_method_id: 'pix',
      payer: {
        email: dadosParaPagamento.usuario.email,
        first_name: dadosParaPagamento.usuario.nome
      },
      notification_url: `${process.env.NGROK_URL}/api/webhook/payment`,
      external_reference: externalReference // Usamos o ID único gerado para rastrear a transação
    };

    const result = await payment.create({ body: paymentData });

    // Atualiza o checkoutSessionId dos tickets criados com o ID real do pagamento do MP
    await prisma.ticket.updateMany({
      where: { checkoutSessionId: externalReference },
      data: { checkoutSessionId: String(result.id) }
    });

    return NextResponse.json(
      {
        paymentId: result.id,
        qrCode: result.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao processar o checkout:', error);
    return NextResponse.json({ message: 'Erro ao processar o checkout.' }, { status: 500 });
  }
}
