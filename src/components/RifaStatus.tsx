import React from "react";
import { ShoppingCart, Check } from "lucide-react";

interface RifaStatusProps {
  showSuccess: boolean;
}

const RifaStatus: React.FC<RifaStatusProps> = ({ showSuccess }) => {
  return (
    <div className="p-4 border-b border-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-white" />
          <span className="font-medium text-white">Meus títulos</span>
        </div>
        {showSuccess && (
          <div className="flex items-center gap-1 text-white">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">Compra realizada!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default RifaStatus;
