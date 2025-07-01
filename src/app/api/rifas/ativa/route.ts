import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Endpoint para buscar a rifa que está atualmente ativa.
 */
export async function GET() {
  try {
    const rifaAtiva = await prisma.rifa.findFirst({
      where: {
        status: "ativa",
      },
      include: {
        tickets: {
          orderBy: {
            numero: "asc",
          },
        },
      },
    });

    if (!rifaAtiva) {
      return NextResponse.json({ message: "Nenhuma rifa ativa encontrada." }, { status: 404 });
    }

    // Se encontrou, retorna os dados da rifa com status 200 OK
    return NextResponse.json(rifaAtiva, { status: 200 });
  } catch (error) {
    console.error("Falha ao buscar rifa ativa:", error);
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}
