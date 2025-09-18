import React from "react";

interface BotaoParticiparProps {
  isProcessing: boolean;
  valorTotal: number;
  onParticipate: () => void;
}

const BotaoParticipar: React.FC<BotaoParticiparProps> = ({ isProcessing, valorTotal, onParticipate }) => {
  return (
    <button
      onClick={onParticipate}
      disabled={isProcessing}
      className={`w-full font-bold py-4 px-6 rounded-xl transition-all text-lg shadow-lg hover:shadow-xl transform hover:scale-105`}
      style={{
        backgroundColor: isProcessing ? "#1a1a1a" : "#FF8C00",
        color: "white",
        cursor: isProcessing ? "not-allowed" : "pointer",
      }}>
      {isProcessing ? (
        <span className="flex items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin border-white"></div>
          Processando...
        </span>
      ) : (
        <>
          Participar <span style={{ color: "#ffffff" }}>R$ {valorTotal.toFixed(2).replace(".", ",")}</span>
        </>
      )}
    </button>
  );
};

export default BotaoParticipar;
