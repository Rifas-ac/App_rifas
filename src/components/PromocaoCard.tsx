import React from "react";

interface PromocaoCardProps {
  onPromocaoClick: () => void;
}

const PromocaoCard: React.FC<PromocaoCardProps> = ({ onPromocaoClick }) => {
  return (
    <div className="rounded-xl p-4 bg-gray-900">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white">Promoção</h3>
        <span className="text-sm text-white">Compre mais barato!</span>
      </div>
      <button
        onClick={onPromocaoClick}
        className="w-full text-center py-3 rounded-lg font-bold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-xl bg-green-600">
        <span className="font-extrabold text-lg text-white">10</span> por
        <span className="font-extrabold text-lg text-white"> R$ 37,90</span>
      </button>
    </div>
  );
};

export default PromocaoCard;
