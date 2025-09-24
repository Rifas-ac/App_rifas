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
      <div className="text-sm text-gray-400 mt-4">
        <h6 className="text-lg font-bold text-white mb-2">Informações:</h6>
        <ul className="list-disc list-inside space-y-2">
          <li>
            Gol LS 1986, motor AP 1.6 a álcool. Carro de coleção com placa preta, uma verdadeira raridade, com interior
            totalmente monocromático em ótimo estado.
          </li>
          <li>
            As taxas de transferência e qualquer custo de transporte para fora do Distrito Federal são de inteira
            responsabilidade do ganhador.
          </li>
          <li>A data do sorteio será divulgada posteriormente</li>
        </ul>
      </div>
    </div>
  );
};

export default RifaContent;
