import type { Metadata } from "next";
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

  // Configurações do viewport para responsividade
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },

  // Configurações de tema para dispositivos móveis
  themeColor: "#f97316",

  // Configurações para PWA (Progressive Web App)
  manifest: "/manifest.json",

  // Configurações de ícones
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};
// COMPONENTE DE LAYOUT RAIZ
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Meta tags adicionais que podem ser necessárias */}
        <meta charSet="utf-8" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Preconnect para otimização de carregamento */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* DNS prefetch para melhor performance */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      </head>

      {/* CORPO DA PÁGINA (BODY) */}
      <body className={inter.className}>
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
