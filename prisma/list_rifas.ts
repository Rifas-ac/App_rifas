
// prisma/list_rifas.ts
import { PrismaClient } from '@prisma/client';

const databaseUrl = process.argv[2];

if (!databaseUrl) {
  console.error('Please provide the DATABASE_URL as a command line argument.');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

async function main() {
  const rifas = await prisma.rifa.findMany();
  console.log(rifas);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
