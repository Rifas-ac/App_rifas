import { NextResponse } from "next/server";

/**
 * Endpoint de Webhook para receber notificações de pagamento do Mercado Pago.
 *
 * IMPORTANTE: Esta é uma versão temporária (placeholder).
 * O único objetivo dela é existir e responder 200 OK para o Mercado Pago
 * para que a criação do pagamento no checkout funcione.
 * A lógica de processar a notificação será implementada depois.
 */
export async function POST(request: Request) {
  try {
    // Pega o corpo da requisição enviada pelo Mercado Pago
    const body = await request.json();

    // Apenas para depuração: mostra no console do seu servidor o que o Mercado Pago enviou.
    // Assim você pode ver as notificações chegando durante os testes.
    console.log("--- NOTIFICAÇÃO DO MERCADO PAGO RECEBIDA ---");
    console.log(JSON.stringify(body, null, 2));
    console.log("-------------------------------------------");

    // A parte mais importante: Responda IMEDIATAMENTE com status 200.
    // Isso informa ao Mercado Pago que você recebeu a notificação com sucesso.
    // Se você não fizer isso, o Mercado Pago continuará tentando enviar a mesma notificação várias vezes.
    return NextResponse.json({ status: "ok" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar webhook do Mercado Pago:", error);
    // Mesmo em caso de erro no nosso lado, é uma boa prática tentar responder 200 OK
    // para evitar retentativas excessivas do Mercado Pago.
    return NextResponse.json({ status: "error", message: "Erro interno do servidor" }, { status: 500 });
  }
}
