import { cookies } from "next/headers";
import { CheckCircle, Clock, XCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { ConfirmacaoCompraEmail } from "@/components/emails/ConfirmacaoCompraEmail";

// Função executada no servidor para confirmar o pagamento
async function confirmarPagamento(sessionId: string) {
  if (!sessionId) return null;

  const resend = new Resend(process.env.RESEND_API_KEY);

  // Usa transação para garantir que a atualização e o envio de email ocorram juntos
  try {
    const { usuario, rifa, ticketsAtualizados } = await prisma.$transaction(async (tx) => {
      const tickets = await tx.ticket.findMany({
        where: {
          checkoutSessionId: sessionId,
          status: "reservado", // Apenas confirma o que estava reservado
        },
        include: { usuario: true, rifa: true },
      });

      if (tickets.length === 0 || !tickets[0].usuario || !tickets[0].rifa) {
        // Se não houver tickets 'reservados', eles podem já ter sido processados.
        // Retornamos nulo para que a página possa buscar os tickets já pagos.
        return { usuario: null, rifa: null, ticketsAtualizados: [] };
      }

      await tx.ticket.updateMany({
        where: { id: { in: tickets.map((t) => t.id) } },
        data: { status: "pago" },
      });

      return {
        usuario: tickets[0].usuario,
        rifa: tickets[0].rifa,
        ticketsAtualizados: tickets,
      };
    });

    // Envia o e-mail de confirmação se a transação foi bem-sucedida
    if (usuario && rifa && ticketsAtualizados.length > 0) {
      await resend.emails.send({
        from: "Garagem VW <onboarding@resend.dev>",
        to: [usuario.email],
        subject: `✅ Compra Confirmada - Rifa "${rifa.titulo}"`,        react: ConfirmacaoCompraEmail({
          nomeUsuario: usuario.nome,
          numerosComprados: ticketsAtualizados.map((t) => t.numero),
          tituloRifa: rifa.titulo,
        }),
      });
    }
  } catch (error) {
    console.error(`Falha ao confirmar pagamento para a sessão ${sessionId}:`, error);
    // Não lança o erro para a página, pois queremos mostrar os tickets existentes mesmo se o email falhar.
  }

  // Após a tentativa de confirmação, busca todos os tickets da sessão para exibição
  return prisma.ticket.findMany({
    where: { checkoutSessionId: sessionId },
    include: { rifa: true },
    orderBy: { numero: "asc" },
  });
}

export default async function StatusPage({ searchParams }: { searchParams: { session_id: string } }) {
  const { session_id } = searchParams;
  const tickets = await confirmarPagamento(session_id);

  if (!tickets || tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <div className="w-full max-w-2xl bg-gray-800 shadow-lg rounded-lg p-8 text-center">
          <ShoppingCart className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-center mb-4">Compra não encontrada</h1>
          <p className="text-gray-300 mb-8">
            Não foi possível localizar os detalhes da sua compra. Se você concluiu o pagamento, por favor, verifique seu e-mail ou entre em contato com o suporte.
          </p>
          <Link href="/">
            <span className="w-full inline-block bg-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors">
              Voltar para a Rifa
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
      <div className="w-full max-w-2xl bg-gray-800 shadow-lg rounded-lg p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-center mb-4">Pagamento Aprovado!</h1>
        <p className="text-gray-300 mb-8">Sua compra foi confirmada com sucesso. Abaixo estão seus números da sorte. Boa sorte!</p>

        <div className="bg-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Rifa: {tickets[0].rifa.titulo}</h2>
          <h3 className="text-lg font-semibold text-orange-400 mb-3">Seus Números:</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {tickets.map((ticket) => (
              <span key={ticket.id} className="bg-green-600 text-white font-bold py-2 px-4 rounded-md shadow-md">
                {ticket.numero}
              </span>
            ))}
          </div>
        </div>

        <Link href="/">
          <span className="w-full inline-block bg-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors">
            Voltar para a Rifa
          </span>
        </Link>
      </div>
    </div>
  );
}
