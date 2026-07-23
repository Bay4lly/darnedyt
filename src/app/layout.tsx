import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/components/providers/LanguageProvider';

export const metadata: Metadata = {
  title: 'DarNed Sponsorship & Contact Hub | @DarNedYt',
  description: 'Official sponsorship portal and contact hub for YouTube Minecraft content creator DarNed (@DarNedYt, 385,000+ subscribers). Submit inquiries, request custom quotes, and partner on viral YouTube Shorts & gameplay integrations.',
  keywords: ['DarNed', 'DarNedYt', 'Minecraft YouTuber', 'Sponsorship Hub', 'YouTube Shorts Integration', 'Gaming Collab'],
  authors: [{ name: 'DarNed Team', url: 'https://darned.yt' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://darned.yt'),
  openGraph: {
    title: 'DarNed Sponsorship & Contact Hub',
    description: 'Partner with Minecraft creator DarNed for high-engagement YouTube integrations.',
    url: 'https://darned.yt',
    siteName: 'DarNed Sponsorship Hub',
    images: [
      {
        url: '/images/banner.svg',
        width: 1200,
        height: 400,
        alt: 'DarNed Sponsorship Hub',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DarNed Sponsorship Hub',
    description: 'Reach 385,000+ gaming enthusiasts with DarNed YouTube Shorts & videos.',
    images: ['/images/banner.svg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-foreground antialiased selection:bg-brand-purple selection:text-white">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
