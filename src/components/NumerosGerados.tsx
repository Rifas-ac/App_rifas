import React from "react";
import { X } from "lucide-react";

interface NumerosGeradosProps {
  numerosGerados: string[];
  quantidade: number;
  valorTotal: number;
  onReset: () => void;
}

const NumerosGerados: React.FC<NumerosGeradosProps> = ({ numerosGerados, quantidade, valorTotal, onReset }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-white">Seus Números da Sorte</h3>
        <button
          onClick={onReset}
          className="transition-all text-sm flex items-center gap-1 hover:scale-105"
          style={{ color: "#ff4444" }}>
          <X className="w-4 h-4" />
          Nova compra
        </button>
      </div>

      <div
        className="rounded-xl p-4"
        style={{
          background: "#1a1a1a",
        }}>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {numerosGerados.map((numero, index) => (
            <div
              key={index}
              className="text-center py-2 px-3 rounded-lg font-bold text-sm transform hover:scale-105 transition-all"
              style={{
                background: "#0ae477",
                color: "white",
              }}>
              {numero}
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-white">
          <p className="font-medium">Total: {quantidade} números</p>
          <p className="text-xs text-gray-400">
            Valor pago: <span style={{ color: "#0ae477" }}>R$ {valorTotal.toFixed(2).replace(".", ",")}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NumerosGerados;
