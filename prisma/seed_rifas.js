/**
 * Script para adicionar rifas de exemplo
 * Execute: node prisma/seed_rifas.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando banco de dados com rifas...\n');

  // Rifa 1 - Gol (Ativa)
  const rifaGol = await prisma.rifa.create({
    data: {
      titulo: 'Gol LS 1986',
      descricao: 'Um clássico restaurado! Gol quadrado LS 1986 em perfeito estado, motor 1.6, documentação em dia.',
      premio: 'Gol LS 1986 Restaurado',
      imagemUrl: '/rifa-gol/gol-0.png',
      valorCota: 10.00,
      totalNumeros: 1000,
      status: 'ativa',
      dataSorteio: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 dias
    },
  });

  console.log('✅ Rifa criada:', rifaGol.titulo);

  // Rifa 2 - Chevette DL 92 (Em Breve)
  const rifaChevette = await prisma.rifa.create({
    data: {
      titulo: 'Chevette DL 92',
      descricao: 'Chevrolet Chevette DL 1992, clássico brasileiro, motor 1.6, conservado, pronto para rodar.',
      premio: 'Chevette DL 1992',
      imagemUrl: '/rifa-Chevete/Chevete-01.jpg',
      valorCota: 15.00,
      totalNumeros: 1500,
      status: 'em_breve',
      dataSorteio: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // Daqui 45 dias
    },
  });

  console.log('✅ Rifa criada:', rifaChevette.titulo);

  console.log('\n🎉 Banco de dados populado com sucesso!\n');
  console.log('📋 Rifas disponíveis:');
  console.log(`  - ${rifaGol.titulo} (ATIVA - Sorteio em Andamento)`);
  console.log(`  - ${rifaChevette.titulo} (EM BREVE)`);
}

main()
  .catch((e) => {
    console.error('❌ Erro ao popular banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
