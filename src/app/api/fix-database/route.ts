import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    // Adicionar campo paymentId na tabela Ticket se não existir
    await prisma.$executeRaw`
      ALTER TABLE "Ticket" ADD COLUMN IF NOT EXISTS "paymentId" TEXT;
    `;

    // Adicionar campo asaasCustomerId na tabela Usuario se não existir  
    await prisma.$executeRaw`
      ALTER TABLE "Usuario" ADD COLUMN IF NOT EXISTS "asaasCustomerId" TEXT;
    `;

    // Verificar se existe rifa ativa
    const rifaAtiva = await prisma.rifa.findFirst({
      where: { status: "ativa" }
    });

    // Se não existe, criar uma rifa de teste
    if (!rifaAtiva) {
      await prisma.rifa.create({
        data: {
          titulo: "Rifa Teste - iPhone 15",
          descricao: "Rifa para testar a integração com Asaas",
          premio: "iPhone 15 Pro Max 256GB",
          valorCota: 5.0,
          totalNumeros: 100,
          status: "ativa",
          imagemUrl: "/rifa-gol/gol-1.png"
        }
      });
    }

    return NextResponse.json({ 
      success: true,
      message: "Banco atualizado com sucesso! Campos adicionados e rifa ativa criada."
    });

  } catch (error: any) {
    console.error("Erro ao corrigir banco:", error);
    return NextResponse.json({ 
      success: false,
      message: "Erro ao atualizar banco: " + error.message 
    }, { status: 500 });
  }
}