"use client";

import type React from "react";
import RifaHeader from "./RifaHeader";
import RifaContent from "./RifaContent";
import RifaFooter from "./RifaFooter";
import NumerosGerados from "./NumerosGerados";
import MensagemSucesso from "./MensagemSucesso";

interface RifaCardProps {
  quantidade: number;
  setQuantidade: (valor: number) => void;
  isProcessing: boolean;
  valorTotal: number;
  onParticipate: () => void;
  onPromocaoClick: () => void;
  showSuccess: boolean;
  onReset: () => void;
  showNumbers: boolean;
  numerosGerados: string[];
}

const RifaCard: React.FC<RifaCardProps> = ({
  quantidade,
  setQuantidade,
  isProcessing,
  valorTotal,
  onParticipate,
  onPromocaoClick,
  showSuccess,
  onReset,
  showNumbers,
  numerosGerados,
}) => {
  const renderContent = () => {
    if (showSuccess) {
      return (
        <div className="p-4">
          <MensagemSucesso />
        </div>
      );
    }
    if (showNumbers) {
      return (
        <div className="p-4">
          <NumerosGerados
            numerosGerados={numerosGerados}
            quantidade={quantidade}
            valorTotal={valorTotal}
            onReset={onReset}
          />
        </div>
      );
    }
    return (
      <RifaContent
        quantidade={quantidade}
        setQuantidade={setQuantidade}
        isProcessing={isProcessing}
        valorTotal={valorTotal}
        onParticipate={onParticipate}
        onPromocaoClick={onPromocaoClick}
      />
    );
  };

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: "#2a2a2a" }}
    >
      <RifaHeader />
      {renderContent()}
      <RifaFooter />
    </div>
  );
};

export default RifaCard;
