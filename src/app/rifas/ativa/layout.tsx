import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "🎉 Sorteio de Carros - Compre sua Rifa e Ganhe!",
  description: "🚗 Participe do sorteio e ganhe um carro! Números da sorte disponíveis, pagamento fácil via PIX. Compre agora e concorra a prêmios incríveis!",
  openGraph: {
    title: "🎉 Sorteio de Carros - Rifas AC",
    description: "🚗 Sua chance de ganhar um carro! Compre sua rifa com pagamento via PIX e concorra agora.",
    type: "website",
  },
};

export default function RifasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#0f0e17" }}>
      {children}
    </div>
  );
}
