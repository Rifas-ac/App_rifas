import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

/**
 * Endpoint para buscar a rifa que está atualmente ativa.
 */
export async function GET() {
  // Criar uma nova instância para evitar problemas de cache
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL + "?pgbouncer=true&connection_limit=1"
      }
    }
  });
  
  try {
    // Usar SQL direto para evitar prepared statements
    const rifas = await prisma.$queryRaw`
      SELECT * FROM "Rifa" WHERE status = 'ativa' LIMIT 1
    `;
    
    if (!rifas || (rifas as any[]).length === 0) {
      await prisma.$disconnect();
      return NextResponse.json({ message: "Nenhuma rifa ativa encontrada." }, { status: 404 });
    }
    
    const rifaAtiva = (rifas as any[])[0];
    
    // Buscar tickets separadamente
    const tickets = await prisma.$queryRaw`
      SELECT * FROM "Ticket" WHERE "rifaId" = ${rifaAtiva.id} ORDER BY numero ASC
    `;
    
    rifaAtiva.tickets = tickets;

    // Se encontrou, retorna os dados da rifa com status 200 OK
    await prisma.$disconnect();
    return NextResponse.json(rifaAtiva, { status: 200 });
  } catch (error) {
    console.error("Falha ao buscar rifa ativa:", error);
    await prisma.$disconnect();
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}
