"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface Ticket {
  id: string;
  numero: number;
  status: string;
}

interface Rifa {
  id: string;
  titulo: string;
  descricao: string;
  imagemUrl: string | null;
  premio: string;
}

interface TicketComRifa extends Ticket {
  rifa: Rifa;
}

interface RifaAgrupada {
  rifa: Rifa;
  tickets: Ticket[];
}

export default function StatusPage() {
  const [rifasAgrupadas, setRifasAgrupadas] = useState<RifaAgrupada[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (!userId) {
      router.push("/login");
      return;
    }

    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/cliente/tickets");
        if (!response.ok) {
          throw new Error("Falha ao buscar tickets");
        }
        const data: TicketComRifa[] = await response.json();

        // Agrupa tickets por rifa
        const agrupado = data.reduce((acc, ticketComRifa) => {
          const rifaId = ticketComRifa.rifa.id;
          const existente = acc.find(r => r.rifa.id === rifaId);

          if (existente) {
            existente.tickets.push({
              id: ticketComRifa.id,
              numero: ticketComRifa.numero,
              status: ticketComRifa.status
            });
          } else {
            acc.push({
              rifa: ticketComRifa.rifa,
              tickets: [{
                id: ticketComRifa.id,
                numero: ticketComRifa.numero,
                status: ticketComRifa.status
              }]
            });
          }

          return acc;
        }, [] as RifaAgrupada[]);

        // Ordena os números dentro de cada rifa
        agrupado.forEach(r => {
          r.tickets.sort((a, b) => a.numero - b.numero);
        });

        setRifasAgrupadas(agrupado);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando suas participações...</p>
        </div>
      </div>
    );
  }

  if (rifasAgrupadas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">🎫</div>
          <h2 className="text-white text-2xl mb-4 font-bold">Você ainda não possui bilhetes</h2>
          <p className="text-gray-400 mb-6">Participe de uma rifa e boa sorte!</p>
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg"
          >
            Ver Rifas Disponíveis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-2">Minhas Participações</h1>
          <p className="text-gray-400">Confira todos os seus números da sorte</p>
        </div>

        <div className="space-y-8">
          {rifasAgrupadas.map((rifaAgrupada) => (
            <div
              key={rifaAgrupada.rifa.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 bg-gradient-to-r from-orange-600/20 to-pink-600/20 border-b border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {rifaAgrupada.rifa.titulo}
                    </h2>
                    <p className="text-gray-300 mb-1">🏆 {rifaAgrupada.rifa.premio}</p>
                    <p className="text-orange-400 font-semibold">
                      {rifaAgrupada.tickets.length} {rifaAgrupada.tickets.length === 1 ? 'número' : 'números'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Seus Números:</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                  {rifaAgrupada.tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className={`
                        aspect-square flex items-center justify-center rounded-lg font-bold text-lg
                        transition-transform hover:scale-110 shadow-md
                        ${ticket.status === "pago"
                          ? "bg-gradient-to-br from-green-500 to-green-700 text-white"
                          : "bg-gradient-to-br from-yellow-500 to-yellow-700 text-white"
                        }
                      `}
                      title={ticket.status === "pago" ? "Pago ✓" : "Processando..."}
                    >
                      {String(ticket.numero).padStart(4, "0")}
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500 to-green-700"></div>
                      <span className="text-sm text-gray-300">Confirmado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-500 to-yellow-700"></div>
                      <span className="text-sm text-gray-300">Processando</span>
                    </div>
                  </div>

                  <span className="text-sm text-gray-400">
                    Total: {rifaAgrupada.tickets.length} {rifaAgrupada.tickets.length === 1 ? 'bilhete' : 'bilhetes'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-full transition-all shadow-lg"
          >
            Participar de Mais Rifas
          </button>
        </div>
      </div>
    </div>
  );
}
