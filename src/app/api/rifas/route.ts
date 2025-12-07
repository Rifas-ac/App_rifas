import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Endpoint PÚBLICO para buscar rifas disponíveis
 * GET /api/rifas
 */
export async function GET() {
  try {
    const rifas = await prisma.rifa.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tickets: true,
      },
    });
    return NextResponse.json(rifas);
  } catch (error) {
    console.error("Erro ao buscar rifas:", error);
    return NextResponse.json({ error: "Erro ao buscar rifas" }, { status: 500 });
  }
}
