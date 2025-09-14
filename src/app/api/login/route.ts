import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, senha } = body;

    if (!email || !senha) {
      return NextResponse.json({ error: "E-mail e senha são obrigatórios." }, { status: 400 });
    }

    const user = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: "email" }, { status: 404 }); // Usuário não encontrado
    }

    // ATENÇÃO: Em uma aplicação real, aqui você compararia senhas criptografadas
    if (user.senha !== senha) {
      return NextResponse.json({ error: "senha" }, { status: 401 }); // Senha incorreta
    }

    return NextResponse.json({ success: true, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
