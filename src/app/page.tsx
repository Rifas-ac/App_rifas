import Link from "next/link";
import { Gift, Trophy, Users } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#0f0e17" }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">🎯 Rifas Online</h1>
          <p className="text-xl text-gray-400">
            Sua sorte está aqui! Participe das melhores rifas com prêmios incríveis.
          </p>
        </header>

        {/* Cards de Rifas Ativas */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/rifas/ativa" className="group">
            <div className="rounded-2xl p-6 transition-all hover:scale-105" style={{ background: "#2a2a2a" }}>
              <div className="flex items-center gap-3 mb-4">
                <Gift className="w-8 h-8" style={{ color: "#0ae477" }} />
                <h3 className="text-xl font-bold text-white">Rifa Ativa</h3>
              </div>
              <p className="text-gray-400 mb-4">Carro do pai da isa</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">R$ 3,99</span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: "#0ae477", color: "white" }}>
                  ATIVA
                </span>
              </div>
            </div>
          </Link>

          <div className="rounded-2xl p-6 opacity-60" style={{ background: "#2a2a2a" }}>
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-gray-500" />
              <h3 className="text-xl font-bold text-gray-500">Em Breve</h3>
            </div>
            <p className="text-gray-500 mb-4">iPhone 15 Pro Max</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">R$ 2,99</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-600 text-gray-400">EM BREVE</span>
            </div>
          </div>

          <div className="rounded-2xl p-6 opacity-60" style={{ background: "#2a2a2a" }}>
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-gray-500" />
              <h3 className="text-xl font-bold text-gray-500">Mais Rifas</h3>
            </div>
            <p className="text-gray-500 mb-4">Várias opções disponíveis</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">Vários valores</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-600 text-gray-400">EM BREVE</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-gray-400">
          <p>© 2024 Rifas Online - Todos os direitos reservados</p>
        </footer>
      </div>
    </div>
  );
}
