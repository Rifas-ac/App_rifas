import React from "react";
import PromocaoCard from "./PromocaoCard";
import QuantidadeSelector from "./QuantidadeSelector";
import BotaoParticipar from "./emails/BotaoParticipar";

interface RifaContentProps {
  quantidade: number;
  setQuantidade: (valor: number) => void;
  isProcessing: boolean;
  valorTotal: number;
  onParticipate: () => void;
  onPromocaoClick: () => void;
}

const RifaContent: React.FC<RifaContentProps> = ({
  quantidade,
  setQuantidade,
  isProcessing,
  valorTotal,
  onParticipate,
  onPromocaoClick,
}) => {
  return (
    <div className="p-4 space-y-4">
      <PromocaoCard onPromocaoClick={onPromocaoClick} />
      <QuantidadeSelector quantidade={quantidade} setQuantidade={setQuantidade} />
      <BotaoParticipar isProcessing={isProcessing} valorTotal={valorTotal} onParticipate={onParticipate} />
    </div>
  );
};

export default RifaContent;