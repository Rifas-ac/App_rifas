import { MercadoPagoConfig, Payment } from "mercadopago";
import type { Usuario } from "@/types";

// Configuração do cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
  options: {
    timeout: 5000,
  },
});

const paymentClient = new Payment(client);

/**
 * Cria uma cobrança PIX no Mercado Pago
 * @param usuario - Dados do usuário comprador
 * @param valorTotal - Valor total da compra
 * @param descricao - Descrição do pagamento
 * @param externalReference - Referência externa (ex: rifaId-quantidade)
 * @returns Dados do pagamento PIX criado
 */
export async function criarCobrancaPix(
  usuario: Usuario,
  valorTotal: number,
  descricao: string,
  externalReference: string
) {
  try {
    const payment = await paymentClient.create({
      body: {
        transaction_amount: valorTotal,
        description: descricao,
        payment_method_id: "pix",
        external_reference: externalReference,
        payer: {
          email: usuario.email,
          first_name: usuario.nome,
          last_name: usuario.sobrenome || "",
          identification: {
            type: "CPF",
            number: usuario.cpf.replace(/\D/g, ""),
          },
        },
      },
    });

    if (!payment || !payment.id) {
      throw new Error("Falha ao criar pagamento no Mercado Pago");
    }

    // Extrai os dados do PIX
    const qrCode = payment.point_of_interaction?.transaction_data?.qr_code;
    const qrCodeBase64 = payment.point_of_interaction?.transaction_data?.qr_code_base64;
    const ticketUrl = payment.point_of_interaction?.transaction_data?.ticket_url;

    if (!qrCode || !qrCodeBase64) {
      throw new Error("QR Code PIX não foi gerado");
    }

    // Calcula tempo de expiração (normalmente 30 minutos)
    const expirationDate = payment.date_of_expiration
      ? new Date(payment.date_of_expiration)
      : new Date(Date.now() + 30 * 60 * 1000);

    const tempoExpiracao = Math.floor((expirationDate.getTime() - Date.now()) / 1000);

    return {
      paymentId: payment.id.toString(),
      qrCodeBase64,
      pixCopiaECola: qrCode,
      ticketUrl,
      valorTotal,
      tempoExpiracao,
      status: payment.status,
    };
  } catch (error: any) {
    console.error("Erro ao criar cobrança PIX no Mercado Pago:", error);
    throw new Error(error.message || "Falha ao gerar cobrança PIX");
  }
}

/**
 * Busca informações de um pagamento pelo ID
 * @param paymentId - ID do pagamento no Mercado Pago
 * @returns Dados do pagamento
 */
export async function buscarPagamento(paymentId: number) {
  try {
    const payment = await paymentClient.get({ id: paymentId });
    return payment;
  } catch (error: any) {
    console.error("Erro ao buscar pagamento:", error);
    throw new Error("Falha ao buscar informações do pagamento");
  }
}

/**
 * Verifica se um pagamento foi aprovado
 * @param paymentId - ID do pagamento
 * @returns true se o pagamento foi aprovado
 */
export async function verificarPagamentoAprovado(paymentId: number): Promise<boolean> {
  try {
    const payment = await buscarPagamento(paymentId);
    return payment.status === "approved";
  } catch (error) {
    return false;
  }
}
