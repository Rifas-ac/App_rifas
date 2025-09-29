import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Função utilitária para pegar o ID do usuário autenticado
function getUserIdFromRequest(req: NextRequest): number | null {
  const userId = req.cookies.get("userId")?.value;
  return userId ? Number(userId) : null;
}

export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }
  const usuario = await prisma.usuario.findUnique({ where: { id: userId } });
  if (!usuario) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }
  return NextResponse.json(usuario);
}
