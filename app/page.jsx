'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  Anchor,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Compass,
  RotateCw,
  Send,
  Zap,
  MapPin,
  Box,
  FileText
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import logoBadge from '@/public/image/logo-transparent.png';

// TODO: replace with your real Formspree form ID (create a free account at
// formspree.io using Bigmacklogisticsa1@gmail.com, then swap the value below).
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const BigMackCanvas = dynamic(() => import('@/components/BigMackCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center font-mono text-xs tracking-widest text-purple-300">
      <div className="w-10 h-10 border-2 border-purple-400 border-t-transparent rounded-full animate-spin mb-4" />
      <span>Loading 3D preview…</span>
    </div>
  ),
});

const PRESETS = [
  { id: 'orbit', label: 'Rotate', icon: RotateCw },
  { id: 'front', label: 'Front View', icon: Compass },
  { id: 'cab', label: 'Cab Detail', icon: FileText },
  { id: 'side', label: 'Side Branding', icon: Box },
  { id: 'rear', label: 'Rear View', icon: Truck },
];

export default function HomePage() {
  const [activePreset, setActivePreset] = useState('front');
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  const [origin, setOrigin] = useState('JFK Air Cargo (NY)');
  const [destination, setDestination] = useState('Port Newark (NJ)');
  const [pallets, setPallets] = useState(6);
  const [weight, setWeight] = useState('4,500 lbs');
  const [needLiftgate, setNeedLiftgate] = useState(true);
  const [needPalletJack, setNeedPalletJack] = useState(true);
  const [needTWIC, setNeedTWIC] = useState(false);
  const [formSent, setFormSent] = useState(false);
  const [formError, setFormError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [heroMounted, setHeroMounted] = useState(false);

  React.useEffect(() => {
    const frame = requestAnimationFrame(() => setHeroMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const heroReveal = `transition-all duration-700 ease-out ${heroMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`;
  const heroRevealStyle = (delayMs) => ({ transitionDelay: heroMounted ? `${delayMs}ms` : '0ms' });

  const handlePresetSelect = (preset) => {
    setActivePreset(preset);
    setIsAutoRotating(preset === 'orbit');
  };

  const handleRateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(false);

    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setFormSent(true);
        setTimeout(() => setFormSent(false), 6000);
      } else {
        setFormError(true);
      }
    } catch {
      setFormError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-900 text-slate-100 font-sans selection:bg-purple-600 selection:text-white antialiased overflow-x-hidden">

      {/* TOP COMPLIANCE BAR */}
      <div className="border-b border-white/10 bg-obsidian-950 text-slate-400 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px] tracking-wide">
            <span className="text-slate-300">USDOT# 3843409</span>
            <span className="hidden sm:inline text-white/15">|</span>
            <span className="text-slate-300">MC# 1398475</span>
            <span className="hidden md:inline text-white/15">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-purple-300">
              <ShieldCheck className="w-3.5 h-3.5" />
              TWIC Certified Driver
            </span>
          </div>
          <div className="flex items-center gap-5 font-mono text-xs">
            <a href="tel:5165088078" className="flex items-center gap-1.5 text-slate-200 hover:text-purple-300 transition">
              <Phone className="w-3.5 h-3.5 text-purple-300" />
              <span>(516) 508-8078</span>
            </a>
            <a
              href="mailto:Bigmacklogisticsa1@gmail.com"
              className="hidden sm:flex items-center gap-1.5 text-slate-400 hover:text-purple-300 transition"
            >
              <Mail className="w-3.5 h-3.5 text-purple-300" />
              <span>Bigmacklogisticsa1@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="border-b border-white/10 bg-obsidian-900/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3.5 group">
            <div className="relative h-11 w-11 sm:h-[52px] sm:w-[52px] flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={logoBadge}
                alt="Big Mack Trucking LLC logo"
                priority
                fill
                sizes="52px"
                className="object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
              />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-semibold tracking-tight text-white block leading-none font-display">
                Big Mack<span className="text-purple-400">.</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono tracking-widest text-slate-400 uppercase block mt-1.5">
                Trucking LLC — Expedited Freight
              </span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-8 text-sm text-slate-300">
            {[
              { href: '#hero', label: 'Overview', active: true },
              { href: '#equipment', label: 'Equipment' },
              { href: '#twic', label: 'Credentials' },
              { href: '#dispatch', label: 'Get a Quote' },
            ].map(({ href, label, active }) => (
              <a
                key={href}
                href={href}
                className={`relative py-1 transition-colors group ${active ? 'text-white font-medium' : 'hover:text-white'}`}
              >
                {label}
                <span className={`absolute left-0 -bottom-0.5 h-px bg-purple-400 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            ))}
          </nav>

          <a
            href="tel:5165088078"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold tracking-wide uppercase px-5 py-3 rounded-xl transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-600/20"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Now</span>
          </a>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative flex flex-col justify-between px-4 sm:px-8 max-w-7xl mx-auto pt-6 pb-8 md:min-h-[calc(100vh-104px)]">

        {/* Soft scrim, desktop only — mobile keeps the canvas in its own box below the text instead */}
        <div className="hidden md:block absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-obsidian-900/75 via-obsidian-900/15 to-transparent" />

        <div className="relative z-10 max-w-xl mt-2 sm:mt-6 md:pointer-events-none">
          <p className={`text-xs font-mono uppercase tracking-widest text-purple-300 mb-4 ${heroReveal}`} style={heroRevealStyle(0)}>
            Omari Headley, Owner-Operator
          </p>

          <h1 className={`text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-semibold tracking-tight text-white leading-[1.03] font-display ${heroReveal}`} style={heroRevealStyle(90)}>
            Freight you can<br />
            <span className="purple-gradient-text">count on.</span>
          </h1>

          <p className={`mt-5 text-sm sm:text-base text-slate-300 leading-relaxed max-w-md ${heroReveal}`} style={heroRevealStyle(220)}>
            A dock-high 26ft box truck equipped with a heavy-duty liftgate, onboard pallet jack, and certified TWIC access — built for expedited freight across the NY/NJ region.
          </p>

          <div className={`mt-7 flex flex-wrap gap-3 pointer-events-auto ${heroReveal}`} style={heroRevealStyle(340)}>
            <a
              href="#dispatch"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase tracking-widest px-7 py-4 rounded-xl transition-all hover:scale-[1.03] flex items-center gap-2"
            >
              Get a Quote
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="tel:5165088078"
              className="border border-white/15 hover:border-white/30 hover:bg-white/5 text-white text-xs tracking-wider uppercase px-6 py-4 rounded-xl transition-all backdrop-blur-md flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-purple-300" />
              <span>(516) 508-8078</span>
            </a>
          </div>

          <div className={`grid grid-cols-3 gap-4 sm:gap-6 pt-6 mt-6 border-t border-white/10 max-w-md ${heroReveal}`} style={heroRevealStyle(440)}>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-mono">GVWR</span>
              <span className="text-sm font-bold text-white">26,000 LBS</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-mono">Handling</span>
              <span className="text-sm font-bold text-white">Liftgate + Jack</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wide block font-mono">Security</span>
              <span className="text-sm font-bold text-purple-300">TWIC Certified</span>
            </div>
          </div>
        </div>

        {/* 3D truck: its own boxed panel in normal flow on mobile, full-bleed background overlay from md+ */}
        <div className="relative order-2 w-full h-[52vh] min-h-[340px] mt-6 rounded-3xl overflow-hidden border border-white/10 md:order-none md:absolute md:inset-0 md:z-0 md:h-auto md:min-h-0 md:w-auto md:mt-0 md:rounded-none md:border-0">
          <BigMackCanvas activePreset={activePreset} isAutoRotating={isAutoRotating} />
        </div>

        {/* CAMERA PRESET DOCK */}
        <div className="relative z-10 order-3 flex flex-col items-center mt-6 md:order-none md:items-end md:mt-0">
          <div className="glass-panel-glow p-1.5 rounded-2xl flex flex-wrap items-center justify-center gap-1 max-w-xl">
            {PRESETS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handlePresetSelect(id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition ${
                  activePreset === id
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-purple-300" />
                <span>{label}</span>
                {activePreset === id && <span className="w-1 h-1 rounded-full bg-purple-400 ml-0.5" />}
              </button>
            ))}
          </div>
          <div className="mt-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
            Drag to rotate
          </div>
        </div>

      </section>

      {/* EQUIPMENT — light band for visual rhythm against the dark hero/footer */}
      <section id="equipment" className="bg-paper py-24 sm:py-32 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">

          <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-700 block mb-2">
                Equipment
              </span>
              <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-obsidian-950 font-display">
                Built for the work.
              </h2>
            </div>
            <p className="text-slate-600 text-sm max-w-lg leading-relaxed">
              Big Mack Trucking LLC runs professional-grade commercial equipment designed to eliminate freight handling bottlenecks at shipping docks, ports, and job sites.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Truck,
                eyebrow: '26FT Straight Box',
                title: 'Dock-High Clearance',
                body: 'Standard dock height floor for immediate pallet jack access and cross-dock turnaround.',
                points: ['High-cube interior volume', 'Up to 12 standard 48×40 pallets', '26,000 LBS GVWR, non-CDL'],
              },
              {
                icon: Layers,
                eyebrow: 'Hydraulic Liftgate',
                title: 'Heavy-Duty Platform',
                body: 'Hydraulic ground-to-box transfer for self-sufficient deliveries without a warehouse dock.',
                points: ['3,500 LBS lift capacity', 'Level-ride tilt mechanics', 'Ground, storefront & site delivery'],
              },
              {
                icon: Box,
                eyebrow: 'Pallet Jack & Straps',
                title: 'Onboard Handling',
                body: 'A heavy-duty commercial pallet jack rides on the truck, with ratchet straps and E-track load locks.',
                points: ['Industrial onboard pallet jack', 'Commercial ratchet straps', 'Dual-track E-track securement'],
              },
              {
                icon: Anchor,
                eyebrow: 'Maritime Credentials',
                title: 'TWIC Card Certified',
                body: 'Federal clearance for unescorted entry into secure maritime ports, airports, and military terminals.',
                points: ['Port Newark / Bayonne ready', 'JFK / EWR air cargo verified', 'Zero escort delays or fees'],
              },
            ].map((card, i) => (
              <Reveal key={card.eyebrow} delay={i * 90}>
                <div className="h-full bg-white border border-black/[0.06] p-7 rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:border-purple-400/40 hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all duration-300">
                  <div className="w-12 h-12 rounded-2xl border border-black/[0.08] flex items-center justify-center text-purple-600 mb-6">
                    <card.icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-purple-600 tracking-wider uppercase block">{card.eyebrow}</span>
                  <h3 className="text-xl font-semibold text-obsidian-950 mt-1 mb-3 font-display">{card.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4">{card.body}</p>
                  <div className="pt-4 border-t border-black/[0.06] text-[11px] text-slate-600 space-y-1.5">
                    {card.points.map((p) => <p key={p}>{p}</p>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TWIC / PORT ACCESS */}
      <section id="twic" className="py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <Reveal className="bg-obsidian-800 border border-white/10 rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-purple-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Transportation Worker Identification Credential
              </span>
              <h2 className="text-3xl sm:text-4xl font-semibold text-white font-display">
                Unrestricted maritime port access.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                Avoid dock wait times, paperwork bottlenecks, and third-party escort fees. Big Mack Trucking LLC holds active TWIC accreditation, letting Omari Headley access container freight stations, maritime piers, and bonded airport warehouses directly.
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-x-8 gap-y-2 pt-2 text-sm text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0" />
                  <span>Port Newark / Elizabeth Marine Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0" />
                  <span>Red Hook Container Terminal (Brooklyn)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-300 flex-shrink-0" />
                  <span>JFK & Newark Air Cargo Corridors</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-end">
              <div className="border border-white/10 p-6 rounded-2xl text-center w-full max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-purple-300">
                  <Anchor className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono text-purple-300 uppercase block">Port Clearance</span>
                <span className="text-xl font-semibold text-white block mt-1 font-display">TWIC Verified</span>
                <p className="text-[11px] text-slate-400 mt-2">
                  Official badge on driver file. Expedited container drop-offs and unescorted pickups.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* GET A QUOTE */}
      <section id="dispatch" className="py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-obsidian-800 border border-white/10 rounded-3xl p-8 sm:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <Reveal className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-purple-300 text-xs font-mono uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5" />
                Book Direct
              </div>

              <h2 className="text-3xl sm:text-5xl font-semibold text-white font-display">
                Booking made simple.
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Brokers and shippers book directly with <strong className="text-white">Omari Headley</strong> — fast rate confirmations, dedicated freight capacity, and continuous load tracking.
              </p>

              <div className="space-y-4 pt-2">
                <a
                  href="tel:5165088078"
                  className="bg-obsidian-700 hover:bg-obsidian-650 p-5 rounded-2xl border border-white/10 hover:border-purple-400/30 flex items-center gap-4 transition-all hover:-translate-y-0.5 group block"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-purple-300 flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">Priority 24/7 Dispatch</span>
                    <span className="text-xl font-bold text-white group-hover:text-purple-300 transition">
                      (516) 508-8078
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Instant verbal quote & rate confirmation</span>
                  </div>
                </a>

                <a
                  href="mailto:Bigmacklogisticsa1@gmail.com"
                  className="bg-obsidian-700 hover:bg-obsidian-650 p-5 rounded-2xl border border-white/10 hover:border-purple-400/30 flex items-center gap-4 transition-all hover:-translate-y-0.5 group block"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-purple-300 flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-mono">Rate Confirmation Email</span>
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition break-all">
                      Bigmacklogisticsa1@gmail.com
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Send broker load sheets & packets</span>
                  </div>
                </a>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs">
                <span className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-300">MC# 1398475</span>
                <span className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-300">USDOT# 3843409</span>
                <span className="px-3 py-1.5 rounded-lg border border-white/10 text-slate-300">GVWR 26,000 LBS</span>
              </div>
            </Reveal>

            <Reveal delay={120} className="lg:col-span-6 bg-obsidian-900 border border-white/10 p-8 rounded-3xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-xl font-semibold font-display text-white">Request a Quote</h3>
                  <p className="text-xs text-slate-400">Sent directly to dispatch</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <Send className="w-4 h-4 text-purple-300" />
                </div>
              </div>

              <form onSubmit={handleRateSubmit} className="space-y-4 text-sm">
                <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 uppercase block mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-300" /> Pickup Origin
                    </label>
                    <input
                      type="text"
                      name="origin"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="e.g. JFK Airport (NY) or 11430"
                      className="w-full bg-obsidian-800 border border-white/10 rounded-xl p-3 text-white placeholder:text-slate-600 focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/60 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 uppercase block mb-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-300" /> Destination
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Newark (NJ) or 07114"
                      className="w-full bg-obsidian-800 border border-white/10 rounded-xl p-3 text-white placeholder:text-slate-600 focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/60 outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 uppercase block mb-1">
                      Pallet Count ({pallets} {pallets === 1 ? 'Pallet' : 'Pallets'})
                    </label>
                    <select
                      name="pallets"
                      value={pallets}
                      onChange={(e) => setPallets(Number(e.target.value))}
                      className="w-full bg-obsidian-800 border border-white/10 rounded-xl p-3 text-white focus:border-purple-400/60 outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Pallet' : 'Pallets'} (48×40)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 uppercase block mb-1">Estimated Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 5,000 lbs"
                      className="w-full bg-obsidian-800 border border-white/10 rounded-xl p-3 text-white placeholder:text-slate-600 focus:border-purple-400/60 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase block mb-2">Accessorial Equipment Needed</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'liftgate', label: 'Liftgate', checked: needLiftgate, set: setNeedLiftgate },
                      { key: 'palletJack', label: 'Pallet Jack', checked: needPalletJack, set: setNeedPalletJack },
                      { key: 'twic', label: 'TWIC Port', checked: needTWIC, set: setNeedTWIC },
                    ].map(({ key, label, checked, set }) => (
                      <label
                        key={key}
                        className={`flex items-center gap-1.5 p-2.5 rounded-xl border cursor-pointer text-[11px] transition ${
                          checked ? 'bg-purple-600/15 border-purple-400/40 text-white' : 'bg-obsidian-800 border-white/10 text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          name={key}
                          checked={checked}
                          onChange={(e) => set(e.target.checked)}
                          className="sr-only"
                        />
                        <CheckCircle2 className={`w-3.5 h-3.5 ${checked ? 'text-purple-300' : 'text-slate-600'}`} />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 uppercase block mb-1">Broker / Shipper Contact Information</label>
                  <input
                    type="text"
                    name="broker_contact"
                    placeholder="Company name, contact phone or direct email"
                    className="w-full bg-obsidian-800 border border-white/10 rounded-xl p-3 text-white placeholder:text-slate-600 focus:border-purple-400/60 outline-none"
                    required
                  />
                </div>

                {formSent ? (
                  <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-center font-semibold text-sm">
                    Quote request sent — dispatch will reach out shortly.
                  </div>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-60 text-white font-bold uppercase tracking-wider py-4 rounded-xl transition flex items-center justify-center gap-2"
                    >
                      <span>{isSubmitting ? 'Sending…' : 'Send Quote Request'}</span>
                      {!isSubmitting && <ArrowUpRight className="w-4 h-4" />}
                    </button>
                    {formError && (
                      <p className="text-xs text-red-300 text-center">
                        Something went wrong sending your request — please call (516) 508-8078 or email us directly instead.
                      </p>
                    )}
                  </>
                )}
              </form>
            </Reveal>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-obsidian-950 text-slate-400 pt-16 pb-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10 text-sm">

            <Reveal className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                  <Image
                    src={logoBadge}
                    alt="Big Mack Trucking LLC official logo"
                    fill
                    sizes="64px"
                    className="object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]"
                  />
                </div>
                <div>
                  <span className="text-lg font-semibold tracking-tight text-white block font-display">
                    Big Mack Trucking LLC
                  </span>
                  <span className="text-[10px] text-purple-300 uppercase font-mono tracking-widest">Expedited Freight</span>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Authorized commercial motor carrier delivering dock-high 26ft straight box freight, heavy-duty hydraulic liftgate ground operations, and TWIC-certified maritime port transport.
              </p>
              <div className="flex gap-2 pt-1 font-mono">
                <span className="border border-white/10 text-slate-300 px-2.5 py-1 rounded text-[10px]">MC# 1398475</span>
                <span className="border border-white/10 text-slate-300 px-2.5 py-1 rounded text-[10px]">USDOT# 3843409</span>
              </div>
            </Reveal>

            <Reveal delay={80} className="space-y-2.5 text-[13px]">
              <span className="font-semibold text-white uppercase block text-xs tracking-wider font-mono">Fleet & Hardware</span>
              <p>Straight box truck (26ft)</p>
              <p>Dock-high floor alignment</p>
              <p>3,500 LB hydraulic liftgate</p>
              <p>Industrial pallet jack onboard</p>
              <p>Heavy-duty ratchet straps & E-track</p>
            </Reveal>

            <Reveal delay={160} className="space-y-2.5 text-[13px]">
              <span className="font-semibold text-white uppercase block text-xs tracking-wider font-mono">Security & Clearances</span>
              <p className="text-purple-300 font-medium">TWIC card certified driver</p>
              <p>Maritime port access ready</p>
              <p>FMCSA active authorized carrier</p>
              <p>Rated GVWR 26,000 LBS</p>
              <p>Comprehensive cargo & auto liability</p>
            </Reveal>

            <Reveal delay={240} className="space-y-2.5 text-[13px]">
              <span className="font-semibold text-white uppercase block text-xs tracking-wider font-mono">Direct Dispatch</span>
              <p className="text-white font-medium">Principal: Omari Headley</p>
              <p>
                <a href="tel:5165088078" className="text-purple-300 hover:text-white font-semibold transition">
                  Dispatch: (516) 508-8078
                </a>
              </p>
              <p>
                <a href="mailto:Bigmacklogisticsa1@gmail.com" className="text-slate-300 hover:text-purple-300 transition break-all">
                  Bigmacklogisticsa1@gmail.com
                </a>
              </p>
              <p className="text-slate-500 text-[11px] pt-1">Dispatch hours: 24/7 expedited coverage</p>
            </Reveal>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px] font-mono">
            <p>© {new Date().getFullYear()} Big Mack Trucking LLC. All rights reserved.</p>
            <p>USDOT# 3843409 • MC# 1398475 • Principal: Omari Headley</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
