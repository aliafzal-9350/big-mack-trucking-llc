import { Big_Shoulders_Display, Big_Shoulders_Stencil_Display, Overpass } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import 'lenis/dist/lenis.css';
import './globals.css';
import { ALL_KEYWORDS, BUSINESS, SITE_URL, businessJsonLd, toJsonLd } from '@/lib/seo';

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
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Big Mack Trucking | 26 ft Box Truck, Liftgate & Expedited Freight',
    template: '%s | Big Mack Trucking',
  },
  description:
    'Expedited 26 ft dock-high box truck freight from New York, nationwide. 3,500-lb liftgate, pallet jack, TWIC-certified for ports and air cargo. 24/7 dispatch (516) 508-8078.',
  keywords: ALL_KEYWORDS,
  applicationName: BUSINESS.name,
  authors: [{ name: BUSINESS.owner, url: SITE_URL }],
  creator: BUSINESS.name,
  publisher: BUSINESS.name,
  category: 'Transportation',
  formatDetection: { telephone: true, email: true, address: false },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  openGraph: {
    title: 'Big Mack Trucking | Expedited box truck freight, NY metro & nationwide',
    description: '26 ft dock-high box truck • 3,500-lb liftgate • Pallet jack • TWIC certified • USDOT 3843409 • MC 1398475',
    url: '/',
    siteName: BUSINESS.name,
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Big Mack Trucking | Expedited box truck freight',
    description: '26 ft dock-high box truck with liftgate and TWIC-certified driver. 24/7 dispatch (516) 508-8078.',
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toJsonLd(businessJsonLd()) }} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
