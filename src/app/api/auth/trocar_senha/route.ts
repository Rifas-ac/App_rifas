import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, codigo, novaSenha } = await req.json();

  // Busca usuário e valida código e expiração
  const user = await prisma.usuario.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      senha: true,
      resetCode: true,
      resetCodeExpires: true,
      nome: true,
      sobrenome: true,
      cpf: true,
      telefone: true,
      createdAt: true,
    },
  });

  if (!user || user.resetCode !== codigo || !user.resetCodeExpires || new Date(user.resetCodeExpires) < new Date()) {
    return NextResponse.json({ error: "Código inválido ou expirado." }, { status: 400 });
  }

  // Atualiza senha e remove código de reset
  const senhaHash = await bcrypt.hash(novaSenha, 10);
  await prisma.usuario.update({
    where: { email },
    data: {
      senha: senhaHash,
      resetCode: null,
      resetCodeExpires: null,
    },
  });

  return NextResponse.json({ ok: true });
}
