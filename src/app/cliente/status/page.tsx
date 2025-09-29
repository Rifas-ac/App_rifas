"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, ShoppingCart } from "lucide-react";
import Link from "next/link";

// Tipagem para os dados do ticket que esperamos da API
interface Ticket {
  id: number;
  numero: string;
  rifa: {
    titulo: string;
  };
}

function StatusPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Se não houver session_id, não faz nada
    if (!sessionId) {
      setError("ID da compra não encontrado.");
      setLoading(false);
      return;
    }

    const fetchAndConfirmPayment = async () => {
      try {
        const response = await fetch("/api/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error("Falha ao buscar os detalhes da compra.");
        }

        const data = await response.json();
        setTickets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocorreu um erro desconhecido.");
      } finally {
        setLoading(false);
      }
    };

    fetchAndConfirmPayment();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500"></div>
        <p className="text-lg">Confirmando seu pagamento...</p>
      </div>
    );
  }

  if (error || tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <div className="w-full max-w-2xl bg-gray-800 shadow-lg rounded-lg p-8 text-center">
          <ShoppingCart className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-center mb-4">Compra não encontrada</h1>
          <p className="text-gray-300 mb-8">
            {error ||
              "Não foi possível localizar os detalhes da sua compra. Se o pagamento foi concluído, verifique seu e-mail."}
          </p>
          <Link
            href="/"
            className="w-full inline-block bg-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors">
            Voltar para a Rifa
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
        <p className="text-gray-300 mb-8">
          Sua compra foi confirmada com sucesso. Seus números da sorte foram enviados para o seu e-mail. Boa sorte!
        </p>
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
        <Link
          href="/"
          className="w-full inline-block bg-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors">
          Voltar para a Rifa
        </Link>
      </div>
    </div>
  );
}

export default function PageWrapper() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <StatusPage />
    </Suspense>
  );
}
