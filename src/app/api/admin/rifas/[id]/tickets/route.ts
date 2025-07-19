// Criar a API Route GET /api/admin/rifas/:id/tickets para listar os tickets pagos de uma rifa.

import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rifaId = parseInt(id, 10);
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
