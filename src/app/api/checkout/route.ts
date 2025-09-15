import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { geradorDeNumeros } from "@/utils/geradorDeNumeros";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rifaId, quantidade, comprador } = body;

    if (!rifaId || !quantidade || !comprador || !comprador.email) {
      return NextResponse.json({ message: "Dados da requisição estão incompletos." }, { status: 400 });
    }

    const checkoutSessionId = randomUUID();

    const dadosParaPagamento = await prisma.$transaction(async (tx) => {
      const rifa = await tx.rifa.findUnique({ where: { id: rifaId } });
      if (!rifa) throw new Error("Rifa não encontrada.");

      const ticketsVendidos = await tx.ticket.count({
        where: { rifaId: rifa.id, NOT: { status: "disponivel" } },
      });

      if (ticketsVendidos + quantidade > rifa.totalNumeros) {
        throw new Error(`Apenas ${rifa.totalNumeros - ticketsVendidos} números disponíveis.`);
      }

      const usuario = await tx.usuario.upsert({
        where: { email: comprador.email },
        update: {
          nome: comprador.nome,
          sobrenome: comprador.sobrenome,
          cpf: comprador.cpf.replace(/\D/g, ""),
          telefone: comprador.telefone.replace(/\D/g, ""),
        },
        create: {
          nome: comprador.nome,
          sobrenome: comprador.sobrenome,
          email: comprador.email,
          cpf: comprador.cpf.replace(/\D/g, ""),
          telefone: comprador.telefone.replace(/\D/g, ""),
          senha: randomUUID(),
        },
      });

      const novosNumeros = await geradorDeNumeros(tx, quantidade, rifa.id);

      await tx.ticket.createMany({
        data: novosNumeros.map((numero) => ({
          numero,
          rifaId,
          status: "reservado",
          usuarioId: usuario.id,
          checkoutSessionId: checkoutSessionId,
        })),
      });

      const valorUnitario = quantidade >= 10 ? 3.79 : rifa.valorCota;
      const valorTotal = quantidade * valorUnitario;

      return { valorTotal, checkoutSessionId };
    });

    const apiUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
    const checkoutUrl = process.env.INFINITEPAY_CHECKOUT_URL;

    if (!checkoutUrl) {
      throw new Error("URL de checkout da InfinitePay não configurada no ambiente.");
    }

    return NextResponse.json(
      {
        checkoutUrl: checkoutUrl,
        redirectUrl: `${apiUrl}/cliente/status?session_id=${dadosParaPagamento.checkoutSessionId}`,
        priceInCents: Math.round(dadosParaPagamento.valorTotal * 100),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erro no Checkout:", error);
    return NextResponse.json({ message: error.message || "Falha ao reservar os números." }, { status: 500 });
  }
}
