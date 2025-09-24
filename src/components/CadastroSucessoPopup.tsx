import React from 'react';
import { CheckCircle, X } from 'lucide-react';

interface CadastroSucessoPopupProps {
  onClose: () => void;
}

const CadastroSucessoPopup: React.FC<CadastroSucessoPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={24} />
        </button>
        <div className="flex justify-center mb-4">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-4">Cadastro Realizado!</h2>
        <p className="text-gray-400 mb-6">Seu cadastro foi efetuado com sucesso. Agora você já pode fazer login na plataforma.</p>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition"
        >
          Fazer Login
        </button>
      </div>
    </div>
  );
};

export default CadastroSucessoPopup;
