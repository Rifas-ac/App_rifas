import React from "react";
import { Minus, Plus } from "lucide-react";

interface QuantidadeSelectorProps {
  quantidade: number;
  setQuantidade: (valor: number) => void;
}

const QuantidadeSelector: React.FC<QuantidadeSelectorProps> = ({ quantidade, setQuantidade }) => {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-white">Selecione a quantidade</h3>

      {/* Botões de Quantidade Rápida */}
      <div className="grid grid-cols-3 gap-2">
        {[5, 10, 30].map((qtd) => (
          <button
            key={qtd}
            onClick={() => setQuantidade(qtd)}
            className={`py-2 px-4 rounded-lg font-medium transition-all hover:scale-105`}
            style={{
              backgroundColor: quantidade === qtd ? "#FF8C00" : "#334155",
              color: "white",
            }}>
            +<span className="font-bold">{qtd}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {[50, 100, 300].map((qtd) => (
          <button
            key={qtd}
            onClick={() => setQuantidade(qtd)}
            className={`py-2 px-4 rounded-lg font-medium transition-all hover:scale-105`}
            style={{
              backgroundColor: quantidade === qtd ? "#FF8C00" : "#334155",
              color: "white",
            }}>
            +<span className="font-bold">{qtd}</span>
          </button>
        ))}
      </div>

      {/* Controle Manual de Quantidade */}
      <div
        className="flex items-center justify-between rounded-lg p-3"
        style={{
          background: "#0f172a",
        }}>
        <button
          onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
          style={{
            background: "#0f172a",
            color: "white",
          }}
          disabled={quantidade <= 3}>
          <Minus className="w-4 h-4" />
        </button>

        <input
          type="number"
          value={quantidade}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (!isNaN(value)) {
              setQuantidade(value);
            }
          }}
          onBlur={() => {
            if (quantidade < 3) {
              setQuantidade(3);
            }
          }}
          className="w-16 text-center bg-transparent font-bold text-xl text-white focus:outline-none"
          min="3"
        />

        <button
          onClick={() => setQuantidade(quantidade + 1)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
          style={{
            background: "#0f172a",
            color: "white",
          }}>
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default QuantidadeSelector;
