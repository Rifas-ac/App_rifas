import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buscarPagamento } from "@/lib/mercadopago";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("paymentId");

    if (!paymentId) {
      return NextResponse.json({ error: "Payment ID é obrigatório" }, { status: 400 });
    }

    // Busca o status no Mercado Pago
    const payment = await buscarPagamento(parseInt(paymentId));

    // Busca os tickets associados
    const tickets = await prisma.ticket.findMany({
      where: {
        paymentId: paymentId,
      },
      include: {
        rifa: true,
      },
      orderBy: {
        numero: "asc",
      },
    });

    return NextResponse.json({
      status: payment.status,
      statusDetail: payment.status_detail,
      tickets: tickets.map((t) => ({
        numero: parseInt(t.numero),
        status: t.status,
        rifaTitulo: t.rifa.titulo,
      })),
    });
  } catch (error: any) {
    console.error("Erro ao verificar status do pagamento:", error);
    return NextResponse.json(
      { error: "Erro ao verificar pagamento" },
      { status: 500 }
    );
  }
}
