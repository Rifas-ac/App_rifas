import { PrismaClient } from '@prisma/client';

// Inicializa o cliente do Prisma
const prisma = new PrismaClient();
async function main() {
  console.log('Iniciando o processo de seeding...');

  // 1. Limpa os dados antigos para evitar duplicatas ao rodar o seed várias vezes
  await prisma.ticket.deleteMany({});
  await prisma.rifa.deleteMany({});
  console.log('Banco de dados limpo.');

  // 2. Cria uma Rifa de exemplo
  const rifaExemplo = await prisma.rifa.create({
    data: {
      titulo: 'Prêmio Especial de Lançamento!',
      descricao: 'Concorra a um incrível kit de desenvolvimento com teclado mecânico, mouse e um monitor ultrawide.',
      premio: 'Kit Dev Completo',
      valorCota: 10.5,
      totalNumeros: 100,
      status: 'ativa',
      imagemUrl: '/images/premio-exemplo.jpg'
    }
  });
  console.log(`Rifa de exemplo criada: ${rifaExemplo.titulo} (ID: ${rifaExemplo.id})`);

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Fecha a conexão com o banco de dados
    await prisma.$disconnect();
  });
