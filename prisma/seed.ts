import { PrismaClient } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Verifica se já existem rifas
  const existingRifas = await prisma.rifa.findMany();
  if (existingRifas.length > 0) {
    console.log("✅ Rifas já existem no banco. Seed não executado para evitar duplicatas.");
    console.log(`   Total de rifas: ${existingRifas.length}`);
    existingRifas.forEach(r => console.log(`   - ${r.titulo} (${r.status})`));
    return;
  }

  console.log("📦 Criando rifas...");

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
  console.log(`✅ Rifa criada: ${rifaGol.titulo} (ID: ${rifaGol.id})`);

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
  console.log(`✅ Rifa criada: ${rifaChevette.titulo} (ID: ${rifaChevette.id})`);

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log(`   Total de rifas criadas: 2`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Fecha a conexão com o banco de dados
    await prisma.$disconnect();
  });