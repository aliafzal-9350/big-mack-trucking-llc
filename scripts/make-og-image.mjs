// Rebuilds app/opengraph-image.png, the link preview card shown when the site is shared
// (texts, WhatsApp, LinkedIn, Facebook, X). Next.js picks the file up by name for every page.
//
//   npm run og
//
// The badge artwork is black and violet, so the card is light to keep it legible. A static PNG
// instead of next/og because @vercel/og fails to load on Windows builds.
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BADGE = path.join(ROOT, 'public/image/logo.jpeg');
const DST = path.join(ROOT, 'app/opengraph-image.png');

const W = 1200;
const H = 630;
const TAPE = 28;

// The JPEG has wide white margins around the badge; trim them, then fit the badge to a square.
const badge = await sharp(BADGE).trim({ threshold: 12 }).resize(400, 400, { fit: 'contain', background: '#ffffff' }).toBuffer();

const tape = Array.from({ length: Math.ceil(W / 60) }, (_, i) =>
  `<rect x="${i * 60}" y="${H - TAPE}" width="60" height="${TAPE}" fill="${i % 2 ? '#f4f1f6' : '#d7263d'}"/>`,
).join('');

const text = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    text { font-family: 'Arial Narrow', 'Arial', 'Helvetica', sans-serif; }
  </style>
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  <text x="530" y="170" font-size="28" font-weight="700" fill="#6b35a0" letter-spacing="3">EXPEDITED FREIGHT</text>
  <text x="530" y="250" font-size="66" font-weight="800" fill="#1b1430">26 ft dock-high</text>
  <text x="530" y="322" font-size="66" font-weight="800" fill="#1b1430">box truck</text>
  <text x="530" y="380" font-size="30" fill="#463d5c">3,500-lb liftgate • Pallet jack • TWIC certified</text>
  <text x="530" y="450" font-size="36" font-weight="700" fill="#1b1430">Dispatch 24/7: (516) 508-8078</text>
  <text x="530" y="495" font-size="23" fill="#6a6180">USDOT 3843409 • MC 1398475 • bigmacktrucking.com</text>
  ${tape}
</svg>`;

await sharp(Buffer.from(text))
  .composite([{ input: badge, left: 80, top: Math.round((H - TAPE - 400) / 2) }])
  .png({ compressionLevel: 9 })
  .toFile(DST);

console.log(`wrote ${path.relative(ROOT, DST)}`);
