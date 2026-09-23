// Isometric icon definitions (see iso.js for the coordinate system).
// Materials map to CSS variables in globals.css: body (Mack violet), box (plum cargo box),
// metal, dark, amber, paper, wood, glass, red, ground, lamphead, beam.
// `part` tags pieces that animate: `lift` rises on hover / when a toggle is on,
// `glow` lights up on the night shift.
const box = (at, size, m, part) => ({ type: 'box', at, size, m, part });
const disc = (c, r, m, axis = 'y', part) => ({ type: 'disc', c, r, m, axis, part });
const poly = (pts, m, face, part) => ({ type: 'poly', pts, m, face, part });
const line = (pts, cls, part) => ({ type: 'line', pts, cls, part });

const wheel = (x, y, z = 0.62, r = 0.62) => [disc([x, y, z], r, 'dark'), disc([x, y + 0.01, z], r * 0.5, 'metal')];

export const ICONS = {
  // 26-ft box truck, cab at +x.
  truck: [
    box([0.3, 0.7, 0.55], [8.6, 2.1, 0.35], 'dark'),
    box([0, 0.3, 0.9], [5.9, 2.9, 3.1], 'box'),
    line([[0.4, 3.2, 2.1], [5.5, 3.2, 2.1]], 'accent'),
    box([6.1, 0.45, 0.9], [2.3, 2.6, 2.2], 'body'),
    poly([[6.45, 3.05, 2.05], [7.75, 3.05, 2.05], [7.75, 3.05, 2.8], [6.45, 3.05, 2.8]], 'glass', 'left'),
    box([8.4, 0.6, 0.9], [1.1, 2.3, 1.2], 'body'),
    poly([[8.4, 0.75, 2.2], [8.4, 2.9, 2.2], [8.4, 2.9, 2.95], [8.4, 0.75, 2.95]], 'glass', 'right'),
    box([9.5, 0.7, 0.75], [0.2, 2.1, 0.35], 'metal'),
    ...wheel(1.7, 3.25),
    ...wheel(3.2, 3.25),
    ...wheel(7.6, 3.1),
  ],

  // Dock-high: the truck floor meets the dock floor at the same height; a pallet rolls across.
  dock: [
    box([0, 0, 0], [3.4, 5.2, 1.7], 'ground'),
    box([0, 0, 1.7], [0.5, 5.2, 2.6], 'metal'),
    box([3.5, 0.9, 0.5], [4.4, 0.25, 3.4], 'box'),
    box([3.5, 1.15, 0.5], [4.4, 3.3, 1.2], 'box'),
    box([2.7, 1.9, 1.7], [1.7, 1.5, 0.22], 'wood', 'lift'),
    box([2.8, 2.0, 1.92], [1.5, 1.3, 1.25], 'paper', 'lift'),
    line([[3.4, 5.4, 1.7], [3.4, 5.4, 0.2]], 'accent'),
  ],

  pallets: [
    box([0, 0, 0], [4.2, 3.4, 0.4], 'wood'),
    box([0.15, 0.15, 0.4], [1.9, 1.5, 1.4], 'paper', 'lift'),
    box([2.15, 0.15, 0.4], [1.9, 1.5, 1.4], 'paper', 'lift'),
    box([0.15, 1.7, 0.4], [1.9, 1.5, 1.4], 'paper', 'lift'),
    box([2.15, 1.7, 0.4], [1.9, 1.5, 1.4], 'paper', 'lift'),
    box([0.15, 0.15, 1.8], [1.9, 1.5, 1.3], 'paper', 'lift'),
    box([2.15, 0.15, 1.8], [1.9, 1.5, 1.3], 'paper', 'lift'),
    box([0.15, 1.7, 1.8], [1.9, 1.5, 1.3], 'paper', 'lift'),
    box([2.15, 1.7, 1.8], [1.9, 1.5, 1.3], 'paper', 'lift'),
    line([[4.05, 1.7, 0.4], [4.05, 1.7, 3.1]], 'accent', 'lift'),
    line([[2.1, 3.2, 0.4], [2.1, 3.2, 3.1]], 'accent', 'lift'),
  ],

  // Liftgate lowered to street level with a pallet on it.
  liftgate: [
    box([0, 0.3, 1.3], [3.6, 3.3, 3.3], 'box'),
    line([[3.6, 1.95, 1.4], [3.6, 1.95, 4.5]], 'dark'),
    box([3.6, 0.3, 0.2], [0.18, 0.2, 1.3], 'metal'),
    box([3.6, 3.4, 0.2], [0.18, 0.2, 1.3], 'metal'),
    box([3.7, 0.4, 0], [2.1, 3.1, 0.2], 'metal'),
    box([4.0, 1.0, 0.2], [1.5, 1.9, 0.22], 'wood', 'lift'),
    box([4.1, 1.1, 0.42], [1.3, 1.7, 1.4], 'paper', 'lift'),
    ...wheel(1.1, 3.62, 0.62, 0.6),
  ],

  palletJack: [
    box([0, 0.5, 0], [4.4, 0.55, 0.28], 'metal'),
    box([0, 2.2, 0], [4.4, 0.55, 0.28], 'metal'),
    box([4.4, 0.3, 0], [1.3, 2.7, 1.0], 'red', 'lift'),
    poly([[5.2, 1.5, 1.0], [5.6, 1.5, 1.0], [6.9, 1.5, 4.0], [6.5, 1.5, 4.0]], 'dark', 'left', 'lift'),
    box([6.4, 0.9, 3.9], [0.35, 1.3, 0.3], 'dark', 'lift'),
    disc([5.0, 2.95, 0.2], 0.28, 'dark'),
  ],

  // E-track rail on a box wall with a ratchet strap.
  straps: [
    box([0, 0, 0], [0.4, 6, 4.6], 'box'),
    box([0.4, 0.3, 2.3], [0.12, 5.4, 0.55], 'metal'),
    ...[0.9, 1.9, 2.9, 3.9, 4.9].map((y) => poly([[0.53, y, 2.45], [0.53, y + 0.5, 2.45], [0.53, y + 0.5, 2.7], [0.53, y, 2.7]], 'dark', 'right')),
    poly([[0.55, 0.6, 0.6], [0.55, 1.2, 0.6], [0.55, 5.4, 4.2], [0.55, 4.8, 4.2]], 'amber', 'right', 'lift'),
    box([0.55, 2.4, 1.9], [0.45, 0.9, 0.6], 'metal', 'lift'),
  ],

  // TWIC credential card on a stand.
  twic: [
    box([-0.2, -0.2, 0], [1.2, 5.6, 0.5], 'dark'),
    box([0.2, 0, 0.5], [0.3, 5.2, 3.5], 'paper', 'lift'),
    poly([[0.51, 0.4, 1.4], [0.51, 1.9, 1.4], [0.51, 1.9, 3.4], [0.51, 0.4, 3.4]], 'body', 'right', 'lift'),
    poly([[0.51, 2.4, 2.4], [0.51, 3.2, 2.4], [0.51, 3.2, 3.0], [0.51, 2.4, 3.0]], 'amber', 'right', 'lift'),
    line([[0.51, 2.4, 1.9], [0.51, 4.8, 1.9]], 'dark', 'lift'),
    line([[0.51, 2.4, 1.5], [0.51, 4.3, 1.5]], 'dark', 'lift'),
    line([[0.51, 3.6, 3.1], [0.51, 4.8, 3.1]], 'dark', 'lift'),
  ],

  // Tracking: map tile, driven route, destination pin.
  route: [
    box([0, 0, 0], [6.4, 6.4, 0.35], 'ground'),
    line([[0.7, 5.6, 0.36], [1.8, 4.1, 0.36], [1.6, 2.7, 0.36], [3.6, 2.0, 0.36], [4.6, 0.9, 0.36]], 'route'),
    disc([0.7, 5.6, 0.37], 0.32, 'amber', 'z'),
    box([4.45, 0.75, 0.35], [0.3, 0.3, 1.3], 'dark', 'lift'),
    box([4.1, 0.4, 1.6], [1.0, 1.0, 1.0], 'amber', 'lift'),
  ],

  // 24/7 dispatch clock.
  clock: [
    box([0, 0, 0], [4.2, 4.2, 4.2], 'body'),
    disc([2.1, 4.21, 2.1], 1.55, 'paper'),
    line([[2.1, 4.22, 2.1], [2.1, 4.22, 3.2]], 'dark'),
    line([[2.1, 4.22, 2.1], [2.9, 4.22, 2.1]], 'dark'),
    disc([4.21, 2.1, 2.1], 1.2, 'amber', 'x', 'glow'),
  ],

  phone: [
    box([0, 0, 0], [0.5, 3.2, 5.8], 'dark', 'lift'),
    poly([[0.51, 0.3, 0.7], [0.51, 2.9, 0.7], [0.51, 2.9, 5.2], [0.51, 0.3, 5.2]], 'glass', 'right', 'lift'),
    poly([[0.52, 0.7, 3.4], [0.52, 2.5, 3.4], [0.52, 2.5, 4.4], [0.52, 0.7, 4.4]], 'amber', 'right', 'lift'),
    line([[0.52, 0.7, 2.7], [0.52, 2.5, 2.7]], 'paper', 'lift'),
    line([[0.52, 0.7, 2.2], [0.52, 2.0, 2.2]], 'paper', 'lift'),
  ],

  mail: [
    box([0, 0, 0], [5.2, 3.8, 0.45], 'paper', 'lift'),
    line([[0, 0, 0.46], [2.6, 1.9, 0.46], [5.2, 0, 0.46]], 'dark', 'lift'),
    line([[0, 3.8, 0.46], [2.6, 1.9, 0.46], [5.2, 3.8, 0.46]], 'dark', 'lift'),
  ],

  // Streetlight: the shift toggle. Its head glows on the night shift.
  lamp: [
    box([-0.4, -0.4, 0], [1.2, 1.2, 0.45], 'dark'),
    box([0, 0, 0.45], [0.4, 0.4, 5.6], 'metal'),
    box([0.2, 0.05, 5.7], [2.9, 0.3, 0.3], 'metal'),
    box([2.5, -0.15, 5.35], [1.3, 0.7, 0.4], 'lamphead', 'glow'),
    poly([[2.6, 0.2, 5.35], [3.7, 0.2, 5.35], [4.8, 0.2, 1.2], [1.5, 0.2, 1.2]], 'beam', 'left', 'glow'),
  ],
};
