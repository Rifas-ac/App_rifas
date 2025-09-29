import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body.email.trim().toLowerCase();
    const senha = body.senha; // Se quiser, pode usar .trim() também

    // Procure o usuário normalizando o e-mail
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return NextResponse.json({ message: "Credenciais inválidas." }, { status: 401 });
    }

    // Compare a senha normalmente (ou com hash, se usar hash)
    if (usuario.senha !== senha) {
      return NextResponse.json({ message: "Credenciais inválidas." }, { status: 401 });
    }

    return NextResponse.json({ message: "Login realizado com sucesso!" });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
