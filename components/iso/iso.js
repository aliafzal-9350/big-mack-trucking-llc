// Tiny isometric engine for the icon set. Icons are authored in 3D units (x right/back,
// y left/back, z up) and projected with the classic 30° isometric axes. Faces are shaded
// by orientation (top / right / left) through CSS classes, so every icon shares one light
// direction and themes with CSS variables. Primitives are drawn in authoring order
// (author back to front).
const COS = Math.cos(Math.PI / 6);
const SIN = 0.5;

export const project = ([x, y, z]) => [(x - y) * COS, (x + y) * SIN - z];

function boxFaces({ at: [x, y, z], size: [w, d, h] }) {
  return [
    { face: 'top', pts: [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]] },
    { face: 'right', pts: [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]] },
    { face: 'left', pts: [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]] },
  ];
}

function discPoints({ c: [cx, cy, cz], r, axis = 'y' }, segments = 28) {
  const pts = [];
  for (let i = 0; i < segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const u = Math.cos(a) * r;
    const v = Math.sin(a) * r;
    if (axis === 'y') pts.push([cx + u, cy, cz + v]);
    else if (axis === 'x') pts.push([cx, cy + u, cz + v]);
    else pts.push([cx + u, cy + v, cz]);
  }
  return pts;
}

const fmt = (n) => Math.round(n * 100) / 100;

/** Build SVG-ready shapes and a viewBox for a list of primitives. */
export function buildIcon(prims, pad = 0.35) {
  const shapes = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  const toPoints = (pts3) =>
    pts3
      .map((p) => {
        const [sx, sy] = project(p);
        minX = Math.min(minX, sx); maxX = Math.max(maxX, sx);
        minY = Math.min(minY, sy); maxY = Math.max(maxY, sy);
        return `${fmt(sx)},${fmt(sy)}`;
      })
      .join(' ');

  prims.forEach((p, i) => {
    const group = p.part ? `part-${p.part}` : '';
    if (p.type === 'box') {
      for (const { face, pts } of boxFaces(p)) {
        shapes.push({ key: `${i}-${face}`, kind: 'polygon', points: toPoints(pts), cls: `m-${p.m} f-${face} ${group}` });
      }
    } else if (p.type === 'disc') {
      const face = p.axis === 'z' ? 'top' : p.axis === 'x' ? 'right' : 'left';
      shapes.push({ key: `${i}-disc`, kind: 'polygon', points: toPoints(discPoints(p)), cls: `m-${p.m} f-${p.face || face} ${group}` });
    } else if (p.type === 'poly') {
      shapes.push({ key: `${i}-poly`, kind: 'polygon', points: toPoints(p.pts), cls: `m-${p.m} f-${p.face || 'top'} ${group}` });
    } else if (p.type === 'line') {
      shapes.push({ key: `${i}-line`, kind: 'polyline', points: toPoints(p.pts), cls: `iso-line ${p.cls || ''} ${group}` });
    }
  });

  const vb = [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2].map(fmt).join(' ');
  return { shapes, viewBox: vb };
}
