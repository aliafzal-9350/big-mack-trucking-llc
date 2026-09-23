import { useSyncExternalStore } from 'react';
import { BEATS, MILES_PER_UNIT, sampleRun } from './timeline';

// One mutable store for the whole run. Scroll, the 3D scene and the HUD all read from it.
// Per-frame values (distance, speed, camera blend) are read directly off `run` inside
// animation loops; discrete values (theme, beat, load...) notify React via `subscribe`.
export const run = {
  scrollY: 0,
  anchors: [],
  c: 0, // beat coordinate from scroll: 0 = first beat, 1 = second, ...
  cs: 0, // smoothed beat coordinate the scene actually renders
  sample: sampleRun(0, {}),
  d: 0,
  speed: 0, // scene units per second, signed
  mph: 0,
  braking: 0,
  miles: 0,
  nearest: 0,
  reached: 0,

  theme: 'night',
  night: 1, // 1 = night shift, 0 = day shift, eased between
  reducedMotion: false,
  tier: 'high',
  portrait: false,

  pointer: { nx: 0, ny: 0, x: 0, y: 0, active: false },
  stage: 'loading', // loading -> intro -> ready (or 'fallback' without WebGL)
  intro: 0,

  load: { pallets: 6, weight: '4,500 lbs', liftgate: true, palletJack: true, twic: false },
  liveryReady: false,
  lenis: null, // set by <SmoothScroll /> on desktop
};

/** Loading milestones, visible in DevTools > Performance as bm:* marks. */
export function mark(name) {
  if (typeof performance !== 'undefined' && performance.mark) performance.mark(`bm:${name}`);
}

// ---- discrete subscriptions -----------------------------------------------------------
const listeners = new Set();
export function emit() {
  listeners.forEach((fn) => fn());
}
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
export function setRun(patch) {
  Object.assign(run, patch);
  emit();
}
export function setLoad(patch) {
  run.load = { ...run.load, ...patch };
  emit();
}
/** Subscribe a component to a derived value of the store. */
export function useRun(selector) {
  return useSyncExternalStore(subscribe, () => selector(run), () => selector(run));
}

// ---- per-frame subscriptions ----------------------------------------------------------
const frameListeners = new Set();
export function onFrame(fn) {
  frameListeners.add(fn);
  return () => frameListeners.delete(fn);
}

// ---- scroll -> beat coordinate --------------------------------------------------------
let measuredWidth = 0;
let measuredHeight = 0;

export function measureAnchors() {
  if (typeof window === 'undefined') return;
  const vh = window.innerHeight;
  measuredWidth = window.innerWidth;
  measuredHeight = vh;
  run.portrait = window.innerWidth / vh < 0.9;
  // Where on screen the reader's eye rests on a text block: middle on wide screens,
  // lower on phones where the truck owns the top half.
  const readingLine = run.portrait ? 0.66 : 0.5;
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - vh);
  const anchors = [];
  let prev = -Infinity;
  for (const beat of BEATS) {
    const el = document.querySelector(`[data-beat="${beat.id}"]`);
    let a = prev + 1;
    if (el) {
      const rect = el.getBoundingClientRect();
      a = rect.top + window.scrollY + rect.height / 2 - vh * readingLine;
    }
    a = Math.min(maxScroll, Math.max(0, a));
    if (a <= prev) a = prev + 1;
    anchors.push(a);
    prev = a;
  }
  run.anchors = anchors;
  run.c = beatCoord(window.scrollY);
}

// Mobile browsers resize the viewport as the address bar slides in and out while scrolling.
// Re-measuring on every one of those would nudge the camera mid-scroll, so ignore
// height-only changes smaller than the bar.
function onResize() {
  const widthChanged = window.innerWidth !== measuredWidth;
  if (widthChanged || Math.abs(window.innerHeight - measuredHeight) > 160) measureAnchors();
}

function beatCoord(y) {
  const a = run.anchors;
  if (a.length < 2 || y <= a[0]) return 0;
  for (let i = 0; i < a.length - 1; i++) {
    if (y < a[i + 1]) return i + (y - a[i]) / (a[i + 1] - a[i]);
  }
  return a.length - 1;
}

/** Scroll position at which beat `id` is in its reading position. */
export function beatScrollTarget(id) {
  const i = BEATS.findIndex((b) => b.id === id);
  return i >= 0 ? run.anchors[i] ?? 0 : 0;
}

// ---- the loop ---------------------------------------------------------------------------
// One requestAnimationFrame drives everything, in a fixed order every frame:
//   smooth scroll (Lenis) -> scroll position -> run state -> HUD -> WebGL render.
// Separate loops would run in arbitrary order and let the 3D lag the page by a frame.
const damp = (current, target, lambda, dt) => current + (target - current) * (1 - Math.exp(-lambda * dt));

let renderFrame = null;
/** The canvas registers its render step here (R3F runs with frameloop="never"). */
export function setRenderFrame(fn) {
  renderFrame = fn;
}

let started = false;
export function startRun() {
  if (started || typeof window === 'undefined') return;
  started = true;
  if (process.env.NODE_ENV !== 'production' || window.location.search.includes('debug')) window.__run = run;

  window.addEventListener('resize', onResize);
  window.addEventListener('load', measureAnchors);
  const ro = new ResizeObserver(() => measureAnchors());
  ro.observe(document.body);
  measureAnchors();
  run.scrollY = window.scrollY;
  run.c = beatCoord(run.scrollY);
  run.cs = run.c;

  window.addEventListener('pointermove', (e) => {
    run.pointer.x = e.clientX;
    run.pointer.y = e.clientY;
    run.pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
    run.pointer.ny = -((e.clientY / window.innerHeight) * 2 - 1);
    run.pointer.active = e.pointerType === 'mouse';
  }, { passive: true });

  let last = performance.now();
  let lastAbsSpeed = 0;
  const tick = (now) => {
    requestAnimationFrame(tick);
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;

    if (run.lenis) run.lenis.raf(now);
    const y = window.scrollY;
    if (y !== run.scrollY) {
      run.scrollY = y;
      run.c = beatCoord(y);
    }

    if (run.reducedMotion) {
      // No flying camera: hold the nearest beat and cut between beats.
      run.cs = Math.round(run.c);
    } else {
      // Follow scroll briskly so the camera tracks smoothly without floaty lag
      run.cs = damp(run.cs, run.c, run.lenis ? 12 : 9, dt);
      if (Math.abs(run.cs - run.c) < 1e-5) run.cs = run.c;
    }

    const prevD = run.d;
    sampleRun(run.cs, run.sample);
    run.d = run.sample.d;
    const velocity = run.reducedMotion ? 0 : (run.d - prevD) / dt;
    run.speed = damp(run.speed, velocity, 5, dt);
    const absSpeed = Math.abs(run.speed);
    // Scroll speed is not road speed: saturate into a believable readout.
    run.mph = 55 * (1 - Math.exp(-absSpeed / 9));
    const decel = (lastAbsSpeed - absSpeed) / dt;
    lastAbsSpeed = absSpeed;
    run.braking = damp(run.braking, decel > 1.5 && absSpeed > 0.2 ? 1 : 0, decel > 1.5 ? 12 : 3, dt);
    run.miles = Math.max(0, run.d) * MILES_PER_UNIT;
    run.night = damp(run.night, run.theme === 'night' ? 1 : 0, 3.2, dt);
    if (Math.abs(run.night - (run.theme === 'night' ? 1 : 0)) < 1e-4) run.night = run.theme === 'night' ? 1 : 0;

    if (run.stage === 'intro') {
      run.intro = Math.min(1, run.intro + dt / 2.6);
      if (run.intro >= 1) setRun({ stage: 'ready' });
    }

    const nearest = run.sample.nearest;
    if (nearest !== run.nearest || nearest > run.reached) {
      run.nearest = nearest;
      run.reached = Math.max(run.reached, nearest);
      emit();
    }

    frameListeners.forEach((fn) => fn(run, dt));
    if (renderFrame) renderFrame(now);
  };
  requestAnimationFrame(tick);
}
