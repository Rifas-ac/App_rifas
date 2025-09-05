import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { nome, email, senha, cpf, telefone } = body;

  if (!nome || !email || !senha || !cpf || !telefone) {
    return NextResponse.json({ error: "Dados incompletos" }, { status: 400 });
  }

  try {
    // Verifica se já existe usuário com o mesmo e-mail
    const existente = await prisma.usuario.findUnique({ where: { email } });
    if (existente) {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
    }

    const usuario = await prisma.usuario.create({
      data: { nome, email, senha, cpf, telefone },
    });

    return NextResponse.json({ success: true, usuario }, { status: 201 });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json({ error: "Erro ao cadastrar usuário" }, { status: 500 });
  }
}
