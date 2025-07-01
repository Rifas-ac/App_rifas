import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
    return NextResponse.json(rifa, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar rifa:", error);
    return NextResponse.json({ error: "Erro ao criar rifa" }, { status: 500 });
  }
}
