import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createPixCharge } from '@/lib/infinitypay';
import QRCode from 'qrcode';
import { z } from 'zod';
import { geradorDeNumeros } from '@/utils/geradorDeNumeros';
import { randomUUID } from 'crypto';

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
    const PIX_EXPIRATION_SECONDS = 600; // 10 minutos

    const charge = await createPixCharge({
      value: Math.round(valorTotal * 100), // in cents
      customer: {
        name: `${comprador.nome} ${comprador.sobrenome || ''}`.trim(),
        email: comprador.email,
        tax_id: comprador.cpf.replace(/\D/g, ''),
      },
      description: `Pagamento de ${quantidade} cota(s) da rifa "${rifa.titulo}"`,
      payment_method: 'pix',
      expires_in: PIX_EXPIRATION_SECONDS,
    });

    await prisma.$transaction(async (tx) => {
      const usuario = await tx.usuario.upsert({
        where: { email: comprador.email },
        update: {
          nome: comprador.nome,
          sobrenome: comprador.sobrenome,
          cpf: comprador.cpf.replace(/\D/g, ''),
          telefone: comprador.telefone.replace(/\D/g, ''),
        },
        create: {
          nome: comprador.nome,
          sobrenome: comprador.sobrenome || '',
          email: comprador.email,
          cpf: comprador.cpf.replace(/\D/g, ''),
          telefone: comprador.telefone.replace(/\D/g, ''),
          senha: randomUUID(), // This is not secure, but it's what's in the code
        },
      });

      const novosNumeros = await geradorDeNumeros(tx, quantidade, rifa.id);

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
        pixCopiaECola: charge.pix_code,
        transactionId: charge.id,
        valorTotal: valorTotal,
        tempoExpiracao: PIX_EXPIRATION_SECONDS,
    }, { status: 201 });

  } catch (error) {
    console.error('Erro no checkout:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Dados inválidos.', issues: error.issues }, { status: 400 });
    }
    if (error instanceof Error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
  }
}
