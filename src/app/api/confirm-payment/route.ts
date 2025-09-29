import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { ConfirmacaoCompraEmail } from "@/components/emails/ConfirmacaoCompraEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID não fornecido" }, { status: 400 });
    }

    // Tenta atualizar os tickets e enviar o e-mail
    await prisma.$transaction(async (tx) => {
      const tickets = await tx.ticket.findMany({
        where: { checkoutSessionId: sessionId, status: "reservado" },
        include: { usuario: true, rifa: true },
      });

      if (tickets.length === 0 || !tickets[0].usuario || !tickets[0].rifa) {
        // Se não há tickets para atualizar, a transação é interrompida
        return;
      }

      await tx.ticket.updateMany({
        where: { id: { in: tickets.map((t) => t.id) } },
        data: { status: "pago" },
      });

      // Se a atualização foi bem-sucedida, envia o e-mail
      const { usuario, rifa } = tickets[0];
      await resend.emails.send({
        from: "Garagem VW <onboarding@resend.dev>",
        to: [usuario.email],
        subject: `✅ Compra Confirmada - Rifa "${rifa.titulo}"`,
        react: await ConfirmacaoCompraEmail({
          nomeUsuario: usuario.nome,
          numerosComprados: tickets.map((t) => t.numero),
          tituloRifa: rifa.titulo,
        }),
      });
    });

    // Após a transação, busca todos os tickets (agora pagos) para retornar
    const ticketsPagos = await prisma.ticket.findMany({
      where: { checkoutSessionId: sessionId },
      include: { rifa: true },
      orderBy: { numero: "asc" },
    });

    return NextResponse.json(ticketsPagos);
  } catch (error) {
    console.error(`Falha ao confirmar pagamento:`, error);
    // Mesmo que o e-mail falhe, tentamos retornar os tickets se já foram pagos
    const { sessionId } = await req.json();
    const tickets = await prisma.ticket.findMany({
      where: { checkoutSessionId: sessionId, status: "pago" },
      include: { rifa: true },
      orderBy: { numero: "asc" },
    });

    if (tickets.length > 0) return NextResponse.json(tickets);

    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}
