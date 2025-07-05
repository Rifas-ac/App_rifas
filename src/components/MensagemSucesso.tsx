import React from "react";
import { Check } from "lucide-react";

const MensagemSucesso: React.FC = () => {
  return (
    <div
      className="rounded-xl p-4 text-center"
      style={{
        background: "#1a1a1a",
      }}>
      <div className="flex items-center justify-center gap-2 mb-2">
        <Check className="w-5 h-5" style={{ color: "#0ae477" }} />
        <span className="font-semibold text-white">Parabéns!</span>
      </div>
      <p className="text-sm text-gray-400">Seus números foram gerados com sucesso! Boa sorte no sorteio!</p>
    </div>
  );
};

export default MensagemSucesso;
