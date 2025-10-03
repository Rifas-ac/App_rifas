import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { ConfirmacaoCompraEmail } from "@/components/emails/ConfirmacaoCompraEmail";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AsaasWebhookPayload {
  event: "PAYMENT_RECEIVED" | string;
  payment: {
    id: string;
    // ... outros campos do pagamento
  };
}

// Função para verificar a assinatura do webhook (SEGURANÇA)
const verifyAsaasSignature = (rawBody: string, signature: string): boolean => {
  const secret = process.env.ASAAS_WEBHOOK_SECRET;
  if (!secret) {
    console.error("ASAAS_WEBHOOK_SECRET não está configurado.");
    return false;
  }
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(rawBody, "utf-8");
  const computedSignature = hmac.digest("hex");
  return computedSignature === signature;
};

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody) as AsaasWebhookPayload;
    const signature = req.headers.get("asaas-webhook-signature");

    // 1. Verifica a assinatura do webhook
    if (!signature || !verifyAsaasSignature(rawBody, signature)) {
      console.warn("Assinatura de webhook inválida.");
      return NextResponse.json({ message: "Assinatura inválida." }, { status: 401 });
    }

    // 2. Processa apenas eventos de pagamento recebido
    if (payload.event === "PAYMENT_RECEIVED") {
      const paymentId = payload.payment.id;

      // 3. Inicia uma transação para garantir a consistência
      await prisma.$transaction(async (tx) => {
        // Encontra os tickets reservados associados a este pagamento da Asaas
        const tickets = await tx.ticket.findMany({
          where: { 
            paymentId: paymentId,
            status: "reservado" 
          },
          include: { usuario: true, rifa: true },
        });

        if (tickets.length > 0) {
          // Atualiza o status dos tickets para "pago"
          await tx.ticket.updateMany({
            where: { 
              paymentId: paymentId
            },
            data: { status: "pago" },
          });

          // Prepara e envia o e-mail de confirmação
          const usuario = tickets[0].usuario;
          const rifa = tickets[0].rifa;
          const numeros = tickets.map((t) => t.numero);

          if (usuario) {
            await resend.emails.send({
              from: "Rifas AC <nao-responda@seu-dominio.com>",
              to: [usuario.email],
              subject: `✅ Compra Confirmada - Rifa "${rifa.titulo}"`,
              react: await ConfirmacaoCompraEmail({
                nomeUsuario: usuario.nome,
                tituloRifa: rifa.titulo,
                numerosComprados: numeros,
              }),
            });
          }
        }
      });
    }

    // 4. Retorna uma resposta de sucesso para a Asaas
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Erro no webhook de pagamento da Asaas:", error);
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}
