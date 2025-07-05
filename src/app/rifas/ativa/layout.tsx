import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rifas - Participe e Ganhe",
  description: "Participe das rifas e concorra a prêmios incríveis",
};

export default function RifasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "#0f0e17" }}>
      {children}
    </div>
  );
}
