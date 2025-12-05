"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface LoginRequiredPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredPopup({ isOpen, onClose }: LoginRequiredPopupProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/cliente?action=login");
  };

  const handleCadastro = () => {
    onClose();
    router.push("/cliente?action=cadastro");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border-2 border-orange-500/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-white mb-4">
            🔒 Login Necessário
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 p-4">
          <div className="text-center">
            <p className="text-gray-300 text-lg mb-2">
              Para comprar números da rifa, você precisa estar logado!
            </p>
            <p className="text-gray-400 text-sm">
              Faça login ou crie sua conta agora mesmo
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="text-lg">✓ Já tenho uma conta</span>
            </button>

            <button
              onClick={handleCadastro}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="text-lg">➕ Criar nova conta</span>
            </button>
          </div>

          <div className="text-center pt-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
