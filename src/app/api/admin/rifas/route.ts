import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rifas = await prisma.rifa.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        tickets: true,
      },
    });
    return NextResponse.json(rifas);
  } catch (error) {
    console.error("Erro ao buscar rifas:", error);
    return NextResponse.json({ error: "Erro ao buscar rifas" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const { titulo, descricao, imagemUrl, premio, valorCota, dataSorteio, totalNumeros } = body;

  try {
    const rifa = await prisma.rifa.create({
      data: {
        titulo,
        descricao,
        imagemUrl,
        premio,
        valorCota,
        totalNumeros,
        dataSorteio: dataSorteio ? new Date(dataSorteio) : null,
      },
    });

    const numerosParaCriar = [];
    for (let i = 1; i <= totalNumeros; i++) {
      numerosParaCriar.push({
        numero: i.toString(),
        rifaId: rifa.id,
        status: "disponivel",
      });
    }

    await prisma.ticket.createMany({
      data: numerosParaCriar,
    });

    return NextResponse.json(rifa, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar rifa:", error);
    return NextResponse.json({ error: "Erro ao criar rifa" }, { status: 500 });
  }
}
