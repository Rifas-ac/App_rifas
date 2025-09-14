import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userEmail = searchParams.get("email");

  if (!userEmail) {
    return NextResponse.json({ error: "Email do usuário não fornecido" }, { status: 400 });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email: userEmail },
      select: {
        nome: true,
        // Inclua outros campos que você deseja retornar para o cliente
      },
    });

    if (!usuario) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    return NextResponse.json({ error: "Erro interno ao buscar dados do usuário" }, { status: 500 });
  }
}
