import * as THREE from 'three';
import { fontFamily, fontsReady } from '@/lib/fonts';

export { fontFamily, fontsReady } from '@/lib/fonts';

// Canvas-drawn textures for everything in the world that carries lettering or pattern.
// They use the page's own web fonts (next/font), so 3D type matches the HTML type and no
// extra font files are fetched for the scene.

const cache = new Map();

function canvasTexture(key, width, height, draw, { srgb = true, repeat = false, anisotropy = 8 } = {}) {
  if (cache.has(key)) return cache.get(key);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  draw(ctx, width, height);
  const texture = new THREE.CanvasTexture(canvas);
  if (srgb) texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = anisotropy;
  if (repeat) texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.needsUpdate = true;
  cache.set(key, texture);
  return texture;
}

async function loadImage(src) {
  const img = new Image();
  img.src = src;
  await img.decode(); // decodes off the main thread before the canvas needs it
  return img;
}

// 640px WebP of the badge (31 KB) rather than the 2048px PNG (633 KB): the livery never
// draws it larger than 600px.
let logoPromise;
export const loadLogo = () => (logoPromise ||= loadImage('/image/logo-badge-640.webp'));

let liveryPromise;
/** Box-side and rear-door lettering, prepared once (starts as soon as the 3D chunk loads). */
export function prepareLivery() {
  liveryPromise ||= (async () => {
    const display = fontFamily('--font-display');
    const text = fontFamily('--font-text');
    const [logo] = await Promise.all([
      loadLogo(),
      fontsReady([`900 100px ${display}`, `800 100px ${display}`, `700 60px ${text}`, `600 40px ${text}`]),
    ]);
    return { left: liveryTexture(logo, true), right: liveryTexture(logo, false), rear: rearDoorTexture(logo) };
  })();
  return liveryPromise;
}

// ---- truck livery ------------------------------------------------------------------------------

/** Side of the cargo box: badge at the cab end, name, dispatch number, authority numbers. */
export function liveryTexture(logo, logoAtLeft) {
  return canvasTexture(`livery-${logoAtLeft}`, 2048, 740, (ctx, w, h) => {
    const display = fontFamily('--font-display');
    const text = fontFamily('--font-text');
    const logoSize = 600;
    const logoX = logoAtLeft ? 70 : w - 70 - logoSize;
    ctx.drawImage(logo, logoX, (h - logoSize) / 2 - 6, logoSize, logoSize);

    const x = logoAtLeft ? 740 : 90;
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'alphabetic';
    ctx.font = `900 268px ${display}`;
    ctx.fillText('BIG MACK', x, 300);
    ctx.fillStyle = '#c9b3ee';
    ctx.font = `800 104px ${display}`;
    ctx.fillText('TRUCKING LLC', x + 6, 420);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(x + 8, 462, 1180, 4);
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 92px ${text}`;
    ctx.fillText('(516) 508-8078', x + 4, 580);
    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.font = `600 50px ${text}`;
    ctx.fillText('USDOT 3843409', x + 6, 668);
    ctx.fillText('MC 1398475', x + 460, 668);
  });
}

/** Roll-up rear door. */
export function rearDoorTexture(logo) {
  return canvasTexture('rear-door', 1024, 740, (ctx, w) => {
    const text = fontFamily('--font-text');
    const size = 430;
    ctx.drawImage(logo, (w - size) / 2, 40, size, size);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = `700 64px ${text}`;
    ctx.fillText('(516) 508-8078', w / 2, 560);
    ctx.fillStyle = 'rgba(255,255,255,0.72)';
    ctx.font = `600 40px ${text}`;
    ctx.fillText('USDOT 3843409    MC 1398475', w / 2, 640);
  });
}

// ---- world lettering -----------------------------------------------------------------------------

/** Paint on the ground: stenciled words, e.g. DOCK 07. Returns a white-on-transparent mask. */
export function stencilTexture(label, { width = 1024, height = 256, size = 200 } = {}) {
  return canvasTexture(`stencil-${label}-${width}x${height}`, width, height, (ctx, w, h) => {
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `800 ${size}px ${fontFamily('--font-stencil')}`;
    ctx.fillText(label, w / 2, h / 2 + size * 0.04);
  }, { srgb: false });
}

/** Overhead guide sign in the FHWA style: white Highway Gothic-like type on green. */
export function guideSignTexture(key, lines) {
  return canvasTexture(`guide-${key}`, 1024, 400, (ctx, w, h) => {
    const text = fontFamily('--font-text');
    ctx.fillStyle = '#0f5a3a';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 10;
    ctx.strokeRect(18, 18, w - 36, h - 36);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'left';
    // route shield
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(60, 64, 150, 150, 18);
    ctx.fill();
    ctx.fillStyle = '#1b3f8f';
    ctx.beginPath();
    ctx.roundRect(70, 74, 130, 130, 12);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = `800 64px ${text}`;
    ctx.fillText(lines.shield, 135, 162);
    ctx.textAlign = 'left';
    ctx.font = `700 88px ${text}`;
    ctx.fillText(lines.title, 250, 160);
    ctx.font = `600 62px ${text}`;
    ctx.fillText(lines.subtitle, 250, 250);
    ctx.font = `700 54px ${text}`;
    ctx.fillText(lines.foot, 60, 340);
  });
}

/** Port gate header sign. */
export function gateSignTexture() {
  return canvasTexture('gate-sign', 1024, 256, (ctx, w, h) => {
    ctx.fillStyle = '#16131d';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffb04f';
    ctx.fillRect(0, h - 22, w, 22);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = `800 104px ${fontFamily('--font-display')}`;
    ctx.fillText('PORT NEWARK', w / 2, 118);
    ctx.fillStyle = '#ffb04f';
    ctx.font = `700 50px ${fontFamily('--font-text')}`;
    ctx.fillText('TWIC card required beyond this point', w / 2, 196);
  });
}

/** Receiving sign over the door at the drop (a generic storefront, no real business). */
export function storeSignTexture() {
  return canvasTexture('store-sign', 1024, 200, (ctx, w, h) => {
    ctx.fillStyle = '#231a2f';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#f3ecff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `800 110px ${fontFamily('--font-display')}`;
    ctx.fillText('RECEIVING', w / 2, h / 2 + 6);
  });
}

// ---- patterns ------------------------------------------------------------------------------------

/** Vertical ribs for container walls and roll-up doors (used as a bump map). */
export function ribTexture() {
  return canvasTexture('ribs', 256, 16, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w / 8, 0);
    g.addColorStop(0, '#202020');
    g.addColorStop(0.35, '#f0f0f0');
    g.addColorStop(0.65, '#f0f0f0');
    g.addColorStop(1, '#202020');
    for (let x = 0; x < w; x += w / 8) {
      ctx.save();
      ctx.translate(x, 0);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w / 8, h);
      ctx.restore();
    }
  }, { srgb: false, repeat: true });
}

/** Horizontal slats for roll-up doors. */
export function slatTexture() {
  return canvasTexture('slats', 16, 256, (ctx, w, h) => {
    for (let y = 0; y < h; y += 16) {
      const g = ctx.createLinearGradient(0, y, 0, y + 16);
      g.addColorStop(0, '#303030');
      g.addColorStop(0.5, '#e8e8e8');
      g.addColorStop(1, '#404040');
      ctx.fillStyle = g;
      ctx.fillRect(0, y, w, 16);
    }
  }, { srgb: false, repeat: true });
}

/** Soft round glow for lamps and lens glints. */
export function glowTexture() {
  return canvasTexture('glow', 128, 128, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.18, 'rgba(255,255,255,0.55)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.12)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }, { srgb: false });
}

/** Yellow/black hazard chevrons for dock edges and the gate island. */
export function hazardTexture() {
  return canvasTexture('hazard', 256, 64, (ctx, w, h) => {
    ctx.fillStyle = '#1a1714';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#e8b62c';
    for (let x = -h; x < w + h; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, h);
      ctx.lineTo(x + 24, h);
      ctx.lineTo(x + 24 + h, 0);
      ctx.lineTo(x + h, 0);
      ctx.closePath();
      ctx.fill();
    }
  }, { repeat: true });
}
