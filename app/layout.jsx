import { DM_Sans, Bricolage_Grotesque, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bricolage',
  weight: ['400', '500', '600', '700', '800'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  metadataBase: new URL('https://bigmacktrucking.com'),
  title: 'Big Mack Trucking LLC | 26ft Dock-High Freight & Logistics',
  description: 'Heavy-duty expedited dock-high freight carrier. 26ft Straight Box, Heavy-Duty Liftgate, Industrial Pallet Jack, TWIC Card Certified. USDOT# 3843409 • MC# 1398475. Dispatch: (516) 508-8078.',
  keywords: [
    'Big Mack Trucking LLC',
    'Omari Headley',
    'Expedited Freight',
    'Dock High Box Truck',
    '26ft Box Truck',
    'Liftgate Trucking',
    'TWIC Card Certified Carrier',
    'MC 1398475',
    'USDOT 3843409',
    'New York Freight',
    'Port Logistics'
  ],
  authors: [{ name: 'Omari Headley', url: 'mailto:Bigmacklogisticsa1@gmail.com' }],
  openGraph: {
    title: 'Big Mack Trucking LLC | Dedicated 3D Freight Power',
    description: '26ft Dock-High Straight Box • Heavy-Duty Liftgate • TWIC Card Certified • USDOT 3843409 • MC 1398475',
    siteName: 'Big Mack Trucking LLC',
    images: [
      {
        url: '/image/logo-transparent.png',
        width: 2048,
        height: 2048,
        alt: 'Big Mack Trucking LLC HD Emblem Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`dark scroll-smooth ${dmSans.variable} ${bricolageGrotesque.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        {/* Preload critical 3D GLB model so browser streams it immediately upon HTML delivery */}
        <link rel="preload" href="/models/truck.glb" as="fetch" crossOrigin="anonymous" />
        {/* Preload high-resolution brand logo emblem with high fetch priority */}
        <link rel="preload" href="/image/logo-transparent.png" as="image" fetchPriority="high" />
      </head>
      <body className="bg-[#08040C] text-slate-100 selection:bg-purple-600 selection:text-white min-h-screen antialiased font-sans">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
