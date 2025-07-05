import React from "react";
import { Car } from "lucide-react";

const RifaHeader: React.FC = () => {
  return (
    <div className="relative">
      <div className="w-full h-48 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 flex items-center justify-center">
        <Car className="w-24 h-24 text-gray-400" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Informações do Prêmio */}
      <div className="absolute bottom-4 left-4 right-4">
        <h2 className="text-xl font-bold mb-1 text-white">AMG Power: A C300 Pode Ser Sua</h2>
        <p className="text-sm text-white">Sorteio: Loteria Federal</p>
      </div>

      {/* Badge de Preço */}
      <div
        className="absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-bold text-white"
        style={{ background: "#0ae477" }}>
        APENAS R$ 3,99 🔥
      </div>
    </div>
  );
};

export default RifaHeader;
