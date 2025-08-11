"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import RifaCard from "@/components/RifaCard";

export default function RifaAtivaPage() {
  const [quantidade, setQuantidade] = useState(3);
  const [showNumbers, setShowNumbers] = useState(false);
  const [numerosGerados, setNumerosGerados] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const valorUnitario = 3.99;
  const valorTotal = quantidade * valorUnitario;

  const gerarNumerosAleatorios = (qtd: number): string[] => {
    const numeros: string[] = [];
    const numerosUsados = new Set<number>();

    while (numeros.length < qtd) {
      const numero = Math.floor(Math.random() * 99999) + 1;
      if (!numerosUsados.has(numero)) {
        numerosUsados.add(numero);
        numeros.push(numero.toString().padStart(5, "0"));
      }
    }

    return numeros.sort((a, b) => a.localeCompare(b));
  };

  const handleParticipate = () => {
    setIsProcessing(true);
    setShowNumbers(false);
    setShowSuccess(false);

    setTimeout(() => {
      const numeros = gerarNumerosAleatorios(quantidade);
      setNumerosGerados(numeros);
      setIsProcessing(false);
      setShowNumbers(true);
      setShowSuccess(true);
    }, 2000);
  };

  const resetCompra = () => {
    setShowNumbers(false);
    setShowSuccess(false);
    setNumerosGerados([]);
    setQuantidade(3);
  };

  // Nova função para aplicar a promoção
  const handlePromocaoClick = () => {
    setQuantidade(10);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-3 mb-6">
          <Link href="/" className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <ArrowLeft className="w-6 h-6 text-white" />
          </Link>
          <h1 className="text-xl font-bold text-white">Rifa Ativa</h1>
        </div>

        <RifaCard
          quantidade={quantidade}
          setQuantidade={setQuantidade}
          showNumbers={showNumbers}
          numerosGerados={numerosGerados}
          isProcessing={isProcessing}
          showSuccess={showSuccess}
          valorTotal={valorTotal}
          onParticipate={handleParticipate}
          onReset={resetCompra}
          onPromocaoClick={handlePromocaoClick}
        />
      </div>
    </div>
  );
}
