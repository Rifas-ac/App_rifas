const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkRifas() {
  try {
    const rifas = await prisma.rifa.findMany();
    console.log('\n=== RIFAS NO BANCO ===');
    console.log(`Total: ${rifas.length}\n`);

    if (rifas.length === 0) {
      console.log('⚠️ NENHUMA RIFA ENCONTRADA!');
      console.log('Execute: npm run seed\n');
    } else {
      rifas.forEach(rifa => {
        console.log(`📋 ${rifa.titulo}`);
        console.log(`   ID: ${rifa.id}`);
        console.log(`   Status: ${rifa.status}`);
        console.log(`   Imagem: ${rifa.imagemUrl}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRifas();
