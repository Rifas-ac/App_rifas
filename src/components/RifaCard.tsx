"use client";

import type React from "react";
import RifaHeader from "./RifaHeader";
import RifaContent from "./RifaContent";
import RifaFooter from "./RifaFooter";

interface RifaCardProps {
  quantidade: number;
  setQuantidade: (valor: number) => void;
  isProcessing: boolean;
  valorTotal: number;
  onParticipate: () => void;
  onPromocaoClick: () => void;
}

const RifaCard: React.FC<RifaCardProps> = ({
  quantidade,
  setQuantidade,
  isProcessing,
  valorTotal,
  onParticipate,
  onPromocaoClick,
}) => {
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: "#2a2a2a" }}>
      <RifaHeader />
      <RifaContent
        quantidade={quantidade}
        setQuantidade={setQuantidade}
        isProcessing={isProcessing}
        valorTotal={valorTotal}
        onParticipate={onParticipate}
        onPromocaoClick={onPromocaoClick}
      />
      <RifaFooter />
    </div>
  );
};

export default RifaCard;