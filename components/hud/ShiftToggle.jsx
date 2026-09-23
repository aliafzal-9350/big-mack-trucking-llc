'use client';

import { setRun, useRun } from '@/lib/runStore';
import IsoIcon from '@/components/iso/IsoIcon';

export const THEME_KEY = 'bigmack-shift';

// Night shift / day shift. The streetlight icon's head is lit on the night shift.
export default function ShiftToggle() {
  const theme = useRun((r) => r.theme);
  const next = theme === 'night' ? 'day' : 'night';

  const toggle = () => {
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // storage blocked: the choice still applies for this visit
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'night' ? '#0b0817' : '#e2dde7');
    setRun({ theme: next });
  };

  return (
    <button type="button" className="shift-toggle" onClick={toggle} aria-label={`Switch to ${next} shift`}>
      <IsoIcon name="lamp" className="shift-icon" />
      <span className="shift-label">{theme === 'night' ? 'Night shift' : 'Day shift'}</span>
    </button>
  );
}
