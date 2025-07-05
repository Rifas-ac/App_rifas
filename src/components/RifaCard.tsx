"use client";

import React from "react";
import RifaHeader from "./RifaHeader";
import RifaContent from "./RifaContent";
import RifaFooter from "./RifaFooter";
import NotaInformativa from "./NotaInformativa";

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
}) => {
  return (
    <>
      <div style={{ background: "#2a2a2a" }} className="rounded-2xl overflow-hidden shadow-2xl">
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
        />

        <RifaFooter />
      </div>

      <NotaInformativa showNumbers={showNumbers} />
    </>
  );
};

export default RifaCard;
