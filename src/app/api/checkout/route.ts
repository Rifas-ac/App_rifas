import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { randomUUID } from "crypto";
import { geradorDeNumeros } from "@/utils/geradorDeNumeros";
import type { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! });
  const preference = new Preference(client);

  try {
    const body = await request.json();
    const { rifaId, quantidade, comprador, paymentData } = body;

    if (!rifaId || !quantidade || !comprador) {
      return NextResponse.json({ message: "Dados da rifa, quantidade ou comprador estão incompletos." }, { status: 400 });
    }

    const externalReference = randomUUID();

    const dadosParaPagamento = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const rifa = await tx.rifa.findUniqueOrThrow({ where: { id: rifaId } });
      const ticketsVendidos = await tx.ticket.count({ where: { rifaId: rifa.id } });

      if (ticketsVendidos + quantidade > rifa.totalNumeros) {
        throw new Error(`Não há números suficientes. Restam: ${rifa.totalNumeros - ticketsVendidos}`);
      }

      const usuario = await tx.usuario.upsert({
        where: { email: comprador.email },
        update: {
          nome: comprador.nome,
          sobrenome: comprador.sobrenome,
          cpf: comprador.cpf,
          telefone: comprador.telefone || "N/A",
        },
        create: { ...comprador, telefone: comprador.telefone || "N/A" },
      });

      const novosNumeros = await geradorDeNumeros(tx, quantidade, rifa.id);

      const ticketsParaCriar = novosNumeros.map((numero) => ({
        numero,
        rifaId,
        status: "reservado",
        usuarioId: usuario.id,
        checkoutSessionId: externalReference,
      }));

      await tx.ticket.createMany({ data: ticketsParaCriar });

      const valorTotal = quantidade * rifa.valorCota;
      return { valorTotal, usuario, rifa, externalReference };
    });

    const notification_url = `${process.env.NEXT_PUBLIC_API_URL}/api/webhook/payment`;
    const success_url = `${process.env.NEXT_PUBLIC_API_URL}/cliente/status?payment_status=success&external_reference=${dadosParaPagamento.externalReference}`;
    const pending_url = `${process.env.NEXT_PUBLIC_API_URL}/cliente/status?payment_status=pending&external_reference=${dadosParaPagamento.externalReference}`;
    const failure_url = `${process.env.NEXT_PUBLIC_API_URL}/cliente/status?payment_status=failure&external_reference=${dadosParaPagamento.externalReference}`;

    const preferenceBody: any = {
      items: [
        {
          id: String(dadosParaPagamento.rifa.id),
          title: `${quantidade} ticket(s) para a rifa: ${dadosParaPagamento.rifa.titulo}`,
          quantity: 1,
          unit_price: Number(dadosParaPagamento.valorTotal.toFixed(2)),
          currency_id: "BRL",
        },
      ],
      payer: {
        email: dadosParaPagamento.usuario.email,
        name: dadosParaPagamento.usuario.nome,
        surname: dadosParaPagamento.usuario.sobrenome,
        identification: {
          type: "CPF",
          number: dadosParaPagamento.usuario.cpf,
        },
      },
      back_urls: {
        success: success_url,
        pending: pending_url,
        failure: failure_url,
      },
      notification_url: notification_url,
      external_reference: dadosParaPagamento.externalReference,
      auto_return: "approved" as const,
    };

    // If paymentData is provided, it means we are trying to process a direct payment (e.g., credit card)
    // However, Mercado Pago Preference API is primarily for generating a checkout link.
    // For direct payments, you would typically use the Payment API.
    // Given the current setup, we will stick to Preference and assume paymentData is for future expansion
    // or if the user intends to use a custom checkout flow that still redirects to MP.
    // For now, paymentData will be ignored for Preference creation.

    const result = await preference.create({ body: preferenceBody });

    return NextResponse.json(
      {
        init_point: result.init_point,
      },
      { status: 201 }
    );
  } catch (error: any) {
    const errorMessage = error.cause?.message || error.message || "Erro desconhecido.";
    console.error("Erro Detalhado no Checkout:", JSON.stringify(error, null, 2));
    return NextResponse.json({ message: `Falha ao criar pagamento: ${errorMessage}` }, { status: 500 });
  }
}