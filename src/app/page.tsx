"use client";
import { useState } from "react";
import { ShoppingCart, Gift, Minus, Plus } from "lucide-react";
import CarrosselGol from "@/components/CarrosselGol";

export default function Home() {
  const [quantidade, setQuantidade] = useState(3);
  const valorUnitario = 3.99;
  const valorTotal = quantidade * valorUnitario;

  const gerarNumerosAleatorios = (qtd: number) => {
    const numeros = [];
    for (let i = 0; i < qtd; i++) {
      numeros.push(Math.floor(Math.random() * 100000) + 1);
    }
    return numeros;
  };

  const handleParticipate = () => {
    const numerosGerados = gerarNumerosAleatorios(quantidade);
    console.log("Números gerados:", numerosGerados);
    alert(`Compra realizada! Números gerados: ${numerosGerados.join(", ")}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {/* O header com o AvatarMenu foi removido daqui */}
        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative">
            <CarrosselGol />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-xl font-bold text-white mb-1">Gol LS 1986 Pode Ser Sua</h2>
              <p className="text-sm text-gray-300">Sorteio: Loteria Federal</p>
            </div>
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              APENAS R$ 3,99 🔥
            </div>
          </div>

          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Meus títulos</span>
            </div>
          </div>

          <div className="p-4 space-y-4">
            <div className="space-y-3">
              <h3 className="text-white font-semibold">Selecione a quantidade</h3>
              <div className="grid grid-cols-3 gap-2">
                {[5, 10, 30].map((qtd) => (
                  <button
                    key={qtd}
                    onClick={() => setQuantidade(qtd)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      quantidade === qtd ? "bg-orange-500 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}>
                    +{qtd}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[50, 100, 300].map((qtd) => (
                  <button
                    key={qtd}
                    onClick={() => setQuantidade(qtd)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      quantidade === qtd ? "bg-orange-500 text-white" : "bg-gray-700 hover:bg-gray-600 text-white"
                    }`}>
                    +{qtd}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                <button
                  onClick={() => setQuantidade(Math.max(3, quantidade - 1))}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    quantidade <= 3 ? "bg-gray-600 cursor-not-allowed opacity-50" : "bg-gray-600 hover:bg-gray-500"
                  }`}
                  disabled={quantidade <= 3}>
                  <Minus className="w-4 h-4 text-white" />
                </button>
                <span className="text-white font-semibold text-lg">{quantidade}</span>
                <button
                  onClick={() => setQuantidade(quantidade + 1)}
                  className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            <button
              onClick={handleParticipate}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg transform hover:scale-105 active:scale-95">
              Participar R$ {valorTotal.toFixed(2).replace(".", ",")}
            </button>
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
              <Gift className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-gray-300 text-sm">Prêmio dessa campanha</p>
                <p className="text-white font-medium">
                  Gol LS 1986 motor AP 1.6 álcool, carro de coleção placa preta. Raridade interior monocromático.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <p className="text-gray-300 text-sm text-center">
            Os números serão gerados automaticamente e aleatoriamente após a compra
          </p>
        </div>

        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h4 className="text-white font-semibold mb-2">Detalhes da compra:</h4>
          <div className="space-y-1 text-sm text-gray-300">
            <p>• Quantidade: {quantidade} números</p>
            <p>• Valor unitário: R$ {valorUnitario.toFixed(2).replace(".", ",")}</p>
            <p>• Total: R$ {valorTotal.toFixed(2).replace(".", ",")}</p>
            <p>• Mínimo obrigatório: 3 números</p>
          </div>
        </div>
      </div>
    </div>
  );
}
