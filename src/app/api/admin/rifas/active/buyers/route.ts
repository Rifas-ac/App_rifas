import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    // 1. Encontrar a rifa ativa
    const rifaAtiva = await prisma.rifa.findFirst({
      where: { status: "ativa" },
    });

    if (!rifaAtiva) {
      return NextResponse.json({ message: "Nenhuma rifa ativa encontrada." }, { status: 404 });
    }

    // 2. Buscar todos os tickets para a rifa ativa, incluindo os dados do usuário
    const tickets = await prisma.ticket.findMany({
      where: {
        rifaId: rifaAtiva.id,
      },
      include: {
        usuario: true, // Incluir os detalhes do usuário associado
      },
      orderBy: {
        numero: "asc",
      },
    });

    // 3. Agrupar os tickets por comprador
    const compradoresAgrupados: Record<string, any> = {};

    tickets.forEach((ticket) => {
      if (ticket.usuario) {
        const userId = ticket.usuario.id;
        if (!compradoresAgrupados[userId]) {
          compradoresAgrupados[userId] = {
            nome: ticket.usuario.nome,
            sobrenome: ticket.usuario.sobrenome,
            cpf: ticket.usuario.cpf,
            telefone: ticket.usuario.telefone,
            email: ticket.usuario.email,
            ticketsComprados: [],
          };
        }
        compradoresAgrupados[userId].ticketsComprados.push(ticket.numero);
      }
    });

    // 4. Converter o objeto em um array de compradores
    const listaCompradores = Object.values(compradoresAgrupados);

    return NextResponse.json({
      rifa: {
        id: rifaAtiva.id,
        titulo: rifaAtiva.titulo,
        // Adicione outros detalhes da rifa que você queira exibir
      },
      compradores: listaCompradores,
    });
  } catch (error) {
    console.error("Erro ao buscar compradores da rifa ativa:", error);
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}
