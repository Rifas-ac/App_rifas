import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: any
) {
  const rifaId = parseInt(context.params.id, 10);

  if (isNaN(rifaId)) {
    return NextResponse.json({ error: "ID da rifa inválido" }, { status: 400 });
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: {
        rifaId: rifaId,
      },
    });
    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    return NextResponse.json(
      { error: "Erro ao buscar tickets" },
      { status: 500 }
    );
  }
}