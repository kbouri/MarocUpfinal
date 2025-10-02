import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MarocUp - Inspirer, Connecter, Innover | 19-20 Décembre 2025, Rabat',
  description: 'MarocUp est un événement dédié aux startups early-stage fondées par des Marocains. Rejoignez-nous pour 2 jours d\'accélération intensive avec mentoring personnalisé, concours de pitch & récompense et networking.',
  keywords: 'startup Morocco, early-stage, Moroccan diaspora, pitch competition, mentoring, Rabat, entrepreneurship',
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
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}