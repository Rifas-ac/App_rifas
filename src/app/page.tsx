"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface RifaCard {
  id: string;
  titulo: string;
  imagemUrl: string | null;
  premio: string;
  ativa: boolean;
  descricao: string;
}

export default function HomePage() {
  const router = useRouter();
  const [rifas, setRifas] = useState<RifaCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRifas = async () => {
      try {
        const response = await fetch("/api/rifas");
        if (!response.ok) throw new Error("Falha ao carregar rifas");
        const data = await response.json();

        // Mapear rifas com status e ORDENAR: ativas primeiro
        const rifasComStatus: RifaCard[] = data
          .map((r: any) => ({
            id: r.id,
            titulo: r.titulo,
            imagemUrl: r.imagemUrl,
            premio: r.premio,
            ativa: r.status === "ativa",
            descricao: r.descricao
          }))
          .sort((a: RifaCard, b: RifaCard) => {
            // Rifas ativas primeiro
            if (a.ativa && !b.ativa) return -1;
            if (!a.ativa && b.ativa) return 1;
            return 0;
          });

        setRifas(rifasComStatus);
      } catch (err) {
        console.error("Erro ao carregar rifas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRifas();
  }, []);

  const handleParticipar = (rifa: RifaCard) => {
    // Redirecionar para a página específica de cada carro
    if (rifa.titulo.includes("Gol")) {
      router.push(`/rifas/gol`);
    } else if (rifa.titulo.includes("Chevette")) {
      router.push(`/rifas/chevette`);
    } else {
      // Fallback para a página genérica
      router.push(`/rifas/ativa?id=${rifa.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">Carregando rifas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Botão de Login - Bem no topo */}
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => router.push('/login')}
          className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white p-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 flex items-center gap-2 group"
          title="Fazer Login"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="hidden md:inline-block text-sm font-semibold pr-2">Login</span>
        </button>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Banner de Boas-Vindas */}
        <div className="text-center mb-16 px-4">
          <div className="inline-block mb-6">
            <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 bg-clip-text text-transparent mb-2 animate-pulse">
              Bem-vindo!
            </h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🎉 Participe de um Sorteio
          </h2>
          <p className="text-orange-400 text-base md:text-lg font-semibold">
            Escolha seu sorteio e boa sorte! 🍀
          </p>
        </div>

        {/* Divider decorativo */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <div className="h-1 w-20 bg-gradient-to-r from-transparent to-orange-500 rounded"></div>
          <span className="text-orange-500 text-2xl">⭐</span>
          <div className="h-1 w-20 bg-gradient-to-l from-transparent to-orange-500 rounded"></div>
        </div>

        {/* Grid de rifas - Uma coluna, cards mais quadrados */}
        <div className="max-w-md mx-auto space-y-8">
          {rifas.map((rifa) => (
            <div
              key={rifa.id}
              className={`
                relative overflow-hidden rounded-xl shadow-xl transition-all duration-300
                ${rifa.ativa
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 hover:scale-105 hover:shadow-orange-500/50'
                  : 'bg-gray-800/50 opacity-70'
                }
              `}
            >
              {/* Badge de Status */}
              {rifa.ativa ? (
                <div className="absolute top-3 right-3 z-10 bg-green-500 text-white font-bold px-3 py-1 rounded-full text-xs shadow-lg">
                  ✅ Sorteio em Andamento
                </div>
              ) : (
                <div className="absolute top-3 right-3 z-10 bg-yellow-500 text-black font-bold px-3 py-1 rounded-full text-xs shadow-lg">
                  ⏰ Em Breve
                </div>
              )}

              {/* Imagem do carro - Mais quadrada */}
              <div className={`relative h-64 ${!rifa.ativa && 'grayscale'}`}>
                {rifa.imagemUrl ? (
                  <Image
                    src={rifa.imagemUrl.split(',')[0].trim()}
                    alt={rifa.titulo}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <span className="text-5xl">🚗</span>
                  </div>
                )}
                {/* Overlay gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              </div>

              {/* Conteúdo do card - Compacto */}
              <div className="p-4">
                <h2 className={`text-2xl font-bold mb-1 ${rifa.ativa ? 'text-white' : 'text-gray-400'}`}>
                  {rifa.titulo}
                </h2>
                <p className={`text-base mb-3 flex items-center gap-2 ${rifa.ativa ? 'text-orange-400' : 'text-gray-500'}`}>
                  <span className="text-xl">🏆</span>
                  {rifa.premio}
                </p>

                {/* Descrição */}
                {rifa.descricao && (
                  <p className={`text-sm mb-4 line-clamp-2 ${rifa.ativa ? 'text-gray-300' : 'text-gray-500'}`}>
                    {rifa.descricao}
                  </p>
                )}

                {/* Botão */}
                <button
                  onClick={() => rifa.ativa && handleParticipar(rifa)}
                  disabled={!rifa.ativa}
                  className={`
                    w-full py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 transform
                    ${rifa.ativa
                      ? 'bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white shadow-lg hover:shadow-orange-500/50 hover:scale-105'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {rifa.ativa ? 'Participar Agora' : 'Em Breve'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mensagem se não houver rifas */}
        {rifas.length === 0 && (
          <div className="text-center py-20">
            <h2 className="text-white text-2xl mb-2">Nenhuma rifa disponível</h2>
            <p className="text-gray-400">Em breve teremos novidades incríveis!</p>
          </div>
        )}

        {/* Informações de pagamento - FINAL DA PÁGINA */}
        <div className="text-center mt-16 mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-1 w-20 bg-gradient-to-r from-transparent to-orange-500 rounded"></div>
            <span className="text-orange-500 text-2xl">⭐</span>
            <div className="h-1 w-20 bg-gradient-to-l from-transparent to-orange-500 rounded"></div>
          </div>
          <div className="space-y-3">
            <p className="text-gray-300 text-lg">
              💳 Pagamento fácil via PIX
            </p>
            <p className="text-gray-300 text-lg">
              🎫 Números instantâneos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
