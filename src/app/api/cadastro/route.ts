import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, sobrenome, email: rawEmail, cpf, telefone, senha } = body;

    const email = rawEmail.trim().toLowerCase();

    if (!nome || !email || !senha || !cpf || !telefone) {
      return NextResponse.json({ error: "Todos os campos obrigatórios devem ser preenchidos." }, { status: 400 });
    }

    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "E-mail já cadastrado" }, { status: 409 });
    }

    const existingCpf = await prisma.usuario.findUnique({
      where: { cpf },
    });

    if (existingCpf) {
      return NextResponse.json({ error: "CPF já cadastrado" }, { status: 409 });
    }

    const existingTelefone = await prisma.usuario.findFirst({
      where: { telefone: telefone.toString() },
    });

    if (existingTelefone) {
      return NextResponse.json({ error: "Telefone já cadastrado" }, { status: 409 });
    }

    const newUser = await prisma.usuario.create({
      data: {
        nome,
        sobrenome,
        email,
        cpf,
        telefone,
        senha, // ATENÇÃO: Em uma aplicação real, essa senha deve ser criptografada!
      },
    });

    return NextResponse.json(
      { success: true, user: { id: newUser.id, nome: newUser.nome, email: newUser.email } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
