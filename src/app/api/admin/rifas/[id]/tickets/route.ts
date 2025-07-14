// Criar a API Route GET /api/admin/rifas/:id/tickets para listar os tickets pagos de uma rifa.

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const rifaId = parseInt(id, 10);

  try {
    const tickets = await prisma.ticket.findMany({
      where: { rifaId: rifaId, status: 'pago' },
      include: { usuario: true }
    });

    if (tickets.length === 0) {
      return NextResponse.json({ message: 'Nenhum ticket encontrado para esta rifa.' }, { status: 404 });
    }

    return NextResponse.json(tickets, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    return NextResponse.json({ error: 'Erro ao buscar tickets' }, { status: 500 });
  }
}
