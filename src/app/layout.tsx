import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Configuração da fonte Inter do Google Fonts
// A fonte será otimizada automaticamente pelo Next.js
const inter = Inter({ subsets: ['latin'] });

// Configuração dos metadados que aparecerão no <head> da página
export const metadata: Metadata = {
  // Título que aparece na aba do navegador
  title: 'Rifas AC - Sorteio de Carros',

  // Descrição para SEO e compartilhamento
  description: '🚗 Participe do Sorteio e Ganhe um Carro! Rifas com números da sorte, pagamento fácil via PIX. Compre sua rifa agora e concorra a prêmios incríveis!',

  // Palavras-chave para SEO
  keywords: ['sorteio de carros', 'rifa de carro', 'ganhar carro', 'sorteio', 'rifas', 'prêmios', 'concorrer', 'comprar rifa', 'números da sorte'],

  // Configurações para redes sociais (Open Graph)
  openGraph: {
    title: '🎉 Sorteio de Carros - Compre sua Rifa e Ganhe!',
    description: '🚗 Participe do maior sorteio! Números da sorte, pagamento via PIX e prêmios incríveis te esperando. Sua chance de ganhar um carro está aqui!',
    type: 'website',
    locale: 'pt_BR',
  },

  // Configurações para Twitter
  twitter: {
    card: 'summary_large_image',
    title: '🎉 Sorteio de Carros - Rifas AC',
    description: '🚗 Compre sua rifa e concorra a carros incríveis! Pagamento fácil via PIX.',
  },

  // Configurações de ícones
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png', sizes: '128x128' },
    ],
    shortcut: '/favicon.svg',
    apple: '/icon.png',
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
