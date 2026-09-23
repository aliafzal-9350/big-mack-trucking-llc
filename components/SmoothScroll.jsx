'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { run } from '@/lib/runStore';

// Inertial wheel scrolling on desktop so the camera glides between beats. Touch keeps the
// platform's native scrolling, and reduced-motion users get plain native scroll.
// Lenis has no loop of its own: the run store's frame loop steps it, so scroll, camera
// and render always advance together in the same frame.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    // Mobile/touch devices use native momentum scrolling for zero-latency 120Hz responsiveness.
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    const lenis = new Lenis({ autoRaf: false, lerp: 0.12, wheelMultiplier: 0.95, anchors: true });
    window.__lenis = lenis;
    run.lenis = lenis;
    return () => {
      run.lenis = null;
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);
  return null;
}
