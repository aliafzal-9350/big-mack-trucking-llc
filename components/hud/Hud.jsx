'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { BEATS, MILES_PER_UNIT, WAYPOINTS } from '@/lib/timeline';
import { STOPS } from '@/lib/stops';
import { beatScrollTarget, onFrame, run, useRun } from '@/lib/runStore';
import IsoIcon from '@/components/iso/IsoIcon';
import ShiftToggle from './ShiftToggle';
import logo from '@/public/image/logo-transparent.png';

export const NAV = [
  { id: 'pickup', n: 1, label: 'Pickup', icon: 'dock', beats: ['pickup'] },
  { id: 'transit', n: 2, label: 'Transit', icon: 'route', beats: ['transit', 'map'] },
  { id: 'port', n: 3, label: 'Port gate', icon: 'twic', beats: ['port'] },
  { id: 'drop', n: 4, label: 'Drop', icon: 'liftgate', beats: ['drop'] },
  { id: 'book', n: 5, label: 'Book', icon: 'pallets', beats: ['book'] },
];

const HOTSPOTS = {
  box: { title: '26-ft dock-high box', detail: 'Up to 12 pallets, 48 × 40' },
  dock: { title: 'Floor at dock height', detail: 'Pallets roll straight on' },
  liftgate: { title: 'Hydraulic liftgate', detail: '3,500 lb down to street level' },
  straps: { title: 'Straps and E-track', detail: 'Every load secured for the road' },
};

const ROUTE_UNITS = STOPS.drop;
const nyTime = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });

/** Smooth-scroll to a beat's reading position (Lenis when present, native otherwise). */
export function goToBeat(id, event) {
  if (event) event.preventDefault();
  const y = beatScrollTarget(id);
  if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.6 });
  else window.scrollTo({ top: y, behavior: run.reducedMotion ? 'auto' : 'smooth' });
}

function useActiveNav() {
  const nearest = useRun((r) => r.nearest);
  const beatId = BEATS[nearest]?.id;
  return NAV.find((n) => n.beats.includes(beatId))?.id ?? null;
}

function TopBar() {
  return (
    <header className="hud-top">
      <a href="#top" className="brand" aria-label="Big Mack Trucking, back to top" onClick={(e) => goToBeat('hero', e)}>
        <Image src={logo} alt="Big Mack Trucking emblem" width={44} height={44} priority className="brand-badge" />
        <div className="brand-text">
          <span className="brand-name">Big Mack Trucking</span>
          <span className="brand-tag">Expedited Freight</span>
        </div>
      </a>
      <div className="hud-actions">
        <ShiftToggle />
        <a href="tel:5165088078" className="call" aria-label="Call dispatch: (516) 508-8078">
          <svg className="call-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <span className="call-text">
            <span className="call-label">Call dispatch</span>
            <span className="call-number">(516) 508-8078</span>
          </span>
        </a>
      </div>
    </header>
  );
}

function Telemetry() {
  const status = useRef();
  const speed = useRef();
  const trip = useRef();
  const eta = useRef();
  const clock = useRef();
  const fill = useRef();
  const truck = useRef();
  const stamp = useRef();

  useEffect(() => {
    let last = {};
    let lastEtaTime = 0;
    let lastRemaining = -1;
    let lastEtaStr = '';
    const write = (key, el, value) => {
      if (el && last[key] !== value) {
        el.textContent = value;
        last[key] = value;
      }
    };
    const off = onFrame(() => {
      const moving = Math.abs(run.speed) > 0.6;
      write('status', status.current, moving ? 'In transit' : BEATS[run.nearest]?.status ?? '');
      write('speed', speed.current, String(run.mph < 1.5 ? 0 : Math.round(run.mph)));
      write('trip', trip.current, run.miles.toFixed(1));

      const remaining = Math.max(0, ROUTE_UNITS - run.d) * MILES_PER_UNIT;
      if (remaining < 0.05) {
        write('eta', eta.current, 'Arrived');
      } else {
        const now = Date.now();
        if (now - lastEtaTime > 2500 || Math.abs(remaining - lastRemaining) > 0.25) {
          lastEtaTime = now;
          lastRemaining = remaining;
          lastEtaStr = nyTime.format(new Date(now + (remaining / 28) * 3600e3));
        }
        write('eta', eta.current, lastEtaStr);
      }

      const p = Math.min(1, Math.max(0, run.d / ROUTE_UNITS));
      if (fill.current) fill.current.style.transform = `scaleX(${p.toFixed(4)})`;
      if (truck.current) truck.current.style.left = `${(p * 100).toFixed(2)}%`;
      if (stamp.current) stamp.current.dataset.on = run.d > STOPS.port + 0.4 && run.d < STOPS.port + 12 ? 'yes' : 'no';
    });
    const tick = () => write('clock', clock.current, nyTime.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => {
      off();
      clearInterval(id);
    };
  }, []);

  return (
    <>
      <div className="hud-telemetry" aria-hidden="true">
        <div className="readout readout-status">
          <span className="readout-label">Unit 01</span>
          <span className="readout-value" ref={status}>Ready at dock 7</span>
        </div>
        <div className="readout">
          <span className="readout-label">Speed</span>
          <span className="readout-value"><span ref={speed}>0</span><small>mph</small></span>
        </div>
        <div className="readout">
          <span className="readout-label">Trip</span>
          <span className="readout-value"><span ref={trip}>0.0</span><small>mi</small></span>
        </div>
        <div className="readout readout-wide">
          <span className="readout-label">ETA at drop</span>
          <span className="readout-value" ref={eta}>–</span>
        </div>
        <div className="readout readout-wide">
          <span className="readout-label">New York</span>
          <span className="readout-value" ref={clock}>–</span>
        </div>
      </div>
      <div className="hud-route" aria-hidden="true">
        <span className="hud-route-end">JFK Air Cargo</span>
        <span className="hud-route-track">
          {WAYPOINTS.map((w) => (
            <span key={w.id} className="hud-route-stop" style={{ left: `${(w.d / ROUTE_UNITS) * 100}%` }} />
          ))}
          <span className="hud-route-fill" ref={fill} />
          <span className="hud-route-truck" ref={truck} />
        </span>
        <span className="hud-route-end">Drop</span>
      </div>
      <div className="hud-stamp" ref={stamp} data-on="no" aria-hidden="true">
        <IsoIcon name="twic" className="hud-stamp-icon" />
        <span>TWIC verified at Port Newark</span>
      </div>
    </>
  );
}


function StopRail() {
  const active = useActiveNav();
  return (
    <nav className="hud-rail" aria-label="Run progress">
      <ol>
        {NAV.map((stop) => (
          <li key={stop.id} data-active={active === stop.id}>
            <a href={`#${stop.id}`} onClick={(e) => goToBeat(stop.id, e)} aria-current={active === stop.id ? 'step' : undefined}>
              <IsoIcon name={stop.icon} className="hud-rail-icon" />
              <span className="hud-rail-label">
                <span className="hud-rail-n">{stop.n}</span> {stop.label}
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

function register(id) {
  return (el) => {
    run.hotspotEls = run.hotspotEls || {};
    if (el) run.hotspotEls[id] = el;
    else delete run.hotspotEls[id];
  };
}

// Labels pinned to parts of the truck; the 3D scene moves them every frame.
function Hotspots() {
  const nearest = useRun((r) => r.nearest);
  const stage = useRun((r) => r.stage);
  const visible = stage === 'ready' ? BEATS[nearest]?.hotspots ?? [] : [];
  const [open, setOpen] = useState(null);
  return (
    <div className="hotspots">
      {Object.entries(HOTSPOTS).map(([id, spot]) => (
        <div key={id} ref={register(id)} className="hotspot" data-active={visible.includes(id)} data-facing="no">
          <button
            type="button"
            className="hotspot-pin"
            aria-expanded={open === id}
            tabIndex={visible.includes(id) ? 0 : -1}
            onClick={() => setOpen(open === id ? null : id)}
            onBlur={() => setOpen(null)}
          >
            <span className="visually-hidden">{spot.title}</span>
          </button>
          <div className="hotspot-card" data-open={open === id}>
            <strong>{spot.title}</strong>
            <span>{spot.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function MapLabels() {
  return (
    <div className="map-labels" aria-hidden="true">
      {WAYPOINTS.map((w) => (
        <div key={w.id} ref={register(`wp-${w.id}`)} className="wp-label" style={{ opacity: 0 }}>
          <span className="wp-name">{w.label}</span>
          <span className="wp-mile">{(w.d * MILES_PER_UNIT).toFixed(0)} mi</span>
        </div>
      ))}
    </div>
  );
}

export default function Hud() {
  const nearest = useRun((r) => r.nearest);
  return (
    <>
      {/* Pins sit under the page content, so text sheets always cover them. */}
      <div className="pins">
        <Hotspots />
        <MapLabels />
      </div>
      <div className="hud" data-beat={BEATS[nearest]?.id}>
        <div className="hud-corners" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>
        <TopBar />
        <StopRail />
        <Telemetry />
      </div>
    </>
  );
}
