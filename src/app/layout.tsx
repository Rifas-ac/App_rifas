import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Configuração da fonte Inter do Google Fonts
// A fonte será otimizada automaticamente pelo Next.js
const inter = Inter({ subsets: ['latin'] });

// Configuração dos metadados que aparecerão no <head> da página
export const metadata: Metadata = {
  // Título que aparece na aba do navegador
  title: 'Rifas AC - Concorra a prêmios incríveis',

  // Descrição para SEO e compartilhamento
  description: 'Concorra a Gol LS 1986 e ele Pode Ser Seu',

  // Palavras-chave para SEO
  keywords: ['rifa', 'sorteio', 'prêmios', 'concorrer', 'ganhar'],

  // Configurações para redes sociais (Open Graph)
  openGraph: {
    title: 'Rifas AC - Participe e Ganhe',
    description: 'Concorra a Gol LS 1986 e ele Pode Ser Seu',
    type: 'website',
    locale: 'pt_BR',
  },

  // Configurações para Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Rifas AC - Participe e Ganhe',
    description: 'Concorra a Gol LS 1986 e ele Pode Ser Seu',
  },

  // Configurações de ícones
  icons: {
    icon: '/rifa-gol/logo/logo-principal.png',
    shortcut: '/rifa-gol/logo/logo-principal.png',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f0e17', // Cor principal do tema escuro
  width: 'device-width',
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
