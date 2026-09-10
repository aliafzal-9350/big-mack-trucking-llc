import './globals.css';

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
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#08040C] text-slate-100 selection:bg-purple-600 selection:text-white min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
