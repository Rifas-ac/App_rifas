"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SucessoCompraPopupProps {
  isOpen: boolean;
  onClose: () => void;
  numerosGerados: number[];
  tituloRifa: string;
}

export default function SucessoCompraPopup({
  isOpen,
  onClose,
  numerosGerados,
  tituloRifa,
}: SucessoCompraPopupProps) {
  const [numerosVisiveis, setNumerosVisiveis] = useState<number[]>([]);
  const [mostrarTodos, setMostrarTodos] = useState(false);

  useEffect(() => {
    if (isOpen && numerosGerados.length > 0) {
      // Reset quando abrir
      setNumerosVisiveis([]);
      setMostrarTodos(false);

      // Mostra números um por um com delay
      numerosGerados.forEach((numero, index) => {
        setTimeout(() => {
          setNumerosVisiveis((prev) => [...prev, numero]);

          // Se for o último número, marca como completo
          if (index === numerosGerados.length - 1) {
            setTimeout(() => setMostrarTodos(true), 300);
          }
        }, index * 200); // 200ms entre cada número
      });
    }
  }, [isOpen, numerosGerados]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-gradient-to-br from-green-900 via-green-800 to-green-900 border-2 border-green-500">
        <div className="text-center space-y-6 p-6">
          {/* Ícone de sucesso animado */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              {/* Efeito de pulso */}
              <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
            </div>
          </div>

          {/* Título */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-2">
              🎉 Parabéns! Pagamento Aprovado!
            </h2>
            <p className="text-green-200 text-lg">
              Sua compra foi confirmada com sucesso!
            </p>
          </div>

          {/* Info da Rifa */}
          <div className="bg-black/30 rounded-xl p-4 border border-green-500/30">
            <p className="text-gray-300 text-sm mb-1">Você está participando de:</p>
            <p className="text-white font-bold text-xl">{tituloRifa}</p>
          </div>

          {/* Números Gerados */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">
              Aqui estão seus números da sorte:
            </h3>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 max-h-96 overflow-y-auto p-4 bg-black/20 rounded-xl">
              {numerosVisiveis.map((numero, index) => (
                <div
                  key={numero}
                  className="transform transition-all duration-500"
                  style={{
                    animation: `slideIn 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900 font-bold text-xl p-4 rounded-lg shadow-xl transform hover:scale-110 transition-transform duration-200 border-2 border-yellow-300">
                    {String(numero).padStart(4, "0")}
                  </div>
                </div>
              ))}
            </div>

            {!mostrarTodos && (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            )}
          </div>

          {/* Mensagem final */}
          {mostrarTodos && (
            <div className="bg-green-500/20 border border-green-500 rounded-xl p-4 animate-fade-in">
              <p className="text-white text-lg">
                ✨ Total de <span className="font-bold text-yellow-400">{numerosGerados.length}</span> número(s) adquirido(s)!
              </p>
              <p className="text-green-200 text-sm mt-2">
                Boa sorte! Você pode ver seus números a qualquer momento na página de Status.
              </p>
            </div>
          )}

          {/* Botão de fechar */}
          {mostrarTodos && (
            <button
              onClick={onClose}
              className="w-full bg-white hover:bg-gray-100 text-green-900 font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Fechar e ver meus números
            </button>
          )}
        </div>

        <style jsx>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(-20px) scale(0.8);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .animate-fade-in {
            animation: fade-in 0.5s ease-out;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
