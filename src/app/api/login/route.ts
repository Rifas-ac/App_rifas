import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, senha } = body;

  if (!email || !senha) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario) {
      return NextResponse.json({ error: "email" }, { status: 404 });
    }

    if (usuario.senha !== senha) {
      return NextResponse.json({ error: "senha" }, { status: 401 });
    }

    return NextResponse.json({ success: true, usuario }, { status: 200 });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return NextResponse.json({ error: "Erro ao fazer login" }, { status: 500 });
  }
}