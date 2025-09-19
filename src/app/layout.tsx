import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configuração da fonte Inter do Google Fonts
// A fonte será otimizada automaticamente pelo Next.js
const inter = Inter({ subsets: ["latin"] });

// Configuração dos metadados que aparecerão no <head> da página
export const metadata: Metadata = {
  // Título que aparece na aba do navegador
  title: "Garagem VW - Rifa Gol LS 1986",

  // Descrição para SEO e compartilhamento
  description: "Participe da rifa e concorra a um Gol LS 1986. Números a partir de R$ 3,99!",

  // Palavras-chave para SEO
  keywords: ["rifa", "Mercedes", "AMG", "C300", "sorteio", "carro", "prêmio"],

  // Configurações para redes sociais (Open Graph)
  openGraph: {
    title: "Garagem VW - Rifa Gol LS 1986",
    description: "Participe da rifa e concorra a um Gol LS 1986. Números a partir de R$ 3,99!",
    type: "website",
    locale: "pt_BR",
  },

  // Configurações para Twitter
  twitter: {
    card: "summary_large_image",
    title: "Garagem VW - Rifa Gol LS 1986",
    description: "Participe da rifa e concorra a um Gol LS 1986. Números a partir de R$ 3,99!",
  },
  // Configurações para PWA (Progressive Web App)

  // Configurações de ícones
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
// COMPONENTE DE LAYOUT RAIZ
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className={inter.className} suppressHydrationWarning={true}>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}