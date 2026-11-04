'use client';

import { useState } from 'react';
import { quoteEmail } from '@/lib/quote';
import { setLoad, useRun } from '@/lib/runStore';
import IsoIcon from '@/components/iso/IsoIcon';

const EQUIPMENT = [
  { key: 'liftgate', label: 'Liftgate', note: 'No dock at pickup or drop', icon: 'liftgate' },
  { key: 'palletJack', label: 'Pallet jack', note: 'Move it past the curb', icon: 'palletJack' },
  { key: 'twic', label: 'TWIC port access', note: 'Marine terminal or bonded', icon: 'twic' },
];

// Slots are numbered front (cab end) to back, two across, matching the 3D load plan.
const SLOT_COUNT = 12;

export default function QuoteForm() {
  const load = useRun((r) => r.load);
  const [draft, setDraft] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get('_gotcha')) return;
    const url = quoteEmail(data);
    setDraft(url);
    window.location.href = url;
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
        <button type="submit" className="button button-primary">
          Email quote request
        </button>
        <p className="quote-status" role="status">
          {draft ? <>Your email draft is ready. Send it from your email app to request a quote. <a href={draft}>Open draft again</a>.</> : 'Opens your email app. The request is sent only when you send the email.'}
        </p>
        <p className="planner-hint">No email app? Call <a href="tel:5165088078">(516) 508-8078</a> or copy <a href="mailto:Bigmacklogisticsa1@gmail.com">Bigmacklogisticsa1@gmail.com</a>. See our <a href="/privacy-policy">privacy policy</a>.</p>
      </div>
    </form>
  );
}
