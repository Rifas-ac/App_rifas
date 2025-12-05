"use client";

import React, { useState, useEffect } from "react";
import type { Rifa, Ticket, RifaComTickets, DadosCheckout, PixData } from "@/types";
import RifaCard from "@/components/RifaCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NotaInformativa from "@/components/NotaInformativa";
import LoginRequiredPopup from "@/components/LoginRequiredPopup";
import SucessoCompraPopup from "@/components/SucessoCompraPopup";
import Image from "next/image";
import { IMaskInput } from "react-imask";
import Cookies from "js-cookie";

export default function Home() {
  const [rifa, setRifa] = useState<RifaComTickets | null>(null);
  const [quantidade, setQuantidade] = useState(3);
  const [valorTotal, setValorTotal] = useState(0);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [numerosGerados, setNumerosGerados] = useState<number[]>([]);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showSucessoPopup, setShowSucessoPopup] = useState(false);
  const [paymentIdPolling, setPaymentIdPolling] = useState<string | null>(null);

  // Novos estados para o fluxo PIX
  const [checkoutStep, setCheckoutStep] = useState<"form" | "pix">("form");
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [comprador, setComprador] = useState<DadosCheckout>({
    nome: "",
    sobrenome: "",
    email: "",
    telefone: "",
    cpf: "",
  });

  // Efeito para buscar a rifa ativa
  useEffect(() => {
    const fetchRifaAtiva = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/rifas/ativa");
        if (!response.ok) throw new Error("Nenhuma rifa ativa encontrada.");
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

  // Efeito para calcular o valor total
  useEffect(() => {
    if (rifa) {
      const valorUnitario = quantidade >= 10 ? 3.79 : rifa.valorCota;
      setValorTotal(quantidade * valorUnitario);
    }
  }, [quantidade, rifa]);

  // Efeito para o contador regressivo do PIX
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Efeito para verificar status do pagamento periodicamente
  useEffect(() => {
    if (!paymentIdPolling) return;

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/pagamento/status?paymentId=${paymentIdPolling}`);
        const data = await response.json();

        if (data.status === "approved" && data.tickets.length > 0) {
          // Pagamento aprovado!
          const numeros = data.tickets.map((t: any) => t.numero);
          setNumerosGerados(numeros);
          setIsCheckoutOpen(false);
          setShowSucessoPopup(true);
          setPaymentIdPolling(null); // Para o polling
        }
      } catch (error) {
        console.error("Erro ao verificar status:", error);
      }
    };

    // Verifica a cada 3 segundos
    const interval = setInterval(checkPaymentStatus, 3000);

    // Limpa o intervalo após 30 minutos (expiração do PIX)
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setPaymentIdPolling(null);
    }, 30 * 60 * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [paymentIdPolling]);

  // Abre o modal e reseta o estado do checkout
  const handleParticipate = () => {
    const userType = Cookies.get("userType");
    if (!userType) {
      setShowLoginRequired(true);
      return;
    }

    if (!rifa) return;
    const ticketsDisponiveis = rifa.totalNumeros - rifa.tickets.filter((t: { status: string }) => t.status === "pago").length;
    if (quantidade > ticketsDisponiveis) {
      setError(`Apenas ${ticketsDisponiveis} números estão disponíveis.`);
      return;
    }
    setError(null);
    setCheckoutStep("form");
    setPixData(null);
    setIsCheckoutOpen(true);
  };

  const handleReset = () => {
    setShowSuccess(false);
    setShowNumbers(false);
    setNumerosGerados([]);
    setQuantidade(3);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setComprador((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rifa) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rifaId: rifa.id, quantidade, comprador }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao gerar cobrança PIX.");
      }

      setPixData(data);
      setCountdown(data.tempoExpiracao);
      setCheckoutStep("pix");

      // Inicia o polling para verificar pagamento
      setPaymentIdPolling(data.transactionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (pixData?.pixCopiaECola) {
      navigator.clipboard.writeText(pixData.pixCopiaECola);
      alert("Código PIX copiado para a área de transferência!");
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

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
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <RifaCard
          quantidade={quantidade}
          setQuantidade={setQuantidade}
          valorTotal={valorTotal}
          onParticipate={handleParticipate}
          onPromocaoClick={() => setQuantidade(10)}
          isProcessing={isLoading && isCheckoutOpen}
          showSuccess={showSuccess}
          onReset={handleReset}
          showNumbers={showNumbers}
          numerosGerados={numerosGerados}
        />
        <NotaInformativa showNumbers={false} />

        <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                {checkoutStep === "form" ? "Finalizar Compra" : "Pague com PIX"}
              </DialogTitle>
            </DialogHeader>

            {error && <p className="text-red-500 text-sm text-center my-2">{error}</p>}

            {checkoutStep === "form" ? (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4 p-4">
                <input
                  type="text"
                  name="nome"
                  placeholder="Nome"
                  required
                  value={comprador.nome}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  name="sobrenome"
                  placeholder="Sobrenome"
                  required
                  value={comprador.sobrenome}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  required
                  value={comprador.email}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <IMaskInput
                  mask="(00) 00000-0000"
                  value={comprador.telefone}
                  onAccept={(value) => handleInputChange({ target: { name: "telefone", value } } as any)}
                  name="telefone"
                  type="tel"
                  placeholder="Telefone"
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <IMaskInput
                  mask="000.000.000-00"
                  value={comprador.cpf}
                  onAccept={(value) => handleInputChange({ target: { name: "cpf", value } } as any)}
                  name="cpf"
                  type="text"
                  placeholder="CPF"
                  required
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-500">
                  {isLoading ? "Gerando PIX..." : `Pagar R$ ${valorTotal.toFixed(2)}`}
                </button>
              </form>
            ) : (
              pixData && (
                <div className="flex flex-col items-center p-4 text-center">
                  <p className="mb-2">Escaneie o QR Code para pagar:</p>
                  <Image src={pixData.qrCodeBase64} alt="PIX QR Code" width={256} height={256} />
                  <p className="mt-2 text-lg font-bold text-orange-400">Expira em: {formatTime(countdown)}</p>

                  <p className="mt-4 mb-2">Ou use o PIX Copia e Cola:</p>
                  <div className="w-full bg-gray-700 p-2 rounded border border-gray-600">
                    <p className="text-xs break-all">{pixData.pixCopiaECola}</p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Copiar Código
                  </button>
                  <p className="mt-4 text-sm text-gray-400">
                    Após o pagamento, seus números serão enviados para o seu e-mail.
                  </p>
                </div>
              )
            )}
          </DialogContent>
        </Dialog>

        <LoginRequiredPopup
          isOpen={showLoginRequired}
          onClose={() => setShowLoginRequired(false)}
        />

        <SucessoCompraPopup
          isOpen={showSucessoPopup}
          onClose={() => {
            setShowSucessoPopup(false);
            setNumerosGerados([]);
            setQuantidade(3);
          }}
          numerosGerados={numerosGerados}
          tituloRifa={rifa.titulo}
        />
      </div>
    </div>
  );
}
