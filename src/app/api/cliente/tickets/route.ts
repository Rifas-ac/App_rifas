import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("user");

  if (!userEmail) {
    return NextResponse.json({ error: "Email do usuário não fornecido" }, { status: 400 });
  }

  try {
    // 1. Encontrar o usuário pelo email
    const usuario = await prisma.usuario.findUnique({
      where: { email: userEmail },
    });

    if (!usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // 2. Buscar todos os tickets pagos associados a esse usuário
    const tickets = await prisma.ticket.findMany({
      where: {
        usuarioId: usuario.id,
        status: "pago", // Apenas tickets com status 'pago'
      },
      include: {
        rifa: true, // Incluir os detalhes da rifa associada
      },
      orderBy: {
        createdAt: "desc", // Ordenar pelos mais recentes
      },
    });

    // 3. Agrupar os tickets por rifa
    const rifasAgrupadas = tickets.reduce((acc, ticket) => {
      const rifaId = ticket.rifa.id;
      if (!acc[rifaId]) {
        acc[rifaId] = {
          rifa: {
            id: ticket.rifa.id,
            nome: ticket.rifa.titulo,
            // Adicione outros detalhes da rifa que você queira exibir
          },
          numeros: [],
        };
      }
      acc[rifaId].numeros.push(ticket.numero);
      return acc;
    }, {} as Record<number, { rifa: { id: number; nome: string }; numeros: string[] }>);

    // 4. Converter o objeto em um array
    const resultadoFinal = Object.values(rifasAgrupadas);

    return NextResponse.json(resultadoFinal);
  } catch (error) {
    console.error("Erro ao buscar tickets:", error);
    return NextResponse.json({ error: "Erro interno ao buscar os tickets" }, { status: 500 });
  }
}
