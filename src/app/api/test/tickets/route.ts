import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Endpoint de teste para verificar status de tickets
 * GET /api/test/tickets?usuarioId=1
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const usuarioId = searchParams.get("usuarioId");

    if (usuarioId) {
      // Busca tickets de um usuário específico
      const tickets = await prisma.ticket.findMany({
        where: {
          usuarioId: parseInt(usuarioId),
        },
        include: {
          rifa: true,
          usuario: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return NextResponse.json({
        total: tickets.length,
        tickets: tickets.map((t) => ({
          id: t.id,
          numero: t.numero,
          status: t.status,
          paymentId: t.paymentId,
          rifa: t.rifa.titulo,
          usuario: t.usuario?.email || "N/A",
          createdAt: t.createdAt,
        })),
      });
    }

    // Busca todos os tickets (últimos 50)
    const tickets = await prisma.ticket.findMany({
      include: {
        rifa: true,
        usuario: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    });

    return NextResponse.json({
      total: tickets.length,
      tickets: tickets.map((t) => ({
        id: t.id,
        numero: t.numero,
        status: t.status,
        paymentId: t.paymentId,
        rifa: t.rifa.titulo,
        usuario: t.usuario?.email || "N/A",
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    return NextResponse.json(
      { message: "Erro ao buscar tickets." },
      { status: 500 }
    );
  }
}
