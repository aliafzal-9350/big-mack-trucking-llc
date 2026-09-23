import { beatEase } from './beatEase';

// The story, one beat per text block on the page (matched by data-beat="id").
//
//  d      distance along the run (lib/path.js), where the truck is parked for this beat
//  cam    orbit camera around the truck, in the truck's own frame:
//           az   degrees around the truck, 0 = dead ahead, 90 = its left (+x) side
//           el   degrees above the horizon
//           dist distance from `target`
//           target point on the truck (local coords) the camera looks at
//  frame  where `target` sits on screen, as a fraction of the viewport from center
//           (+x right, +y up) -- `wide` for landscape screens, `tall` for portrait
//  state  scene states that blend between beats (0..1)
//  lift   extra camera elevation (degrees) at the middle of the move into this beat: a crane
//         move that clears obstacles (container stacks) and reads as one continuous shot
//  win    optional windows (in eased progress) when entering this beat, so e.g. the
//         truck finishes driving before the liftgate starts moving
export const BEATS = [
  {
    id: 'hero',
    d: 0,
    cam: { az: 34, el: 6.5, dist: 5.6, target: [0, 0.5, 0.2], fov: 30 },
    frame: { wide: [0.2, -0.04], tall: [0.02, 0.25] },
    state: { xray: 0, load: 0, liftgate: 0, map: 0, hazards: 0 },
    status: 'Ready at dock 7',
    hotspots: [],
  },
  {
    id: 'pickup',
    d: 0,
    lift: 8,
    cam: { az: 58, el: 21, dist: 6.8, target: [0, 0.55, -0.7], fov: 32 },
    frame: { wide: [-0.2, -0.04], tall: [0, 0.27] },
    state: { xray: 1, load: 1, liftgate: 0, map: 0, hazards: 0 },
    status: 'Loading at dock 7',
    hotspots: ['box', 'dock'],
  },
  {
    id: 'transit',
    d: 60,
    lift: 6,
    cam: { az: 96, el: 4, dist: 6.9, target: [0, 0.55, 0.1], fov: 28 },
    frame: { wide: [0.16, 0.02], tall: [0.02, 0.28] },
    state: { xray: 0, load: 1, liftgate: 0, map: 0, hazards: 0 },
    status: 'In transit',
    hotspots: [],
    win: { d: [0.12, 1] },
  },
  {
    id: 'map',
    d: 104,
    cam: { az: 200, el: 58, dist: 64, target: [0, 0, 18], fov: 34 },
    frame: { wide: [0.18, -0.02], tall: [0, 0.2] },
    state: { xray: 0, load: 1, liftgate: 0, map: 1, hazards: 0 },
    status: 'In transit',
    hotspots: [],
  },
  {
    id: 'port',
    d: 153.5,
    lift: 0,
    cam: { az: 328, el: 12, dist: 7.2, target: [0, 0.7, -0.6], fov: 32 },
    frame: { wide: [-0.25, 0], tall: [0, 0.26] },
    state: { xray: 0, load: 1, liftgate: 0, map: 0, hazards: 0 },
    status: 'Cleared at port gate',
    hotspots: [],
    win: { map: [0, 0.45] },
  },
  {
    id: 'drop',
    d: 190,
    lift: 34,
    cam: { az: 510, el: 15, dist: 7, target: [-0.45, 0.4, -1.1], fov: 32 },
    frame: { wide: [0.12, -0.02], tall: [0, 0.26] },
    state: { xray: 0, load: 1, liftgate: 1, map: 0, hazards: 1 },
    status: 'Unloading by liftgate',
    hotspots: ['liftgate', 'straps'],
    win: { d: [0, 0.6], liftgate: [0.55, 1], hazards: [0.5, 0.6] },
  },
  {
    id: 'book',
    d: 190,
    lift: 12,
    cam: { az: 398, el: 17, dist: 6.2, target: [0, 0.5, -0.25], fov: 30 },
    frame: { wide: [0.22, 0.04], tall: [0, 0.28] },
    state: { xray: 1, load: 1, liftgate: 0, map: 0, hazards: 0 },
    status: 'Available for your load',
    hotspots: ['box'],
    win: { liftgate: [0, 0.4], hazards: [0, 0.3], xray: [0.4, 1] },
  },
];

export const STATE_KEYS = ['xray', 'load', 'liftgate', 'map', 'hazards'];

// Sample run shown in the dispatch log: minutes after the load is tendered.
export const LOG = [
  { beat: 'hero', at: 0, text: (load) => `Load tendered, ${load.pallets} ${load.pallets === 1 ? 'pallet' : 'pallets'}, ${load.weight}` },
  { beat: 'pickup', at: 22, text: () => 'Loaded at JFK Air Cargo, dock 7' },
  { beat: 'transit', at: 41, text: () => 'Rolling west on I-278' },
  { beat: 'map', at: 63, text: () => 'Over the Verrazzano-Narrows, on schedule' },
  { beat: 'port', at: 88, text: () => 'TWIC verified at Port Newark gate' },
  { beat: 'drop', at: 104, text: () => 'Liftgate drop, POD signed' },
  { beat: 'book', at: 110, text: () => 'Truck available for your next load' },
];

// Named places along the run, shown on the map view.
export const WAYPOINTS = [
  { id: 'jfk', d: 0, label: 'JFK Air Cargo' },
  { id: 'bqe', d: 40, label: 'I-278 / BQE' },
  { id: 'vzn', d: 80, label: 'Verrazzano-Narrows Br.' },
  { id: 'goethals', d: 118, label: 'Goethals Br.' },
  { id: 'port', d: 150, label: 'Port Newark gate' },
  { id: 'drop', d: 190, label: 'Drop' },
];

// The sample route is about 36 road miles end to end.
export const MILES_PER_UNIT = 36 / 190;

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (x) => x * x * (3 - 2 * x);
const windowed = (e, win) => (win ? clamp01((e - win[0]) / (win[1] - win[0])) : e);

/** Blend the beat table at beat coordinate `c` (0 = first beat, 1 = second, ...). Writes into `out`. */
export function sampleRun(c, out) {
  const last = BEATS.length - 1;
  const cc = Math.min(last, Math.max(0, c));
  const i = Math.min(last - 1, Math.floor(cc));
  const t = cc - i;
  const e = clamp01(beatEase(clamp01(t)));
  const A = BEATS[i];
  const B = BEATS[i + 1];
  const win = B.win || {};

  const ed = windowed(e, win.d);
  const ec = windowed(e, win.cam);
  out.index = i;
  out.t = t;
  out.nearest = t < 0.5 ? i : i + 1;
  out.d = lerp(A.d, B.d, ed);

  const cam = out.cam || (out.cam = { target: [0, 0, 0] });
  cam.az = lerp(A.cam.az, B.cam.az, ec);
  cam.el = lerp(A.cam.el, B.cam.el, ec) + (B.lift || 0) * Math.sin(Math.PI * ec);
  cam.dist = Math.exp(lerp(Math.log(A.cam.dist), Math.log(B.cam.dist), ec));
  cam.fov = lerp(A.cam.fov, B.cam.fov, ec);
  for (let k = 0; k < 3; k++) cam.target[k] = lerp(A.cam.target[k], B.cam.target[k], ec);

  const frame = out.frame || (out.frame = { wide: [0, 0], tall: [0, 0] });
  for (const key of ['wide', 'tall']) {
    frame[key][0] = lerp(A.frame[key][0], B.frame[key][0], ec);
    frame[key][1] = lerp(A.frame[key][1], B.frame[key][1], ec);
  }

  const state = out.state || (out.state = {});
  for (const key of STATE_KEYS) {
    const k = win[key] ? smooth(windowed(e, win[key])) : e;
    state[key] = lerp(A.state[key], B.state[key], k);
  }
  return out;
}
