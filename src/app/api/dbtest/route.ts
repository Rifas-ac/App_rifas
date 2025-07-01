import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const result: any = await prisma.$queryRaw`SELECT NOW()`;
    // Se a consulta for bem-sucedida, o resultado será um array.
    // Ex: [ { now: 2025-07-01T14:34:08.123Z } ]
    const currentTimeFromDb = result[0]?.now;

    return NextResponse.json(
      {
        status: "ok",
        message: "Conexão com o banco de dados PostgreSQL bem-sucedida!",
        databaseTime: currentTimeFromDb,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Falha na conexão com o banco de dados:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Não foi possível conectar ao banco de dados.",
        errorDetails: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
