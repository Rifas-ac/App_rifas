"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Ticket {
  id: number;
  numero: string;
  rifa: {
    id: number;
    titulo: string;
    premio: string;
  };
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("payment_id");
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (paymentId) {
      fetchTickets();
    } else {
      setError("ID de pagamento não encontrado");
      setLoading(false);
    }
  }, [paymentId]);

  const fetchTickets = async () => {
    try {
      const response = await fetch(`/api/tickets-by-payment?payment_id=${paymentId}`);
      if (!response.ok) {
        throw new Error("Falha ao buscar os números");
      }
      const data = await response.json();
      setTickets(data);
      setShowModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar números");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // Redirecionar para página principal após fechar
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-red-900/50 border border-red-700 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Erro</h2>
          <p>{error}</p>
          <button
            onClick={() => window.location.href = "/"}
            className="mt-4 bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded text-white"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      {/* Modal de sucesso */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">🎉 Parabéns!</h2>
              <p className="text-gray-600">Seu pagamento foi confirmado com sucesso!</p>
            </div>

            {/* Informações da rifa */}
            {tickets.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Rifa: {tickets[0].rifa.titulo}</h3>
                <p className="text-sm text-gray-600 mb-4">Prêmio: {tickets[0].rifa.premio}</p>
                
                {/* Números comprados */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">
                    Seus números da sorte ({tickets.length} {tickets.length === 1 ? 'número' : 'números'}):
                  </h4>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="bg-orange-100 border border-orange-300 rounded-lg p-3 text-center font-bold text-orange-800"
                      >
                        {ticket.numero.padStart(4, '0')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mensagem adicional */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700 text-center">
                📧 Um e-mail de confirmação foi enviado com todos os detalhes da sua compra.
                Boa sorte no sorteio! 🍀
              </p>
            </div>

            {/* Botão para fechar */}
            <div className="text-center">
              <button
                onClick={closeModal}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Continuar Navegando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}