import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Configuração para evitar problemas de prepared statements
const createPrismaClient = () => new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  datasources: {
    db: {
      url: process.env.DATABASE_URL + "?pgbouncer=true&connection_limit=1"
    }
  }
});

// Evita criar múltiplas instâncias do PrismaClient em ambiente de desenvolvimento
export const prisma =
  globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Função para desconectar explicitamente (útil em caso de problemas)
export const disconnectPrisma = async () => {
  await prisma.$disconnect();
};
