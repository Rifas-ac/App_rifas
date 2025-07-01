import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rifaId, numeros, comprador } = body;

    if (!rifaId || !numeros || !comprador) {
      return NextResponse.json({ message: "Dados incompletos." }, { status: 400 });
    }

    const dadosParaPagamento = await prisma.$transaction(async (tx) => {
      const rifa = await tx.rifa.findUniqueOrThrow({ where: { id: rifaId } });
      const ticketsSelecionados = await tx.ticket.findMany({
        where: { rifaId: rifa.id, numero: { in: numeros } },
      });

      const numerosIndisponiveis = ticketsSelecionados.filter((t) => t.status !== "disponivel");
      if (numerosIndisponiveis.length > 0) {
        throw new Error(
          `Os seguintes números não estão mais disponíveis: ${numerosIndisponiveis.map((t) => t.numero).join(", ")}`
        );
      }

      const usuario = await tx.usuario.upsert({
        where: { email: comprador.email },
        update: { nome: comprador.nome, telefone: comprador.telefone },
        create: { ...comprador },
      });

      await tx.ticket.updateMany({
        where: { id: { in: ticketsSelecionados.map((t) => t.id) } },
        data: { status: "reservado", usuarioId: usuario.id },
      });

      const valorTotal = ticketsSelecionados.length * rifa.valorCota;

      return { valorTotal, usuario, ticketsIds: ticketsSelecionados.map((t) => t.id), rifa };
    });

    const payment = new Payment(client);

    const paymentData = {
      transaction_amount: dadosParaPagamento.valorTotal,
      description: `Tickets para a rifa: ${dadosParaPagamento.rifa.titulo}`,
      payment_method_id: "pix",
      payer: {
        email: dadosParaPagamento.usuario.email,
        first_name: dadosParaPagamento.usuario.nome,
      },
      notification_url: "https://f2a2-2804-d59-8504-4600-241d-3e69-ff0a-8316.ngrok-free.app/api/webhook/payment",
      external_reference: dadosParaPagamento.ticketsIds.join(","),
    };

    // Step 5: Fazer a requisição para criar o pagamento
    const result = await payment.create({ body: paymentData });

    // Step 6: Atualizar nossos tickets com o ID do pagamento do Mercado Pago
    await prisma.ticket.updateMany({
      where: { id: { in: dadosParaPagamento.ticketsIds } },
      data: { checkoutSessionId: String(result.id) },
    });

    // Step 7: Retornar os dados do Pix para o Frontend
    return NextResponse.json(
      {
        paymentId: result.id,
        qrCode: result.point_of_interaction?.transaction_data?.qr_code,
        qrCodeBase64: result.point_of_interaction?.transaction_data?.qr_code_base64,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro no checkout:", error);
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 409 });
    }
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}
