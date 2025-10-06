import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("payment_id");

    if (!paymentId) {
      return NextResponse.json({ message: "Payment ID é obrigatório" }, { status: 400 });
    }

    // Buscar tickets pelo paymentId
    const tickets = await prisma.ticket.findMany({
      where: { 
        paymentId: paymentId,
        status: "pago"
      },
      include: {
        rifa: {
          select: {
            id: true,
            titulo: true,
            premio: true,
          }
        }
      },
      orderBy: {
        numero: "asc"
      }
    });

    if (tickets.length === 0) {
      return NextResponse.json({ message: "Nenhum ticket encontrado para este pagamento" }, { status: 404 });
    }

    return NextResponse.json(tickets);
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}