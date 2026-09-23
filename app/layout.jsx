import { Big_Shoulders_Display, Big_Shoulders_Stencil_Display, Overpass } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import 'lenis/dist/lenis.css';
import './globals.css';

// Display: condensed industrial grotesk, a cousin of the badge's squared wordmark.
const display = Big_Shoulders_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
});

// Stencil cut, used only for lettering painted inside the 3D world (bay numbers, floor marks).
const stencil = Big_Shoulders_Stencil_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-stencil',
  preload: false,
});

// Text + HUD: derived from Highway Gothic, the lettering on US road signs.
const text = Overpass({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-text',
});

export const metadata = {
  metadataBase: new URL('https://bigmacktrucking.com'),
  title: 'Big Mack Trucking LLC | 26ft Dock-High Freight & Logistics',
  description:
    'Heavy-duty expedited dock-high freight carrier. 26ft Straight Box, Heavy-Duty Liftgate, Industrial Pallet Jack, TWIC Card Certified. USDOT# 3843409 • MC# 1398475. Dispatch: (516) 508-8078.',
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
    'Port Logistics',
  ],
  authors: [{ name: 'Omari Headley', url: 'mailto:Bigmacklogisticsa1@gmail.com' }],
  openGraph: {
    title: 'Big Mack Trucking LLC | Dock-high freight across NY and NJ',
    description: '26ft Dock-High Straight Box • Heavy-Duty Liftgate • TWIC Card Certified • USDOT 3843409 • MC 1398475',
    siteName: 'Big Mack Trucking LLC',
    images: [{ url: '/image/logo-transparent.png', width: 2048, height: 2048, alt: 'Big Mack Trucking LLC emblem' }],
    locale: 'en_US',
    type: 'website',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0b0817',
};

// Applied before first paint so a returning day-shift visitor never sees a night flash.
// Also honors the older light/dark preference key from the previous site.
const themeScript = `(function(){try{var s=localStorage.getItem('bigmack-shift');if(!s){var o=localStorage.getItem('bigmack-theme');s=o==='light'?'day':o==='dark'?'night':null}document.documentElement.dataset.theme=s==='day'?'day':'night'}catch(e){document.documentElement.dataset.theme='night'}var h=document.documentElement;h.dataset.stage='loading';setTimeout(function(){if(h.dataset.stage==='loading')h.dataset.stage='ready'},9000)})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${stencil.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preload" href="/models/truck-run.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
