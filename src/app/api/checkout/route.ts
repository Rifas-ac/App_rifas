import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/utils/validacoes";

// Função utilitária para pegar o ID do usuário autenticado
function getUserIdFromRequest(req: NextRequest): number | null {
  const userId = req.cookies.get("userId")?.value;
  return userId ? Number(userId) : null;
}

export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
    }

    const body = await req.json();
    const { rifaId, quantidade } = checkoutSchema.parse(body);

    const usuario = await prisma.usuario.findUnique({ where: { id: userId } });
    if (!usuario) {
      return NextResponse.json({ message: "Usuário não encontrado." }, { status: 404 });
    }

    // Exemplo de uso do CPF (garante string)
    const cpf = usuario.cpf ?? "";

    // Aqui você pode continuar com a lógica do checkout, por exemplo:
    // - Buscar a rifa
    // - Criar cobrança
    // - Criar tickets
    // - Etc.

    // Exemplo de resposta de sucesso
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro no checkout." }, { status: 500 });
  }
}
