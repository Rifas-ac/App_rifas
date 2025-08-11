import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { randomUUID } from "crypto";
import { geradorDeNumeros } from "@/utils/geradorDeNumeros";
import type { Prisma } from "@prisma/client"; // Importar o tipo Prisma

export async function POST(request: Request) {
  const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });
  const payment = new Payment(client);

  try {
    const body = await request.json();
    const { rifaId, quantidade, comprador, paymentData } = body;

    if (!rifaId || !quantidade || !comprador) {
      return NextResponse.json({ message: "Dados da rifa ou do comprador estão incompletos." }, { status: 400 });
    }

    const externalReference = randomUUID();

    // Transação para garantir que a reserva dos tickets seja atômica.
    const dadosParaPagamento = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Adicionar tipo para 'tx'
      const rifa = await tx.rifa.findUniqueOrThrow({ where: { id: rifaId } });
      const ticketsVendidos = await tx.ticket.count({ where: { rifaId: rifa.id } });

      if (ticketsVendidos + quantidade > rifa.totalNumeros) {
        throw new Error(`Não há números suficientes. Restam: ${rifa.totalNumeros - ticketsVendidos}`);
      }

      const novosNumeros = await geradorDeNumeros(tx, quantidade, rifa.id);

      // Salva ou atualiza o usuário com todos os dados fornecidos.
      const usuario = await tx.usuario.upsert({
        where: { email: comprador.email },
        update: {
          nome: comprador.nome,
          sobrenome: comprador.sobrenome,
          cpf: comprador.cpf,
          telefone: comprador.telefone || "N/A",
        },
        create: { ...comprador, telefone: comprador.telefone || "N/A" },
      });

      const ticketsParaCriar = novosNumeros.map((numero) => ({
        numero,
        rifaId,
        status: "reservado",
        usuarioId: usuario.id,
        checkoutSessionId: externalReference,
      }));

      await tx.ticket.createMany({ data: ticketsParaCriar });

      const valorTotal = quantidade * rifa.valorCota;
      return { valorTotal, usuario, rifa, externalReference };
    });

    let paymentRequestBody;
    const notification_url = `${process.env.NEXT_PUBLIC_API_URL}/api/webhook/payment`;

    // Lógica condicional para montar o corpo do pagamento
    if (paymentData && paymentData.token) {
      // Caso: Pagamento com Cartão de Crédito
      paymentRequestBody = {
        transaction_amount: Number(dadosParaPagamento.valorTotal.toFixed(2)),
        token: paymentData.token,
        description: `${quantidade} ticket(s) para a rifa: ${dadosParaPagamento.rifa.titulo}`,
        installments: paymentData.installments,
        payment_method_id: paymentData.payment_method_id,
        issuer_id: paymentData.issuer_id,
        payer: {
          email: comprador.email,
          first_name: comprador.nome,
          last_name: comprador.sobrenome,
          identification: { type: "CPF", number: comprador.cpf },
        },
        notification_url,
        external_reference: dadosParaPagamento.externalReference,
      };
    } else {
      // Caso: Pagamento com PIX
      paymentRequestBody = {
        transaction_amount: Number(dadosParaPagamento.valorTotal.toFixed(2)),
        description: `${quantidade} ticket(s) para a rifa: ${dadosParaPagamento.rifa.titulo}`,
        payment_method_id: "pix",
        payer: {
          email: comprador.email,
          first_name: comprador.nome,
          last_name: comprador.sobrenome,
          identification: { type: "CPF", number: comprador.cpf },
        },
        notification_url,
        external_reference: dadosParaPagamento.externalReference,
      };
    }

    const result = await payment.create({ body: paymentRequestBody });

    await prisma.ticket.updateMany({
      where: { checkoutSessionId: dadosParaPagamento.externalReference },
      data: { checkoutSessionId: String(result.id) },
    });

    return NextResponse.json(
      {
        paymentId: result.id,
        status: result.status,
        detail: result.status_detail,
        qrCode: result.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
      },
      { status: 201 }
    );
  } catch (error: any) {
    const errorMessage = error.cause?.message || error.message || "Erro desconhecido.";
    console.error("Erro Detalhado no Checkout:", JSON.stringify(error, null, 2));
    return NextResponse.json({ message: `Falha ao criar pagamento: ${errorMessage}` }, { status: 500 });
  }
}
