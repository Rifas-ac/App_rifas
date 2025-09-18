import React from "react";
import { Gift } from "lucide-react";

const RifaFooter: React.FC = () => {
  return (
    <div className="p-4 border-t border-gray-600">
      <div className="flex items-center gap-3">
        <Gift className="w-5 h-5" style={{ color: "#0ae477" }} />
        <div>
          <p className="text-sm text-gray-400">Prêmio dessa campanha</p>
          <p className="font-medium text-white">Gol LS 1986</p>
        </div>
      </div>
    </div>
  );
};

export default RifaFooter;