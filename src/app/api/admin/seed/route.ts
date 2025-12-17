import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Rota para popular o banco de dados com as rifas iniciais
 * Acesse: /api/admin/seed
 */
export async function GET(request: Request) {
  try {
    // Verificar senha de admin (segurança básica)
    const { searchParams } = new URL(request.url);
    const senha = searchParams.get('senha');

    if (senha !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Senha de admin inválida" },
        { status: 401 }
      );
    }

    console.log('🌱 Iniciando seed do banco de dados...');

    // Verifica se já existem rifas
    const existingRifas = await prisma.rifa.findMany();
    if (existingRifas.length > 0) {
      return NextResponse.json({
        message: "Rifas já existem no banco",
        rifas: existingRifas.map(r => ({
          id: r.id,
          titulo: r.titulo,
          status: r.status
        }))
      });
    }

    console.log('📦 Criando rifas...');

    // Rifa 1: Gol LS 1986 (ATIVA)
    const rifaGol = await prisma.rifa.create({
      data: {
        titulo: "Gol LS 1986",
        descricao: "Clássico dos anos 80 em excelente estado de conservação. Motor 1.6, álcool, com todos os documentos em dia.",
        premio: "Volkswagen Gol LS 1986",
        valorCota: 5.0,
        totalNumeros: 100000,
        status: "ativa",
        imagemUrl: "/rifa-gol/gol-0.png",
      },
    });

    // Rifa 2: Chevette DL 92 (EM BREVE)
    const rifaChevette = await prisma.rifa.create({
      data: {
        titulo: "Chevette DL 92",
        descricao: "Chevrolet Chevette DL 1992, completo, ar condicionado, direção hidráulica. Um verdadeiro clássico!",
        premio: "Chevrolet Chevette DL 1992",
        valorCota: 5.0,
        totalNumeros: 100000,
        status: "em_breve",
        imagemUrl: "/rifa-Chevete/Chevete-01.jpg",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Rifas criadas com sucesso!",
      rifas: [
        { id: rifaGol.id, titulo: rifaGol.titulo, status: rifaGol.status },
        { id: rifaChevette.id, titulo: rifaChevette.titulo, status: rifaChevette.status }
      ]
    });

  } catch (error) {
    console.error('Erro ao executar seed:', error);
    return NextResponse.json(
      { error: "Erro ao criar rifas", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
