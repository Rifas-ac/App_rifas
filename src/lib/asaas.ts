import { prisma } from "@/lib/prisma";
import { Usuario } from "@prisma/client";
import axios from "axios";

// Instância do Axios para a API da Asaas
const asaasAPI = axios.create({
  baseURL: process.env.ASAAS_API_URL || "https://api.asaas.com/v3",
  headers: {
    "Content-Type": "application/json",
    access_token: process.env.ASAAS_API_KEY,
  },
});

/**
 * Encontra um cliente na Asaas pelo CPF ou o cria se não existir.
 * @param usuario - O objeto de usuário do seu banco de dados.
 * @returns O ID do cliente na Asaas.
 */
export const findOrCreateCustomer = async (usuario: Usuario): Promise<string> => {
  try {
    // 1. Se o usuário já tem um ID da Asaas, retorna ele
    if (usuario.asaasCustomerId) {
      return usuario.asaasCustomerId;
    }

    // 2. Tenta encontrar o cliente na Asaas pelo CPF
    const { data: existingCustomers } = await asaasAPI.get(`/customers?cpfCnpj=${usuario.cpf}`);

    if (existingCustomers.data && existingCustomers.data.length > 0) {
      const customerId = existingCustomers.data[0].id;
      // Atualiza o usuário no seu banco com o ID encontrado para futuras consultas
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: { asaasCustomerId: customerId },
      });
      return customerId;
    }

    // 3. Se não encontrou, cria um novo cliente
    const { data: newCustomer } = await asaasAPI.post("/customers", {
      name: `${usuario.nome} ${usuario.sobrenome}`,
      email: usuario.email,
      phone: usuario.telefone.replace(/\D/g, ""),
      cpfCnpj: usuario.cpf,
    });

    const newCustomerId = newCustomer.id;
    // Atualiza o usuário no seu banco com o novo ID
    await prisma.usuario.update({
      where: { id: usuario.id },
      data: { asaasCustomerId: newCustomerId },
    });

    return newCustomerId;
  } catch (error: any) {
    console.error("Erro ao buscar ou criar cliente na Asaas:", error.response?.data || error.message);
    throw new Error("Falha na comunicação com o provedor de pagamento para gerenciar clientes.");
  }
};

/**
 * Cria uma nova cobrança PIX na Asaas.
 * @param customerId - O ID do cliente na Asaas.
 * @param value - O valor da cobrança.
 * @param description - A descrição da cobrança.
 * @returns Os dados da cobrança PIX gerada.
 */
export const createPixCharge = async (customerId: string, value: number, description: string) => {
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1); // Vencimento para amanhã

    const { data: payment } = await asaasAPI.post("/payments", {
      customer: customerId,
      billingType: "PIX",
      value,
      dueDate: dueDate.toISOString().split("T")[0],
      description,
    });

    // Após criar a cobrança, busca o QR Code
    const { data: qrCodeData } = await asaasAPI.get(`/payments/${payment.id}/pixQrCode`);

    return {
      paymentId: payment.id,
      ...qrCodeData,
    };
  } catch (error: any) {
    console.error("Erro ao criar cobrança PIX na Asaas:", error.response?.data || error.message);
    throw new Error("Falha ao gerar a cobrança PIX.");
  }
};