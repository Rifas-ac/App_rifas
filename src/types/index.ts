// Tipos compartilhados da aplicação

import { PrismaClient } from "@prisma/client";

// Inferir tipos do Prisma Client
type PrismaClientType = InstanceType<typeof PrismaClient>;
type PrismaModels = PrismaClientType extends { rifa: { findMany: () => Promise<infer T> } } ? T extends Array<infer U> ? U : never : never;
type PrismaUsuarios = PrismaClientType extends { usuario: { findMany: () => Promise<infer T> } } ? T extends Array<infer U> ? U : never : never;
type PrismaTickets = PrismaClientType extends { ticket: { findMany: () => Promise<infer T> } } ? T extends Array<infer U> ? U : never : never;

// Exportar tipos do Prisma
export type Rifa = PrismaModels;
export type Usuario = PrismaUsuarios;
export type Ticket = PrismaTickets;

// Tipos estendidos
export type RifaComTickets = Rifa & { tickets: Ticket[] };

export interface DadosCheckout {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  cpf: string;
}

export interface PixData {
  qrCodeBase64: string;
  pixCopiaECola: string;
  transactionId: string;
  valorTotal: number;
  tempoExpiracao: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
