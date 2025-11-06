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
  icons: {
    icon: '/favicon-marocup.png',
    shortcut: '/favicon-marocup.png',
    apple: '/favicon-marocup.png',
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
        <link rel="icon" type="image/png" href="/favicon-marocup.png?v=3" />
        <link rel="shortcut icon" type="image/png" href="/favicon-marocup.png?v=3" />
        <link rel="apple-touch-icon" href="/favicon-marocup.png?v=3" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body className={poppins.className}>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}