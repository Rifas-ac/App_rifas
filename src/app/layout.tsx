import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rifas Online - Sua sorte está aqui",
  description: "Plataforma de rifas online com prêmios incríveis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
