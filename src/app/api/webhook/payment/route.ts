import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { ConfirmacaoCompraEmail } from "@/components/emails/ConfirmacaoCompraEmail";
import { buscarPagamento } from "@/lib/mercadopago";
import { gerarNumerosUnicos } from "@/utils/geradorDeNumeros";

const resend = new Resend(process.env.RESEND_API_KEY);

interface MercadoPagoWebhookPayload {
  action: string;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: "payment" | string;
  user_id: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload = body as MercadoPagoWebhookPayload;

    console.log("Webhook recebido do Mercado Pago:", payload);

    // Processa apenas notificações de pagamento
    if (payload.type === "payment") {
      const paymentId = parseInt(payload.data.id);

      // Busca informações do pagamento no Mercado Pago
      const payment = await buscarPagamento(paymentId);

      console.log("Status do pagamento:", payment.status);
      console.log("External reference:", payment.external_reference);

      // Processa apenas se o pagamento foi aprovado
      if (payment.status === "approved") {
        // Extrai informações do external_reference: rifa-{rifaId}-usuario-{userId}-{timestamp}
        const externalRef = payment.external_reference || "";
        const match = externalRef.match(/rifa-(\d+)-usuario-(\d+)/);

        if (!match) {
          console.error("External reference inválido:", externalRef);
          return NextResponse.json({ status: "error", message: "External reference inválido" }, { status: 400 });
        }

        const rifaId = parseInt(match[1]);
        const usuarioId = parseInt(match[2]);
        const quantidade = Math.floor(payment.transaction_amount / 3.79); // Calcula quantidade baseado no valor

        // Verifica se já não processou este pagamento
        const ticketsExistentes = await prisma.ticket.findMany({
          where: {
            paymentId: paymentId.toString(),
          },
        });

        if (ticketsExistentes.length > 0) {
          console.log("Pagamento já processado anteriormente");
          return NextResponse.json({ status: "ok", message: "Já processado" });
        }

        // Inicia uma transação para garantir a consistência
        await prisma.$transaction(async (tx: any) => {
          // Busca a rifa
          const rifa = await tx.rifa.findUnique({
            where: { id: rifaId },
            include: { tickets: true },
          });

          if (!rifa) {
            throw new Error("Rifa não encontrada");
          }

          // Busca o usuário
          const usuario = await tx.usuario.findUnique({
            where: { id: usuarioId },
          });

          if (!usuario) {
            throw new Error("Usuário não encontrado");
          }

          // Gera números disponíveis
          const numerosOcupados = rifa.tickets
            .filter((t: any) => t.status === "pago")
            .map((t: any) => parseInt(t.numero));

          const numerosDisponiveis = [];
          for (let i = 1; i <= rifa.totalNumeros; i++) {
            if (!numerosOcupados.includes(i)) {
              numerosDisponiveis.push(i);
            }
          }

          // Gera números únicos
          const numerosEscolhidos = gerarNumerosUnicos(quantidade, numerosDisponiveis);

          // Cria os tickets com status "pago" diretamente
          await tx.ticket.createMany({
            data: numerosEscolhidos.map((numero: number) => ({
              numero: numero.toString(),
              status: "pago",
              paymentId: paymentId.toString(),
              rifaId: rifa.id,
              usuarioId: usuario.id,
            })),
          });

          console.log(`${numerosEscolhidos.length} tickets criados para o usuário ${usuario.email}`);

          // Envia e-mail de confirmação
          try {
            await resend.emails.send({
              from: "Garagem VW <onboarding@resend.dev>",
              to: [usuario.email],
              subject: `✅ Compra Confirmada - Rifa "${rifa.titulo}"`,
              react: await ConfirmacaoCompraEmail({
                nomeUsuario: usuario.nome,
                tituloRifa: rifa.titulo,
                numerosComprados: numerosEscolhidos.map(n => n.toString()),
              }),
            });
            console.log("E-mail de confirmação enviado com sucesso");
          } catch (emailError) {
            console.error("Erro ao enviar e-mail:", emailError);
            // Não falha a transação se o email falhar
          }
        });
      } else {
        console.log(`Pagamento ${paymentId} com status: ${payment.status} - não processado`);
      }
    }

    // Retorna uma resposta de sucesso para o Mercado Pago
    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Erro no webhook de pagamento do Mercado Pago:", error);
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}
