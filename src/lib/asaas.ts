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
 * Cria uma nova cobrança na Asaas com redirecionamento.
 * @param customerId - O ID do cliente na Asaas.
 * @param value - O valor da cobrança.
 * @param description - A descrição da cobrança.
 * @returns Os dados da cobrança incluindo URL de pagamento.
 */
export const createCharge = async (customerId: string, value: number, description: string) => {
  try {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // Vencimento em 7 dias

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Primeiro cria a cobrança
    const { data: payment } = await asaasAPI.post("/payments", {
      customer: customerId,
      billingType: "UNDEFINED", // Permite PIX, boleto, cartão na tela do Asaas
      value,
      dueDate: dueDate.toISOString().split("T")[0],
      description,
    });

    // Agora atualiza com a URL de sucesso usando o ID do pagamento
    await asaasAPI.put(`/payments/${payment.id}`, {
      callback: {
        successUrl: `${siteUrl}/payment/success?payment_id=${payment.id}`,
        autoRedirect: true,
      },
    });

    return {
      paymentId: payment.id,
      paymentUrl: `https://www.asaas.com/c/${payment.id}`,
      invoiceUrl: payment.invoiceUrl,
    };
  } catch (error: any) {
    console.error("Erro ao criar cobrança na Asaas:", error.response?.data || error.message);
    throw new Error("Falha ao gerar a cobrança.");
  }
};