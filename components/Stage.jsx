'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { mark, run, setRun, startRun, subscribe, useRun } from '@/lib/runStore';
import { pickQualityTier } from '@/lib/quality';
import { fontFamily, fontsReady } from '@/lib/fonts';
import IsoIcon from '@/components/iso/IsoIcon';

const Scene = dynamic(() => import('@/components/run/Scene'), { ssr: false });

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

// Loader: the red/white DOT conspicuity tape every trailer carries, running while the truck
// loads and filling up once it is on stage.
function Loader() {
  const stage = useRun((r) => r.stage);
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 7000);
    return () => clearTimeout(t);
  }, []);
  const hidden = stage !== 'loading' || timedOut;
  return (
    <div className="loader" data-hidden={hidden} aria-hidden={hidden}>
      <div className="loader-inner" role="status">
        <span className="loader-label">Loading the truck</span>
        <span className="loader-tape" data-done={stage !== 'loading'} />
      </div>
    </div>
  );
}

function Fallback() {
  return (
    <div className="stage-fallback" aria-hidden="true">
      <IsoIcon name="truck" className="stage-fallback-art" />
    </div>
  );
}

export default function Stage() {
  const [mode, setMode] = useState('pending'); // pending | webgl | fallback

  useEffect(() => {
    mark('hydrated');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const saved = document.documentElement.dataset.theme === 'day' ? 'day' : 'night';
    setRun({
      reducedMotion: motion.matches,
      tier: pickQualityTier(),
      theme: saved,
      night: saved === 'night' ? 1 : 0,
    });
    const onMotion = (e) => setRun({ reducedMotion: e.matches });
    motion.addEventListener('change', onMotion);
    startRun();

    // Mirror the run stage onto <html> for CSS (hero reveal, HUD boot).
    const sync = () => {
      document.documentElement.dataset.stage = run.stage;
    };
    sync();
    const unsubscribe = subscribe(sync);

    let alive = true;
    if (!hasWebGL()) {
      setMode('fallback');
      setRun({ stage: 'fallback' });
    } else {
      // 3D lettering is drawn with the page fonts, so make sure they are ready first.
      const display = fontFamily('--font-display');
      const stencil = fontFamily('--font-stencil');
      const text = fontFamily('--font-text');
      fontsReady([`900 100px ${display}`, `800 100px ${stencil}`, `700 60px ${text}`, `600 40px ${text}`]).then(() => {
        mark('fonts');
        if (alive) setMode('webgl');
      });
    }
    return () => {
      alive = false;
      motion.removeEventListener('change', onMotion);
      unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="stage" aria-hidden="true">
        {mode === 'webgl' ? <Scene /> : null}
        {mode === 'fallback' ? <Fallback /> : null}
      </div>
      {mode !== 'fallback' ? <Loader /> : null}
    </>
  );
}
