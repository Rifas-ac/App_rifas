"use client";

import type React from "react";
import RifaHeader from "./RifaHeader";
import RifaContent from "./RifaContent";
import RifaFooter from "./RifaFooter";

interface RifaCardProps {
  quantidade: number;
  setQuantidade: (valor: number) => void;
  showNumbers: boolean;
  numerosGerados: string[];
  isProcessing: boolean;
  showSuccess: boolean;
  valorTotal: number;
  onParticipate: () => void;
  onReset: () => void;
  onPromocaoClick: () => void;
}

const RifaCard: React.FC<RifaCardProps> = ({
  quantidade,
  setQuantidade,
  showNumbers,
  numerosGerados,
  isProcessing,
  showSuccess,
  valorTotal,
  onParticipate,
  onReset,
  onPromocaoClick,
}) => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#2a2a2a" }}>
      <RifaHeader />
      <RifaContent
        quantidade={quantidade}
        setQuantidade={setQuantidade}
        showNumbers={showNumbers}
        numerosGerados={numerosGerados}
        isProcessing={isProcessing}
        showSuccess={showSuccess}
        valorTotal={valorTotal}
        onParticipate={onParticipate}
        onReset={onReset}
        onPromocaoClick={onPromocaoClick}
      />
      <RifaFooter />
    </div>
  );
};

export default RifaCard;
