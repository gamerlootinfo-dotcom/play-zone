import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PLAYZONE | Partiya Oyunları Platforması - İmposter',
  description: 'Dostlarınızla telefon üzərindən oynaya biləcəyiniz ən əyləncəli gizli rol və partiya oyunları platforması.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0b0e14',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎮</text></svg>" />
      </head>
      <body className="bg-game-dark text-white min-h-screen antialiased selection:bg-purple-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
