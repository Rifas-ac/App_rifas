import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/utils/validacoes";
import { criarCobrancaPix } from "@/lib/mercadopago";
import { gerarNumerosUnicos } from "@/utils/geradorDeNumeros";

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
    const { rifaId, quantidade, comprador } = body;

    // Validações
    if (!rifaId || !quantidade || quantidade < 1) {
      return NextResponse.json({ message: "Dados inválidos." }, { status: 400 });
    }

    const usuario = await prisma.usuario.findUnique({ where: { id: userId } });
    if (!usuario) {
      return NextResponse.json({ message: "Usuário não encontrado." }, { status: 404 });
    }

    // Busca a rifa
    const rifa = await prisma.rifa.findUnique({
      where: { id: Number(rifaId) },
      include: { tickets: true },
    });

    if (!rifa) {
      return NextResponse.json({ message: "Rifa não encontrada." }, { status: 404 });
    }

    if (rifa.status !== "ativa") {
      return NextResponse.json({ message: "Esta rifa não está mais ativa." }, { status: 400 });
    }

    // Verifica números disponíveis
    const numerosOcupados = rifa.tickets
      .filter((t) => t.status === "pago" || t.status === "reservado")
      .map((t) => parseInt(t.numero));

    const numerosDisponiveis = [];
    for (let i = 1; i <= rifa.totalNumeros; i++) {
      if (!numerosOcupados.includes(i)) {
        numerosDisponiveis.push(i);
      }
    }

    if (numerosDisponiveis.length < quantidade) {
      return NextResponse.json(
        { message: `Apenas ${numerosDisponiveis.length} números disponíveis.` },
        { status: 400 }
      );
    }

    // Calcula valor total
    const valorUnitario = quantidade >= 10 ? 3.79 : rifa.valorCota;
    const valorTotal = quantidade * valorUnitario;

    // Cria cobrança PIX no Mercado Pago
    const externalReference = `rifa-${rifaId}-usuario-${userId}-${Date.now()}`;
    const descricao = `Rifa: ${rifa.titulo} - ${quantidade} número(s)`;

    const pixData = await criarCobrancaPix(usuario, valorTotal, descricao, externalReference);

    // IMPORTANTE: NÃO cria os tickets aqui
    // Os tickets serão criados apenas APÓS a confirmação do pagamento via webhook

    // Salva temporariamente os dados da compra para processar depois
    // Aqui você pode usar o externalReference para identificar a compra no webhook

    // Retorna os dados do PIX SEM os números
    return NextResponse.json({
      qrCodeBase64: pixData.qrCodeBase64,
      pixCopiaECola: pixData.pixCopiaECola,
      transactionId: pixData.paymentId,
      valorTotal: pixData.valorTotal,
      tempoExpiracao: pixData.tempoExpiracao,
      // NÃO retorna números aqui - serão gerados após pagamento
      quantidade: quantidade, // Apenas para referência
      rifaId: rifaId,
    });
  } catch (error: any) {
    console.error("Erro no checkout:", error);
    return NextResponse.json(
      { message: error.message || "Erro no checkout." },
      { status: 500 }
    );
  }
}
