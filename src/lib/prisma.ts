import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Evita criar múltiplas instâncias do PrismaClient em ambiente de desenvolvimento
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Opcional: mostra as queries no console
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
