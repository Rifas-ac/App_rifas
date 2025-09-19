import { NextResponse } from 'next/server';
<<<<<<< HEAD
import QRCode from 'qrcode';
import { prisma } from '@/lib/prisma';
import { createPixCharge } from '@/lib/infinitypay';
import { geradorDeNumeros } from '@/utils/geradorDeNumeros';
import { randomUUID } from 'crypto';
import type { Prisma } from '@prisma/client';
=======
import { prisma } from '@/lib/prisma';
import { createPixCharge } from '@/lib/infinitypay';
import QRCode from 'qrcode';
import { z } from 'zod';
import { geradorDeNumeros } from '@/utils/geradorDeNumeros';
import { randomUUID } from 'crypto';
>>>>>>> d186b7e547e797ff290bc8344754e5eaa5f12237

const checkoutSchema = z.object({
  rifaId: z.number(),
  quantidade: z.number().min(1),
  comprador: z.object({
    nome: z.string(),
    sobrenome: z.string().optional(),
    email: z.string().email(),
    telefone: z.string(),
    cpf: z.string(),
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { rifaId, quantidade, comprador } = checkoutSchema.parse(body);

<<<<<<< HEAD
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
=======
    const rifa = await prisma.rifa.findUnique({ where: { id: rifaId } });
    if (!rifa) {
      throw new Error('Rifa não encontrada.');
    }

    const ticketsVendidos = await prisma.ticket.count({
      where: { rifaId: rifa.id, NOT: { status: 'disponivel' } },
    });

    if (ticketsVendidos + quantidade > rifa.totalNumeros) {
      throw new Error(`Apenas ${rifa.totalNumeros - ticketsVendidos} números disponíveis.`);
    }

    const valorUnitario = quantidade >= 10 ? 3.79 : rifa.valorCota;
    const valorTotal = quantidade * valorUnitario;

    const charge = await createPixCharge({
      value: Math.round(valorTotal * 100), // in cents
      customer: {
        name: `${comprador.nome} ${comprador.sobrenome || ''}`,
        email: comprador.email,
        tax_id: comprador.cpf.replace(/\D/g, ''),
      },
      description: `Pagamento de ${quantidade} cota(s) da rifa "${rifa.titulo}"`,
      payment_method: 'pix',
      expires_in: 3600, // 1 hour
    });
>>>>>>> d186b7e547e797ff290bc8344754e5eaa5f12237

    await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.upsert({
        where: { email: comprador.email },
        update: {
          nome: comprador.nome,
          sobrenome: comprador.sobrenome,
          cpf: comprador.cpf.replace(/\D/g, ''),
<<<<<<< HEAD
          telefone: comprador.telefone?.replace(/\D/g, '') || 'N/A',
        },
        create: {
          ...comprador,
          cpf: comprador.cpf.replace(/\D/g, ''),
          telefone: comprador.telefone?.replace(/\D/g, '') || 'N/A',
=======
          telefone: comprador.telefone.replace(/\D/g, ''),
        },
        create: {
          nome: comprador.nome,
          sobrenome: comprador.sobrenome,
          email: comprador.email,
          cpf: comprador.cpf.replace(/\D/g, ''),
          telefone: comprador.telefone.replace(/\D/g, ''),
          senha: randomUUID(),
>>>>>>> d186b7e547e797ff290bc8344754e5eaa5f12237
        },
      });

      const novosNumeros = await geradorDeNumeros(tx, quantidade, rifa.id);

<<<<<<< HEAD
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
=======
      await tx.ticket.createMany({
        data: novosNumeros.map((numero) => ({
          numero,
          rifaId,
          status: 'reservado',
          usuarioId: usuario.id,
          checkoutSessionId: charge.id,
        })),
      });
    });

    const qrCodeBase64 = await QRCode.toDataURL(charge.pix_code);

    return NextResponse.json({
      qrCodeBase64,
      pixCode: charge.pix_code,
      expiresAt: charge.expires_at,
    });

  } catch (error) {
    console.error('Erro no checkout:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Dados inválidos.', issues: error.issues }, { status: 400 });
    }
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
>>>>>>> d186b7e547e797ff290bc8344754e5eaa5f12237
  }
}