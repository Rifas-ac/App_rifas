import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { ConfirmacaoCompraEmail } from "@/components/emails/ConfirmacaoCompraEmail";
import React, { useEffect, useState } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

// This is a simulated payload from Infinity Pay.
// The actual payload might be different.
interface InfinityPayWebhookPayload {
  event: "payment.confirmed";
  charge: {
    id: string;
    // other charge details...
  };
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as InfinityPayWebhookPayload;

    // Verify the webhook signature here (important for security)
    // For now, we'll skip this as we don't have the secret.

    if (payload.event === "payment.confirmed") {
      const chargeId = payload.charge.id;

      const tickets = await prisma.ticket.findMany({
        where: { checkoutSessionId: chargeId },
        include: { usuario: true, rifa: true },
      });

      if (tickets.length > 0) {
        await prisma.ticket.updateMany({
          where: { checkoutSessionId: chargeId },
          data: { status: "pago" },
        });

        const usuario = tickets[0].usuario;
        const rifa = tickets[0].rifa;
        const numeros = tickets.map((t) => t.numero);

        if (usuario) {
          await resend.emails.send({
            from: "Rifas <nao-responda@seu-dominio.com>", // Replace with your domain
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
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Erro no webhook de pagamento:", error);
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}

const MeuComponente = () => {
  const [dados, setDados] = useState<string | null>(null);

  useEffect(() => {
    buscarDados().then(setDados);
  }, []);

  if (!dados) return React.createElement("div", null, "Carregando...");
  return React.createElement("div", null, dados);
};

// Definindo a função no arquivo
async function buscarDados() {
  // Sua lógica para buscar dados (exemplo)
  const resposta = await fetch("/api/dados");
  return resposta.json();
}
