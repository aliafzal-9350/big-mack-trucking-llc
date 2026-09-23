'use client';

import { useState } from 'react';
import { setLoad, useRun } from '@/lib/runStore';
import IsoIcon from '@/components/iso/IsoIcon';

// TODO: replace with your real Formspree form ID (create a free account at
// formspree.io using Bigmacklogisticsa1@gmail.com, then swap the value below).
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const EQUIPMENT = [
  { key: 'liftgate', label: 'Liftgate', note: 'No dock at pickup or drop', icon: 'liftgate' },
  { key: 'palletJack', label: 'Pallet jack', note: 'Move it past the curb', icon: 'palletJack' },
  { key: 'twic', label: 'TWIC port access', note: 'Marine terminal or bonded', icon: 'twic' },
];

// Slots are numbered front (cab end) to back, two across, matching the 3D load plan.
const SLOT_COUNT = 12;

export default function QuoteForm() {
  const load = useRun((r) => r.load);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus('sending');
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(String(response.status));
      setStatus('sent');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <form className="quote" onSubmit={onSubmit} noValidate={false}>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="honeypot" aria-hidden="true" />

      <fieldset className="planner">
        <legend>
          <span>Pallets</span>
          <output className="planner-count" aria-live="polite">
            {load.pallets} of {SLOT_COUNT} positions
          </output>
        </legend>
        <div className="planner-plan">
          <div className="planner-slots">
            {Array.from({ length: SLOT_COUNT }, (_, i) => {
              const n = i + 1;
              return (
                <label key={n} className="slot" data-filled={i < load.pallets} style={{ '--row': Math.floor(i / 2), '--col': i % 2 }}>
                  <input
                    type="radio"
                    name="pallets"
                    value={n}
                    checked={load.pallets === n}
                    onChange={() => setLoad({ pallets: n })}
                  />
                  <span className="visually-hidden">
                    {n} {n === 1 ? 'pallet' : 'pallets'}
                  </span>
                </label>
              );
            })}
          </div>
          <span className="planner-cab" aria-hidden="true">
            Cab
          </span>
        </div>
        <p className="planner-hint">Standard 48 × 40 pallets, two across. The truck on screen loads to match.</p>
      </fieldset>

      <div className="field-row">
        <label className="field">
          <span>Pickup</span>
          <input type="text" name="origin" placeholder="Address, ZIP or terminal" autoComplete="off" required />
        </label>
        <label className="field">
          <span>Delivery</span>
          <input type="text" name="destination" placeholder="Address, ZIP or terminal" autoComplete="off" required />
        </label>
      </div>

      <label className="field">
        <span>Total weight</span>
        <input
          type="text"
          name="weight"
          placeholder="4,500 lb"
          inputMode="numeric"
          onChange={(e) => setLoad({ weight: e.target.value.trim() || '4,500 lbs' })}
          required
        />
      </label>

      <fieldset className="equipment">
        <legend>Equipment for this load</legend>
        <div className="equipment-grid">
          {EQUIPMENT.map((item) => (
            <label key={item.key} className="tile">
              <input
                type="checkbox"
                name={item.key}
                checked={Boolean(load[item.key])}
                onChange={(e) => setLoad({ [item.key]: e.target.checked })}
              />
              <IsoIcon name={item.icon} className="tile-icon" />
              <span className="tile-label">{item.label}</span>
              <span className="tile-note">{item.note}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field">
        <span>Your company and a phone or email</span>
        <input type="text" name="broker_contact" placeholder="Company, name, phone or email" autoComplete="organization" required />
      </label>

      <div className="quote-submit">
        <button type="submit" className="button button-primary" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending quote request…' : 'Send quote request'}
        </button>
        <p className="quote-status" role="status">
          {status === 'sent' ? 'Quote request sent. Dispatch will call you back shortly.' : null}
        </p>
        {status === 'error' ? (
          <p className="quote-error" role="alert">
            The request didn&apos;t go through. Call <a href="tel:5165088078">(516) 508-8078</a> or email{' '}
            <a href="mailto:Bigmacklogisticsa1@gmail.com">Bigmacklogisticsa1@gmail.com</a>.
          </p>
        ) : null}
      </div>
    </form>
  );
}
