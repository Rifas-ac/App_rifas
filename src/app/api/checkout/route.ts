import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import { createPixCharge } from '@/lib/infinitypay';
import { geradorDeNumeros } from '@/utils/geradorDeNumeros';
import { randomUUID } from 'crypto';
import type { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { rifaId, quantidade, comprador } = body;

    // Validação dos dados de entrada
    if (!rifaId || !quantidade || !comprador || !comprador.email || !comprador.nome || !comprador.cpf) {
      return NextResponse.json({ message: 'Dados da rifa, quantidade ou comprador estão incompletos.' }, { status: 400 });
    }

    const externalReference = randomUUID();
    const PIX_EXPIRATION_SECONDS = 600; // 10 minutos para pagar o PIX

    // Transação com o banco de dados para garantir consistência
    const dadosParaPagamento = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const rifa = await tx.rifa.findUniqueOrThrow({ where: { id: rifaId } });
      const ticketsVendidos = await tx.ticket.count({ where: { rifaId: rifa.id, status: 'pago' } });

      if (ticketsVendidos + quantidade > rifa.totalNumeros) {
        throw new Error(`Não há números suficientes. Restam: ${rifa.totalNumeros - ticketsVendidos}`);
      }

      const usuario = await tx.usuario.upsert({
        where: { email: comprador.email },
        update: {
          nome: comprador.nome,
          sobrenome: comprador.sobrenome,
          cpf: comprador.cpf.replace(/\D/g, ''),
          telefone: comprador.telefone?.replace(/\D/g, '') || 'N/A',
        },
        create: {
          ...comprador,
          cpf: comprador.cpf.replace(/\D/g, ''),
          telefone: comprador.telefone?.replace(/\D/g, '') || 'N/A',
        },
      });

      const novosNumeros = await geradorDeNumeros(tx, quantidade, rifa.id);

      const ticketsParaCriar = novosNumeros.map((numero) => ({
        numero,
        rifaId,
        status: 'reservado',
        usuarioId: usuario.id,
        checkoutSessionId: externalReference, // Usamos o ID externo como referência
      }));

      await tx.ticket.createMany({ data: ticketsParaCriar });

      const valorTotal = quantidade * rifa.valorCota;
      return { valorTotal, usuario, rifa, externalReference };
    });

    // Criação da cobrança PIX na Infinity Pay
    const valorEmCentavos = Math.round(dadosParaPagamento.valorTotal * 100);

    const pixCharge = await createPixCharge({
      value: valorEmCentavos,
      payer: {
        name: `${dadosParaPagamento.usuario.nome} ${dadosParaPagamento.usuario.sobrenome || ''}`.trim(),
        document: dadosParaPagamento.usuario.cpf!.replace(/\D/g, ''),
      },
      external_id: dadosParaPagamento.externalReference,
      expires_in: PIX_EXPIRATION_SECONDS,
    });

    // Geração do QR Code em Base64 a partir do texto "copia e cola"
    const qrCodeBase64 = await QRCode.toDataURL(pixCharge.qr_code_text);

    return NextResponse.json(
      {
        qrCodeBase64,
        pixCopiaECola: pixCharge.qr_code_text,
        transactionId: dadosParaPagamento.externalReference,
        valorTotal: dadosParaPagamento.valorTotal,
        tempoExpiracao: PIX_EXPIRATION_SECONDS,
      },
      { status: 201 }
    );
  } catch (error: any) {
    const errorMessage = error.message || 'Erro desconhecido.';
    console.error('Erro Detalhado no Checkout:', error);
    return NextResponse.json({ message: `Falha ao criar cobrança PIX: ${errorMessage}` }, { status: 500 });
  }
}