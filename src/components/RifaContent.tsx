import React from "react";
import RifaStatus from "./RifaStatus";
import PromocaoCard from "./PromocaoCard";
import QuantidadeSelector from "./QuantidadeSelector";
import NumerosGerados from "./NumerosGerados";
import BotaoParticipar from "./emails/BotaoParticipar";
import MensagemSucesso from "./MensagemSucesso";

interface RifaContentProps {
  quantidade: number;
  setQuantidade: (valor: number) => void;
  showNumbers: boolean;
  numerosGerados: string[];
  isProcessing: boolean;
  showSuccess: boolean;
  valorTotal: number;
  onParticipate: () => void;
  onReset: () => void;
  onPromocaoClick: () => void; // Nova prop
}

const RifaContent: React.FC<RifaContentProps> = ({
  quantidade,
  setQuantidade,
  showNumbers,
  numerosGerados,
  isProcessing,
  showSuccess,
  valorTotal,
  onParticipate,
  onReset,
  onPromocaoClick, // Nova prop
}) => {
  return (
    <>
      <RifaStatus showSuccess={showSuccess} />

      <div className="p-4 space-y-4">
        <PromocaoCard onPromocaoClick={onPromocaoClick} />

        {!showNumbers && <QuantidadeSelector quantidade={quantidade} setQuantidade={setQuantidade} />}

        {showNumbers && (
          <NumerosGerados
            numerosGerados={numerosGerados}
            quantidade={quantidade}
            valorTotal={valorTotal}
            onReset={onReset}
          />
        )}

        {!showNumbers && (
          <BotaoParticipar isProcessing={isProcessing} valorTotal={valorTotal} onParticipate={onParticipate} />
        )}

        {showSuccess && <MensagemSucesso />}
      </div>
    </>
  );
};

export default RifaContent;
