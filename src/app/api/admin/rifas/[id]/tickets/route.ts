import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// Instância do Prisma Client
const prisma = new PrismaClient();

// Interface para validar os dados recebidos
interface RifaData {
  titulo: string;
  descricao: string;
  preco: number;
  totalNumeros: number;
  dataFinal: string;
  imagem?: string;
  premio: string;
  regulamento?: string;
}

// Função para validar os dados
function validateRifaData(data: any): RifaData {
  const { titulo, descricao, preco, totalNumeros, dataFinal, imagem, premio, regulamento } = data;

  // Validações obrigatórias
  if (!titulo || typeof titulo !== "string") {
    throw new Error("Título é obrigatório e deve ser uma string");
  }

  if (!descricao || typeof descricao !== "string") {
    throw new Error("Descrição é obrigatória e deve ser uma string");
  }

  if (!premio || typeof premio !== "string") {
    throw new Error("Nome do prêmio é obrigatório e deve ser uma string");
  }

  if (!preco || isNaN(Number(preco))) {
    throw new Error("Preço é obrigatório e deve ser um número válido");
  }

  if (!totalNumeros || isNaN(Number(totalNumeros))) {
    throw new Error("Total de números é obrigatório e deve ser um número válido");
  }

  if (!dataFinal) {
    throw new Error("Data final é obrigatória");
  }

  // Validar se a data final é posterior à data atual
  const dataFinalDate = new Date(dataFinal);
  const now = new Date();

  if (dataFinalDate <= now) {
    throw new Error("Data final deve ser posterior à data atual");
  }

  return {
    titulo: titulo.trim(),
    descricao: descricao.trim(),
    preco: Number(preco),
    totalNumeros: Number(totalNumeros),
    dataFinal,
    imagem: imagem?.trim() || null,
    premio: premio.trim(),
    regulamento: regulamento?.trim() || null,
  };
}

// POST - Criar nova rifa
export async function POST(request: NextRequest) {
  try {
    // Ler dados do corpo da requisição
    const body = await request.json();

    // Validar dados
    const rifaData = validateRifaData(body);

    // Criar a rifa no banco de dados
    const novaRifa = await prisma.rifa.create({
      data: {
        titulo: rifaData.titulo,
        descricao: rifaData.descricao,
        preco: rifaData.preco,
        totalNumeros: rifaData.totalNumeros,
        dataFinal: new Date(rifaData.dataFinal),
        imagem: rifaData.imagem,
        premio: rifaData.premio,
        regulamento: rifaData.regulamento,
        status: "ativa", // Status padrão
        numerosVendidos: 0, // Iniciando com 0 números vendidos
      },
    });

    // Criar os números disponíveis para a rifa
    const numerosParaCriar = [];
    for (let i = 1; i <= rifaData.totalNumeros; i++) {
      numerosParaCriar.push({
        numero: i,
        rifaId: novaRifa.id,
        disponivel: true,
      });
    }

    // Inserir todos os números de uma vez (mais eficiente)
    await prisma.numero.createMany({
      data: numerosParaCriar,
    });

    return NextResponse.json(
      {
        message: "Rifa criada com sucesso!",
        rifa: novaRifa,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar rifa:", error);

    // Retornar erro específico se for de validação
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    // Erro genérico do servidor
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  } finally {
    // Fechar conexão com o banco
    await prisma.$disconnect();
  }
}

// GET - Listar todas as rifas (opcional, para uso futuro no admin)
export async function GET() {
  try {
    const rifas = await prisma.rifa.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            numeros: {
              where: {
                disponivel: false,
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ rifas }, { status: 200 });
  } catch (error) {
    console.error("Erro ao buscar rifas:", error);

    return NextResponse.json({ message: "Erro ao buscar rifas" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
