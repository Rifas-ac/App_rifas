import React from "react";

const PromocaoCard: React.FC = () => {
  return (
    <div className="rounded-xl p-4" style={{ background: "#1a1a1a" }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-white">Promoção</h3>
        <span className="text-sm text-white">Compre mais barato!</span>
      </div>
      <div
        className="text-center py-3 rounded-lg font-bold shadow-lg"
        style={{
          background: "#0ae477",
        }}>
        <span className="font-extrabold text-lg text-white">10</span> por
        <span className="font-extrabold text-lg text-white"> R$ 39,90</span>
      </div>
    </div>
  );
};
export default PromocaoCard;
