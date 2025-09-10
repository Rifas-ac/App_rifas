import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Configuração da fonte Inter do Google Fonts
// A fonte será otimizada automaticamente pelo Next.js
const inter = Inter({ subsets: ["latin"] });

// Configuração dos metadados que aparecerão no <head> da página
export const metadata: Metadata = {
  // Título que aparece na aba do navegador
  title: "AMG Power - Rifa Mercedes C300",

  // Descrição para SEO e compartilhamento
  description: "Participe da rifa e concorra a uma Mercedes AMG C300. Números a partir de R$ 3,99!",

  // Palavras-chave para SEO
  keywords: ["rifa", "Mercedes", "AMG", "C300", "sorteio", "carro", "prêmio"],

  // Configurações para redes sociais (Open Graph)
  openGraph: {
    title: "AMG Power - Rifa Mercedes C300",
    description: "Participe da rifa e concorra a uma Mercedes AMG C300. Números a partir de R$ 3,99!",
    type: "website",
    locale: "pt_BR",
  },

  // Configurações para Twitter
  twitter: {
    card: "summary_large_image",
    title: "AMG Power - Rifa Mercedes C300",
    description: "Participe da rifa e concorra a uma Mercedes AMG C300. Números a partir de R$ 3,99!",
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
      <body className={inter.className}>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}

const carros = [
  { id: 1, nome: "Gol 1", imagem: "/rifa-gol/gol-1.png" },
  { id: 2, nome: "Gol 2", imagem: "/rifa-gol/gol-2.png" },
  { id: 3, nome: "Gol 3", imagem: "/rifa-gol/gol-3.png" },
  { id: 4, nome: "Gol 4", imagem: "/rifa-gol/gol-4.png" },
  { id: 5, nome: "Gol 5", imagem: "/rifa-gol/gol-5.png" },
  { id: 6, nome: "Gol 6", imagem: "/rifa-gol/gol-6.png" },
  { id: 7, nome: "Gol 7", imagem: "/rifa-gol/gol-7.png" },
  { id: 8, nome: "Gol 8", imagem: "/rifa-gol/gol-8.png" },
  { id: 9, nome: "Gol 9", imagem: "/rifa-gol/gol-9.png" },
  { id: 10, nome: "Gol 10", imagem: "/rifa-gol/gol-10.png" },
  { id: 11, nome: "Gol 11", imagem: "/rifa-gol/gol-11.png" },
  { id: 12, nome: "Gol 12", imagem: "/rifa-gol/gol-12.png" },
];
