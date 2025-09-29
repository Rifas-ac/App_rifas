"use client";

import React, { useState, useEffect } from "react";
import { Rifa } from "@prisma/client";
import FormularioCheckout from "@/components/FormularioCheckout";
import QrCodeDisplay from "@/components/QrCodeDisplay";
import RifaCard from "@/components/RifaCard"; // Assuming this component is still useful for displaying raffle info

type RifaComTickets = Rifa & { tickets: { status: string }[] };

type PageState = "FORM" | "LOADING" | "ERROR" | "QR_CODE";

interface QrCodeData {
  qrCodeBase64: string;
  pixCode: string;
  expiresAt: string;
}

export interface FormularioCheckoutProps {
  rifaId: string;
  quantidade: number;
  isLoading?: boolean; // Adicione esta linha
}

export default function RifaAtivaPage() {
  const [rifa, setRifa] = useState<RifaComTickets | null>(null);
  const [pageState, setPageState] = useState<PageState>("FORM");
  const [qrCodeData, setQrCodeData] = useState<QrCodeData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [quantidade, setQuantidade] = useState(3);

  useEffect(() => {
    const fetchRifaAtiva = async () => {
      try {
        const response = await fetch("/api/rifas/ativa");
        if (!response.ok) {
          throw new Error("Nenhuma rifa ativa encontrada.");
        }
        const data: RifaComTickets = await response.json();
        setRifa(data);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : "Erro ao carregar a rifa.");
        setPageState("ERROR");
      }
    };
    fetchRifaAtiva();
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

  const valorTotal = rifa.valorCota * quantidade; // Calculate total value based on unit price and quantity

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        <RifaCard
          quantidade={quantidade}
          setQuantidade={setQuantidade}
          valorTotal={valorTotal}
          onParticipate={() => {}} // This will be handled by the form now
          onPromocaoClick={() => setQuantidade(10)}
          isProcessing={pageState === "LOADING"}
        />

        <div className="mt-8">
          {pageState === "FORM" && (
            <FormularioCheckout
              rifaId={String(rifa.id)}
              quantidade={quantidade}
              valorTotal={valorTotal}
              onSubmit={handleCheckoutSubmit}
              carregando={false} // Correto: nunca estará carregando no estado FORM
            />
          )}
          {pageState === "LOADING" && (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500"></div>
            </div>
          )}
          {pageState === "QR_CODE" && qrCodeData && <QrCodeDisplay {...qrCodeData} />}
          {pageState === "ERROR" && errorMessage && (
            <div className="bg-red-900/50 border border-red-700 p-6 rounded-lg text-center">
              <h2 className="text-xl font-bold mb-2">Ops! Algo deu errado.</h2>
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
