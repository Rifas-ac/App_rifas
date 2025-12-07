"use client";

import React, { useState, useEffect } from "react";
import type { Rifa, Ticket } from "@/types";
import FormularioCheckout from "@/components/FormularioCheckout";
import QrCodeDisplay from "@/components/QrCodeDisplay";
import CarrosselGol from "@/components/CarrosselGol";
import QuantidadeSelector from "@/components/QuantidadeSelector";

type RifaComTickets = Rifa & { tickets: Ticket[] };

type PageState = "FORM" | "LOADING" | "ERROR" | "QR_CODE";

interface QrCodeData {
  qrCodeBase64: string;
  pixCode: string;
  expiresAt: string;
}

export default function GolPage() {
  const [rifa, setRifa] = useState<RifaComTickets | null>(null);
  const [pageState, setPageState] = useState<PageState>("FORM");
  const [qrCodeData, setQrCodeData] = useState<QrCodeData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState(3);

  useEffect(() => {
    const fetchRifaGol = async () => {
      try {
        // Buscar especificamente a rifa do Gol
        const response = await fetch("/api/rifas");
        if (!response.ok) {
          throw new Error("Erro ao carregar rifas.");
        }
        const rifas: RifaComTickets[] = await response.json();
        const rifaGol = rifas.find(r => r.titulo.includes("Gol"));

        if (!rifaGol) {
          throw new Error("Rifa do Gol não encontrada.");
        }

        setRifa(rifaGol);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Erro ao carregar a rifa.");
        setPageState("ERROR");
      }
    };
    fetchRifaGol();
  }, []);

  const handleCheckoutSubmit = async (comprador: any) => {
    if (!rifa) return;
    setPageState("LOADING");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rifaId: rifa.id,
          quantidade,
          comprador,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Falha ao gerar o PIX.");
      }

      setQrCodeData(data);
      setPageState("QR_CODE");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Ocorreu um erro inesperado.");
      setPageState("ERROR");
    }
  };

  if (!rifa) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        {errorMessage ? (
          <div className="bg-red-900/50 border border-red-700 p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-2">Ops! Algo deu errado.</h2>
            <p>{errorMessage}</p>
          </div>
        ) : (
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
        )}
      </div>
    );
  }

  const valorTotal = rifa.valorCota * quantidade;

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-lg mx-auto">
        {/* Carrossel do Gol */}
        <CarrosselGol />

        {/* Informações da Rifa */}
        <div className="bg-gray-800 p-6 space-y-6">
          {/* Título e Sorteio */}
          <div className="text-white">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-2xl font-bold">{rifa.titulo} Pode Ser Sua</h1>
              <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                APENAS R$ {rifa.valorCota.toFixed(2)}
              </span>
            </div>
            <p className="text-gray-300 flex items-center gap-2">
              🏆 Sorteio: Loteria Federal
            </p>
          </div>

          {/* Meus Títulos */}
          <button
            className="w-full bg-gray-700 text-white border border-gray-600 hover:bg-gray-600 px-4 py-2 rounded-lg transition-colors"
          >
            🛒 Meus títulos
          </button>

          {/* Seletor de Quantidade */}
          <div>
            <h3 className="text-white font-semibold mb-3">Selecione a quantidade</h3>
            <QuantidadeSelector quantidade={quantidade} setQuantidade={setQuantidade} />
          </div>

          {/* Botão Participar */}
          <button
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={pageState === "LOADING"}
          >
            Participar R$ {valorTotal.toFixed(2)}
          </button>

          {/* Prêmio da Campanha */}
          <div className="bg-gray-700 rounded-lg p-4 text-white">
            <h3 className="font-semibold mb-2">🏆 Prêmio dessa campanha</h3>
            <p className="text-sm text-gray-300">{rifa.descricao}</p>
          </div>

          {/* Informação sobre números */}
          <p className="text-center text-gray-400 text-sm">
            Os números serão gerados automaticamente e aleatoriamente após a compra
          </p>

          {/* Detalhes da Compra */}
          <div className="bg-gray-700 rounded-lg p-4 text-white">
            <h3 className="font-semibold mb-3">Detalhes da compra:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>• Quantidade: {quantidade} números</li>
              <li>• Valor unitário: R$ {rifa.valorCota.toFixed(2)}</li>
              <li>• Total: R$ {valorTotal.toFixed(2)}</li>
              <li>• Mínimo obrigatório: 3 números</li>
            </ul>
          </div>
        </div>

        {/* Formulário de Checkout / QR Code */}
        <div className="bg-gray-800 p-6 mt-4">
          {pageState === "FORM" && (
            <FormularioCheckout
              rifaId={String(rifa.id)}
              quantidade={quantidade}
              valorTotal={valorTotal}
              onSubmit={handleCheckoutSubmit}
              carregando={false}
            />
          )}
          {pageState === "LOADING" && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
            </div>
          )}
          {pageState === "QR_CODE" && qrCodeData && <QrCodeDisplay {...qrCodeData} />}
          {pageState === "ERROR" && errorMessage && (
            <div className="bg-red-900/50 border border-red-700 p-6 rounded-lg text-center">
              <h2 className="text-xl font-bold mb-2 text-white">Ops! Algo deu errado.</h2>
              <p className="text-gray-300">{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
