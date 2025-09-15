"use client";

import React, { useState, useEffect } from "react";
import { Rifa } from "@prisma/client";
import RifaCard from "@/components/RifaCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import FormularioCheckout from "@/components/FormularioCheckout";
import NotaInformativa from "@/components/NotaInformativa";

// Define um tipo para os dados da rifa com os tickets inclusos
type RifaComTickets = Rifa & { tickets: { status: string }[] };

interface DadosCheckout {
  nome: string;
  sobrenome: string;
  email: string;
  telefone: string;
  cpf: string;
}

export default function Home() {
  const [rifa, setRifa] = useState<RifaComTickets | null>(null);
  const [quantidade, setQuantidade] = useState(3);
  const [valorTotal, setValorTotal] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efeito para buscar a rifa ativa quando o componente é montado
  useEffect(() => {
    const fetchRifaAtiva = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/rifas/ativa");
        if (!response.ok) {
          throw new Error("Nenhuma rifa ativa encontrada.");
        }
        const data: RifaComTickets = await response.json();
        setRifa(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao carregar a rifa.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRifaAtiva();
  }, []);

  // Efeito para calcular o valor total sempre que a quantidade ou a rifa mudar
  useEffect(() => {
    if (rifa) {
      // Lógica de promoção: a partir de 10, o preço unitário tem desconto
      const valorUnitario = quantidade >= 10 ? 3.79 : rifa.valorCota;
      setValorTotal(quantidade * valorUnitario);
    }
  }, [quantidade, rifa]);

  // Função para aplicar a promoção de 10 números
  const handlePromocaoClick = () => {
    setQuantidade(10);
  };

  // Função chamada quando o usuário clica em "Participar"
  const handleParticipate = () => {
    if (!rifa) return;

    const ticketsDisponiveis = rifa.totalNumeros - rifa.tickets.filter((t) => t.status === "pago").length;
    if (quantidade > ticketsDisponiveis) {
      setError(`Apenas ${ticketsDisponiveis} números estão disponíveis.`);
      return;
    }
    setError(null);
    setIsCheckoutOpen(true);
  };

  // Função chamada ao submeter o formulário de checkout
  const handleCheckoutSubmit = async (dadosComprador: DadosCheckout) => {
    if (!rifa) return;
    setIsLoading(true);
    setError(null);

    try {
      // 1. Chama a API para reservar os números e obter os dados para o link de pagamento
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rifaId: rifa.id,
          quantidade,
          comprador: dadosComprador,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao reservar os números.");
      }

      // 2. Constrói a URL de pagamento da InfinitePay
      const checkoutBaseUrl = data.checkoutUrl;
      const redirectUrl = data.redirectUrl;
      const priceInCents = data.priceInCents;

      const items = [{ name: "Rifa " + rifa.titulo, price: priceInCents, quantity: 1 }];
      const itemsJson = JSON.stringify(items);
      const encodedItems = encodeURIComponent(itemsJson);
      const encodedRedirectUrl = encodeURIComponent(redirectUrl);

      const paymentUrl = `${checkoutBaseUrl}?items=${encodedItems}&redirect_url=${encodedRedirectUrl}`;

      // 3. Redireciona o usuário para a página de pagamento
      window.location.href = paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
      setIsLoading(false);
    }
  };

  // Renderização condicional enquanto carrega ou se houver erro
  if (isLoading && !rifa) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error && !isCheckoutOpen) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white p-4">
        <div className="bg-red-900/50 border border-red-700 p-6 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-2">Ops! Algo deu errado.</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!rifa) {
    return null; // ou um estado de "Nenhuma rifa no momento"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <RifaCard
          quantidade={quantidade}
          setQuantidade={setQuantidade}
          valorTotal={valorTotal}
          onParticipate={handleParticipate}
          onPromocaoClick={handlePromocaoClick}
          showNumbers={false}
          numerosGerados={[]}
          isProcessing={isLoading}
          showSuccess={false}
          onReset={() => {}}
        />
        <NotaInformativa showNumbers={false} />

        {/* Modal de Checkout */}
        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Finalizar Compra</DialogTitle>
            </DialogHeader>
            <FormularioCheckout
              onSubmit={handleCheckoutSubmit}
              carregando={isLoading}
              valorTotal={valorTotal}
              quantidadeNumeros={quantidade}
            />
            {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}