import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { TranslationProvider } from '@/contexts/TranslationContext';

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MarocUp - Inspirer, Connecter, Innover | 19-20 Décembre 2025, Rabat',
  description: 'MarocUp est un événement dédié aux startups early-stage fondées par des Marocains. Rejoignez-nous pour 2 jours d\'accélération intensive avec mentoring personnalisé, concours de pitch & récompense et networking.',
  keywords: 'startup Morocco, early-stage, Moroccan diaspora, pitch competition, mentoring, Rabat, entrepreneurship',
  // Next.js détecte automatiquement src/app/icon.png
  // On peut aussi spécifier explicitement pour plus de contrôle
  icons: {
    icon: [
      { url: '/marocup-icon.png', sizes: 'any' },
      { url: '/icon.png', sizes: 'any' },
    ],
    apple: '/marocup-icon.png',
    shortcut: '/marocup-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <link rel="icon" href="/marocup-icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/marocup-icon.png" />
      </head>
      <body className={poppins.className}>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}