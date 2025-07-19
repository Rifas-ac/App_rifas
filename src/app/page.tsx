"use client";
import React, { useState } from "react";
import { ShoppingCart, Gift, Minus, Plus } from "lucide-react";

export default function Home() {
  // Estado para controlar a quantidade de números selecionados
  // Valor inicial é 3 (mínimo obrigatório)
  const [quantidade, setQuantidade] = useState(3);

  // Valor fixo de cada número da rifa
  const valorUnitario = 3.99;

  // Cálculo do valor total baseado na quantidade selecionada
  const valorTotal = quantidade * valorUnitario;

  // Função para gerar números aleatórios para a rifa
  const gerarNumerosAleatorios = (qtd: number) => {
    const numeros = [];
    for (let i = 0; i < qtd; i++) {
      // Gera números aleatórios entre 1 e 100000
      numeros.push(Math.floor(Math.random() * 100000) + 1);
    }
    return numeros;
  };

  // Função para processar a participação na rifa
  const handleParticipate = () => {
    const numerosGerados = gerarNumerosAleatorios(quantidade);
    console.log("Números gerados:", numerosGerados);
    alert(`Compra realizada! Números gerados: ${numerosGerados.join(", ")}`);
  };

  // RENDERIZAÇÃO DA PÁGINA PRINCIPAL

  return (
    // Container principal com fundo gradiente escuro
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Container centralizado com largura máxima para mobile */}
      <div className="max-w-md mx-auto">
        {/* CARD PRINCIPAL DA RIFA */}

        <div className="bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          {/* SEÇÃO DA IMAGEM DO PRÊMIO */}

          <div className="relative">
            {/* Container da imagem do prêmio (Mercedes AMG C300) */}
            <div className="w-full h-48 bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
              <div className="text-center text-white">
                {/* Emoji representando o carro */}
                <div className="text-4xl mb-2">🏎️</div>
                {/* Nome do prêmio */}
                <div className="text-lg font-bold">
                  Gol LS 1986 motor AP 1.6 álcool, carro de coleção placa preta. Raridade interior monocromático.
                </div>
                {/* Texto indicativo */}
                <div className="text-sm opacity-75">Imagem do prêmio</div>
              </div>
            </div>

            {/* Overlay gradiente sobre a imagem */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />

            {/* Informações sobrepostas na imagem */}
            <div className="absolute bottom-4 left-4 right-4">
              {/* Título principal da rifa */}
              <h2 className="text-xl font-bold text-white mb-1">Gol LS 1986 Pode Ser Sua</h2>
              {/* Informação sobre o sorteio */}
              <p className="text-sm text-gray-300">Sorteio: Loteria Federal</p>
            </div>

            {/* Badge de preço no canto superior direito */}
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              APENAS R$ 3,99 🔥
            </div>
          </div>

          {/* SEÇÃO "MEUS TÍTULOS" */}

          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Ícone do carrinho de compras */}
                <ShoppingCart className="w-5 h-5 text-white" />
                {/* Texto "Meus títulos" */}
                <span className="text-white font-medium">Meus títulos</span>
              </div>
            </div>
          </div>

          {/* SEÇÃO PRINCIPAL DE COMPRA */}

          <div className="p-4 space-y-4">
            {/* CARD DE PROMOÇÃO */}

            <div className="bg-gray-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                {/* Título da promoção */}
                <h3 className="text-white font-semibold">Promoção</h3>
                {/* Texto explicativo */}
                <span className="text-sm text-gray-300">Compre mais barato!</span>
              </div>
              {/* Destaque da promoção */}
              <div className="bg-green-500 text-white text-center py-3 rounded-lg font-bold">10 por R$ 37,90</div>
            </div>

            {/* SEÇÃO DE SELEÇÃO DE QUANTIDADE */}

            <div className="space-y-3">
              {/* Título da seção */}
              <h3 className="text-white font-semibold">Selecione a quantidade</h3>

              {/* PRIMEIRA LINHA DE BOTÕES DE QUANTIDADE RÁPIDA */}

              <div className="grid grid-cols-3 gap-2">
                {/* Botões para seleção rápida: +5, +10, +30 */}
                {[5, 10, 30].map((qtd) => (
                  <button
                    key={qtd}
                    onClick={() => setQuantidade(qtd)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      quantidade === qtd
                        ? "bg-orange-500 text-white" // Estilo quando selecionado
                        : "bg-gray-700 hover:bg-gray-600 text-white" // Estilo padrão
                    }`}>
                    +{qtd}
                  </button>
                ))}
              </div>

              {/* SEGUNDA LINHA DE BOTÕES DE QUANTIDADE RÁPIDA */}

              <div className="grid grid-cols-3 gap-2">
                {/* Botões para seleção rápida: +50, +100, +300 */}
                {[50, 100, 300].map((qtd) => (
                  <button
                    key={qtd}
                    onClick={() => setQuantidade(qtd)}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                      quantidade === qtd
                        ? "bg-orange-500 text-white" // Estilo quando selecionado
                        : "bg-gray-700 hover:bg-gray-600 text-white" // Estilo padrão
                    }`}>
                    +{qtd}
                  </button>
                ))}
              </div>

              {/* CONTROLE MANUAL DE QUANTIDADE (+ / -) */}
              <div className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                {/* Botão para diminuir quantidade */}
                <button
                  onClick={() => setQuantidade(Math.max(3, quantidade - 1))}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    quantidade <= 3
                      ? "bg-gray-600 cursor-not-allowed opacity-50" // Desabilitado no mínimo
                      : "bg-gray-600 hover:bg-gray-500" // Habilitado
                  }`}
                  disabled={quantidade <= 3}>
                  <Minus className="w-4 h-4 text-white" />
                </button>

                {/* Display da quantidade atual */}
                <span className="text-white font-semibold text-lg">{quantidade}</span>

                {/* Botão para aumentar quantidade */}
                <button
                  onClick={() => setQuantidade(quantidade + 1)}
                  className="w-8 h-8 bg-gray-600 hover:bg-gray-500 rounded-lg flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* BOTÃO PRINCIPAL DE PARTICIPAÇÃO */}

            <button
              onClick={handleParticipate}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-colors text-lg transform hover:scale-105 active:scale-95">
              Participar R$ {valorTotal.toFixed(2).replace(".", ",")}
            </button>
          </div>

          {/* SEÇÃO DE INFORMAÇÕES DO PRÊMIO */}

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3">
              {/* Ícone de presente */}
              <Gift className="w-5 h-5 text-orange-400" />
              <div>
                {/* Texto explicativo */}
                <p className="text-gray-300 text-sm">Prêmio dessa campanha</p>
                {/* Nome completo do prêmio */}
                <p className="text-white font-medium">
                  Gol LS 1986 motor AP 1.6 álcool, carro de coleção placa preta. Raridade interior monocromático.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CARD DE INFORMAÇÕES SOBRE NÚMEROS ALEATÓRIOS */}

        <div className="mt-4 p-3 bg-gray-800 rounded-lg">
          <p className="text-gray-300 text-sm text-center">
            Os números serão gerados automaticamente e aleatoriamente após a compra
          </p>
        </div>

        {/* CARD DE DETALHES DA COMPRA */}

        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          {/* Título da seção */}
          <h4 className="text-white font-semibold mb-2">Detalhes da compra:</h4>
          {/* Lista de informações */}
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
