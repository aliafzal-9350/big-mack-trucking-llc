'use client';

import React, { useState, useEffect } from 'react';
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
  FileText,
  Sun,
  Moon,
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
  const [theme, setTheme] = useState('dark');
  const [activePreset, setActivePreset] = useState('orbit');
  const [isAutoRotating, setIsAutoRotating] = useState(true);

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

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('bigmack-theme');
      if (saved === 'light' || saved === 'dark') setTheme(saved);
    } catch {
      // ignore -- private browsing / storage blocked
    }

    // Eagerly pre-warm 3D model asset stream in the background
    if (typeof window !== 'undefined') {
      try {
        fetch('/models/truck.glb', { priority: 'high' }).catch(() => {});
        const img = new window.Image();
        img.src = '/image/logo-transparent.png';
      } catch (_) {}
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem('bigmack-theme', next);
      } catch {
        // ignore
      }
      return next;
    });
  };

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

  const isDark = theme === 'dark';

  // Centralized theme tokens -- swap once here rather than sprinkling
  // ternaries through every section below.
  const T = {
    page: isDark ? 'bg-obsidian-900 text-slate-100' : 'bg-paper text-obsidian-950',
    topBarBg: isDark ? 'bg-obsidian-950 border-white/10' : 'bg-white border-black/[0.06]',
    topBarMuted: isDark ? 'text-slate-400' : 'text-slate-500',
    topBarStrong: isDark ? 'text-slate-300' : 'text-slate-700',
    divider: isDark ? 'text-white/15' : 'text-black/10',
    headerBg: isDark ? 'bg-obsidian-900/85 border-white/10' : 'bg-paper/85 border-black/[0.06]',
    navMuted: isDark ? 'text-slate-300' : 'text-slate-600',
    navHover: isDark ? 'hover:text-white' : 'hover:text-obsidian-950',
    navActive: isDark ? 'text-white' : 'text-obsidian-950',
    wordmark: isDark ? 'text-white' : 'text-obsidian-950',
    subWordmark: isDark ? 'text-slate-400' : 'text-slate-500',
    accent: isDark ? 'text-purple-300' : 'text-purple-700',
    accentBadge: isDark ? 'text-purple-300' : 'text-purple-700',
    heroScrim: isDark
      ? 'from-obsidian-900/80 via-obsidian-900/20 to-transparent'
      : 'from-paper/90 via-paper/30 to-transparent',
    heroHeading: isDark ? 'text-white' : 'text-obsidian-950',
    heroBody: isDark ? 'text-slate-300' : 'text-slate-600',
    heroStatLabel: isDark ? 'text-slate-400' : 'text-slate-500',
    heroStatValue: isDark ? 'text-white' : 'text-obsidian-950',
    hairline: isDark ? 'border-white/10' : 'border-black/10',
    secondaryBtn: isDark
      ? 'border-white/15 hover:border-white/30 hover:bg-white/5 text-white'
      : 'border-black/15 hover:border-black/30 hover:bg-black/5 text-obsidian-950',
    iconToggle: isDark
      ? 'border-white/15 hover:border-white/30 hover:bg-white/5 text-slate-200'
      : 'border-black/15 hover:border-black/30 hover:bg-black/5 text-slate-700',
    cardBg: isDark ? 'bg-obsidian-800' : 'bg-white',
    cardBorder: isDark ? 'border-white/10' : 'border-black/[0.06]',
    cardShadow: isDark ? '' : 'shadow-[0_1px_2px_rgba(0,0,0,0.04)]',
    cardHoverShadow: isDark ? '' : 'hover:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.12)]',
    sectionBody: isDark ? 'text-slate-300' : 'text-slate-600',
    heading: isDark ? 'text-white' : 'text-obsidian-950',
    mutedBadge: isDark ? 'border-white/10 text-slate-300' : 'border-black/10 text-slate-600',
    iconTile: isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.03] border-black/[0.08]',
    subCardBg: isDark ? 'bg-obsidian-700 hover:bg-obsidian-650' : 'bg-black/[0.02] hover:bg-black/[0.04]',
    inputBg: isDark
      ? 'bg-obsidian-800 border-white/10 text-white placeholder:text-slate-600'
      : 'bg-white border-black/10 text-obsidian-950 placeholder:text-slate-400',
    formPanelBg: isDark ? 'bg-obsidian-900 border-white/10' : 'bg-white border-black/[0.06]',
    footerBg: isDark ? 'bg-obsidian-950 border-white/10' : 'bg-white border-black/[0.06]',
    footerMuted: isDark ? 'text-slate-400' : 'text-slate-500',
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-purple-600 selection:text-white antialiased overflow-x-hidden transition-colors duration-300 ${T.page}`}>

      {/* Imprinted brand watermark in page background -- visible & elegant across mobile, tablet, and desktop */}
      <div
        className={`fixed right-[-50px] top-[-20px] w-[320px] h-[320px] sm:w-[480px] sm:h-[480px] md:right-[-70px] md:top-[-35px] lg:right-[-100px] lg:top-[-60px] lg:w-[640px] lg:h-[640px] xl:w-[740px] xl:h-[740px] pointer-events-none select-none z-0 transition-all duration-500 ${
          isDark ? 'opacity-[0.16] sm:opacity-[0.18]' : 'opacity-[0.08] sm:opacity-[0.09]'
        }`}
      >
        {isDark ? (
          <div className="absolute inset-16 rounded-full bg-purple-600/20 blur-3xl -z-10" />
        ) : (
          <div className="absolute inset-16 rounded-full bg-purple-400/20 blur-3xl -z-10" />
        )}
        <Image
          src={logoBadge}
          alt=""
          fill
          priority
          className={`object-contain transition-all duration-500 ${
            isDark
              ? 'filter drop-shadow-[0_0_36px_rgba(168,85,247,0.18)]'
              : 'filter drop-shadow-[0_4px_20px_rgba(75,30,130,0.08)]'
          }`}
        />
      </div>

      {/* TOP COMPLIANCE BAR */}
      <div className={`border-b text-xs py-2 px-4 sm:px-8 transition-colors duration-300 ${T.topBarBg}`}>
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">
          <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px] tracking-wide">
            <span className={T.topBarStrong}>USDOT# 3843409</span>
            <span className={`hidden sm:inline ${T.divider}`}>|</span>
            <span className={T.topBarStrong}>MC# 1398475</span>
            <span className={`hidden md:inline ${T.divider}`}>|</span>
            <span className={`hidden md:flex items-center gap-1.5 ${T.accent}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              TWIC Certified Driver
            </span>
          </div>
          <div className="flex items-center gap-5 font-mono text-xs">
            <a href="tel:5165088078" className={`flex items-center gap-1.5 hover:text-purple-400 transition ${T.topBarStrong}`}>
              <Phone className={`w-3.5 h-3.5 ${T.accent}`} />
              <span>(516) 508-8078</span>
            </a>
            <a
              href="mailto:Bigmacklogisticsa1@gmail.com"
              className={`hidden sm:flex items-center gap-1.5 hover:text-purple-400 transition ${T.topBarMuted}`}
            >
              <Mail className={`w-3.5 h-3.5 ${T.accent}`} />
              <span>Bigmacklogisticsa1@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className={`border-b backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300 ${T.headerBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-4">
          <a href="#hero" className="flex items-center gap-3.5 group flex-shrink-0">
            <div className="relative h-11 w-11 sm:h-[52px] sm:w-[52px] flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              {isDark && <div className="absolute -inset-1 rounded-full bg-purple-500/25 blur-md" />}
              <Image
                src={logoBadge}
                alt="Big Mack Trucking LLC logo"
                priority
                fill
                sizes="52px"
                className="relative object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
              />
            </div>
            <div>
              <span className={`text-lg sm:text-xl font-semibold tracking-tight block leading-none font-display ${T.wordmark}`}>
                Big Mack<span className="text-purple-400">.</span>
              </span>
              <span className={`text-[9px] sm:text-[10px] font-mono tracking-widest uppercase block mt-1.5 ${T.subWordmark}`}>
                Trucking LLC — Expedited Freight
              </span>
            </div>
          </a>

          <nav className={`hidden lg:flex items-center gap-8 text-sm ${T.navMuted}`}>
            {[
              { href: '#hero', label: 'Overview', active: true },
              { href: '#equipment', label: 'Equipment' },
              { href: '#twic', label: 'Credentials' },
              { href: '#dispatch', label: 'Get a Quote' },
            ].map(({ href, label, active }) => (
              <a
                key={href}
                href={href}
                className={`relative py-1 transition-colors group ${active ? `${T.navActive} font-medium` : T.navHover}`}
              >
                {label}
                <span className={`absolute left-0 -bottom-0.5 h-px bg-purple-400 transition-all duration-300 ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 flex-shrink-0">
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to bright theme' : 'Switch to dark theme'}
              className={`flex items-center justify-center w-10 h-10 rounded-xl border transition-all ${T.iconToggle}`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <a
              href="tel:5165088078"
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold tracking-wide uppercase px-5 py-3 rounded-xl transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-purple-600/20"
            >
              <Phone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Call Now</span>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative flex flex-col justify-between px-4 sm:px-8 max-w-7xl mx-auto pt-6 pb-8 md:min-h-[calc(100vh-104px)]">

        {/* Soft scrim, desktop only — mobile keeps the canvas in its own box below the text instead */}
        <div className={`hidden md:block absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r ${T.heroScrim}`} />

        <div className="relative z-10 max-w-xl mt-2 sm:mt-6 md:pointer-events-none">
          <p className={`text-xs font-mono uppercase tracking-widest mb-4 ${T.accent} ${heroReveal}`} style={heroRevealStyle(0)}>
            Omari Headley, Owner-Operator
          </p>

          <h1 className={`text-[2.75rem] sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-semibold tracking-tight leading-[1.03] font-display ${T.heroHeading} ${heroReveal}`} style={heroRevealStyle(90)}>
            Freight you can<br />
            <span className={isDark ? 'purple-gradient-text' : 'purple-gradient-text-light'}>count on.</span>
          </h1>

          <p className={`mt-5 text-sm sm:text-base leading-relaxed max-w-md ${T.heroBody} ${heroReveal}`} style={heroRevealStyle(220)}>
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
              className={`border text-xs tracking-wider uppercase px-6 py-4 rounded-xl transition-all backdrop-blur-md flex items-center gap-2 ${T.secondaryBtn}`}
            >
              <Phone className={`w-3.5 h-3.5 ${T.accent}`} />
              <span>(516) 508-8078</span>
            </a>
          </div>

          <div className={`grid grid-cols-3 gap-4 sm:gap-6 pt-6 mt-6 border-t max-w-md ${T.hairline} ${heroReveal}`} style={heroRevealStyle(440)}>
            <div>
              <span className={`text-[10px] uppercase tracking-wide block font-mono ${T.heroStatLabel}`}>GVWR</span>
              <span className={`text-sm font-bold ${T.heroStatValue}`}>26,000 LBS</span>
            </div>
            <div>
              <span className={`text-[10px] uppercase tracking-wide block font-mono ${T.heroStatLabel}`}>Handling</span>
              <span className={`text-sm font-bold ${T.heroStatValue}`}>Liftgate + Jack</span>
            </div>
            <div>
              <span className={`text-[10px] uppercase tracking-wide block font-mono ${T.heroStatLabel}`}>Security</span>
              <span className={`text-sm font-bold ${T.accent}`}>TWIC Certified</span>
            </div>
          </div>
        </div>

        {/* 3D truck: its own boxed panel in normal flow on mobile, full-bleed background overlay from md+ */}
        <div className={`relative order-2 w-full h-[54vh] min-h-[380px] max-h-[500px] mt-6 rounded-3xl overflow-hidden border md:order-none md:absolute md:inset-0 md:z-0 md:h-auto md:min-h-0 md:max-h-none md:w-auto md:mt-0 md:rounded-none md:border-0 ${T.hairline}`}>
          {/* In-viewport brand watermark badge: prominent & sharp on mobile card, hidden on desktop where hero text is placed */}
          <div className="md:hidden absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-20 flex items-center gap-2.5 pointer-events-none bg-black/50 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-lg">
            <div className="relative w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0">
              <Image src={logoBadge} alt="Big Mack" fill className="object-contain drop-shadow" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] sm:text-[11px] tracking-wider text-purple-200 uppercase font-bold leading-none">
                Big Mack Trucking
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] tracking-widest text-slate-400 uppercase leading-none mt-1">
                26FT Dock-High • 3D View
              </span>
            </div>
          </div>

          {/* Touch interaction hint badge on mobile */}
          <div className="md:hidden absolute bottom-3 left-3.5 z-20 flex items-center gap-1.5 pointer-events-none bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 font-mono text-[9px] sm:text-[10px] text-slate-300">
            <RotateCw className="w-3 h-3 text-purple-400" />
            <span>Rotate 360° • Pinch to zoom</span>
          </div>

          <BigMackCanvas activePreset={activePreset} isAutoRotating={isAutoRotating} theme={theme} />
        </div>

        {/* CAMERA PRESET DOCK */}
        <div className="relative z-10 order-3 flex flex-col items-center mt-6 md:order-none md:items-end md:mt-0">
          <div className="glass-panel-glow p-1.5 rounded-2xl flex flex-wrap items-center justify-center gap-1 max-w-xl">
            {PRESETS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => handlePresetSelect(id)}
                className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition ${
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
            Drag to rotate • Pinch to zoom
          </div>
        </div>

      </section>

      {/* EQUIPMENT */}
      <section id="equipment" className={`py-24 sm:py-32 px-4 sm:px-8 transition-colors duration-300 ${isDark ? 'bg-obsidian-950' : 'bg-paper'}`}>
        <div className="max-w-7xl mx-auto">

          <Reveal className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className={`text-xs font-mono uppercase tracking-widest block mb-2 ${T.accent}`}>
                Equipment
              </span>
              <h2 className={`text-3xl sm:text-5xl font-semibold tracking-tight font-display ${T.heading}`}>
                Built for the work.
              </h2>
            </div>
            <p className={`text-sm max-w-lg leading-relaxed ${T.sectionBody}`}>
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
                <div className={`h-full border p-7 rounded-3xl transition-all duration-300 hover:border-purple-400/40 hover:-translate-y-0.5 ${T.cardBg} ${T.cardBorder} ${T.cardShadow} ${T.cardHoverShadow}`}>
                  <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-6 ${T.iconTile} ${T.accent}`}>
                    <card.icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-mono tracking-wider uppercase block ${T.accent}`}>{card.eyebrow}</span>
                  <h3 className={`text-xl font-semibold mt-1 mb-3 font-display ${T.heading}`}>{card.title}</h3>
                  <p className={`text-xs leading-relaxed mb-4 ${T.sectionBody}`}>{card.body}</p>
                  <div className={`pt-4 border-t text-[11px] space-y-1.5 ${T.hairline} ${T.sectionBody}`}>
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
        <Reveal className={`border rounded-3xl p-8 sm:p-12 transition-colors duration-300 ${T.cardBg} ${T.cardBorder}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className={`text-xs font-mono uppercase tracking-widest flex items-center gap-2 ${T.accent}`}>
                <ShieldCheck className="w-4 h-4" />
                Transportation Worker Identification Credential
              </span>
              <h2 className={`text-3xl sm:text-4xl font-semibold font-display ${T.heading}`}>
                Unrestricted maritime port access.
              </h2>
              <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${T.sectionBody}`}>
                Avoid dock wait times, paperwork bottlenecks, and third-party escort fees. Big Mack Trucking LLC holds active TWIC accreditation, letting Omari Headley access container freight stations, maritime piers, and bonded airport warehouses directly.
              </p>

              <div className={`flex flex-col sm:flex-row flex-wrap gap-x-8 gap-y-2 pt-2 text-sm ${T.sectionBody}`}>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${T.accent}`} />
                  <span>Port Newark / Elizabeth Marine Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${T.accent}`} />
                  <span>Red Hook Container Terminal (Brooklyn)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${T.accent}`} />
                  <span>JFK & Newark Air Cargo Corridors</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-end">
              <div className={`border p-6 rounded-2xl text-center w-full max-w-sm ${T.hairline}`}>
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${T.iconTile} ${T.accent}`}>
                  <Anchor className="w-7 h-7" />
                </div>
                <span className={`text-xs font-mono uppercase block ${T.accent}`}>Port Clearance</span>
                <span className={`text-xl font-semibold block mt-1 font-display ${T.heading}`}>TWIC Verified</span>
                <p className={`text-[11px] mt-2 ${T.footerMuted}`}>
                  Official badge on driver file. Expedited container drop-offs and unescorted pickups.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* GET A QUOTE */}
      <section id="dispatch" className="py-24 sm:py-32 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className={`border rounded-3xl p-8 sm:p-14 transition-colors duration-300 ${T.cardBg} ${T.cardBorder}`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            <Reveal className="lg:col-span-6 space-y-6">
              <div className={`inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider ${T.accent}`}>
                <Zap className="w-3.5 h-3.5" />
                Book Direct
              </div>

              <h2 className={`text-3xl sm:text-5xl font-semibold font-display ${T.heading}`}>
                Booking made simple.
              </h2>

              <p className={`text-sm sm:text-base leading-relaxed ${T.sectionBody}`}>
                Brokers and shippers book directly with <strong className={T.heading}>Omari Headley</strong> — fast rate confirmations, dedicated freight capacity, and continuous load tracking.
              </p>

              <div className="space-y-4 pt-2">
                <a
                  href="tel:5165088078"
                  className={`p-5 rounded-2xl border hover:border-purple-400/30 flex items-center gap-4 transition-all hover:-translate-y-0.5 group block ${T.subCardBg} ${T.hairline}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${T.iconTile} ${T.accent}`}>
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <span className={`text-[10px] uppercase block font-mono ${T.footerMuted}`}>Priority 24/7 Dispatch</span>
                    <span className={`text-xl font-bold group-hover:text-purple-400 transition ${T.heading}`}>
                      (516) 508-8078
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${T.footerMuted}`}>Instant verbal quote & rate confirmation</span>
                  </div>
                </a>

                <a
                  href="mailto:Bigmacklogisticsa1@gmail.com"
                  className={`p-5 rounded-2xl border hover:border-purple-400/30 flex items-center gap-4 transition-all hover:-translate-y-0.5 group block ${T.subCardBg} ${T.hairline}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${T.iconTile} ${T.accent}`}>
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <span className={`text-[10px] uppercase block font-mono ${T.footerMuted}`}>Rate Confirmation Email</span>
                    <span className={`text-sm sm:text-base font-bold group-hover:text-purple-400 transition break-all ${T.heading}`}>
                      Bigmacklogisticsa1@gmail.com
                    </span>
                    <span className={`text-[11px] block mt-0.5 ${T.footerMuted}`}>Send broker load sheets & packets</span>
                  </div>
                </a>
              </div>

              <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs">
                <span className={`px-3 py-1.5 rounded-lg border ${T.mutedBadge}`}>MC# 1398475</span>
                <span className={`px-3 py-1.5 rounded-lg border ${T.mutedBadge}`}>USDOT# 3843409</span>
                <span className={`px-3 py-1.5 rounded-lg border ${T.mutedBadge}`}>GVWR 26,000 LBS</span>
              </div>
            </Reveal>

            <Reveal delay={120} className={`lg:col-span-6 border p-8 rounded-3xl ${T.formPanelBg}`}>
              <div className={`flex items-center justify-between mb-6 pb-4 border-b ${T.hairline}`}>
                <div>
                  <h3 className={`text-xl font-semibold font-display ${T.heading}`}>Request a Quote</h3>
                  <p className={`text-xs ${T.footerMuted}`}>Sent directly to dispatch</p>
                </div>
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${T.iconTile} ${T.accent}`}>
                  <Send className="w-4 h-4" />
                </div>
              </div>

              <form onSubmit={handleRateSubmit} className="space-y-4 text-sm">
                <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-[11px] uppercase block mb-1 flex items-center gap-1 ${T.footerMuted}`}>
                      <MapPin className={`w-3 h-3 ${T.accent}`} /> Pickup Origin
                    </label>
                    <input
                      type="text"
                      name="origin"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="e.g. JFK Airport (NY) or 11430"
                      className={`w-full border rounded-xl p-3 focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/60 outline-none transition ${T.inputBg}`}
                      required
                    />
                  </div>
                  <div>
                    <label className={`text-[11px] uppercase block mb-1 flex items-center gap-1 ${T.footerMuted}`}>
                      <MapPin className={`w-3 h-3 ${T.accent}`} /> Destination
                    </label>
                    <input
                      type="text"
                      name="destination"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Newark (NJ) or 07114"
                      className={`w-full border rounded-xl p-3 focus:border-purple-400/60 focus:ring-1 focus:ring-purple-400/60 outline-none transition ${T.inputBg}`}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className={`text-[11px] uppercase block mb-1 ${T.footerMuted}`}>
                      Pallet Count ({pallets} {pallets === 1 ? 'Pallet' : 'Pallets'})
                    </label>
                    <select
                      name="pallets"
                      value={pallets}
                      onChange={(e) => setPallets(Number(e.target.value))}
                      className={`w-full border rounded-xl p-3 focus:border-purple-400/60 outline-none ${T.inputBg}`}
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Pallet' : 'Pallets'} (48×40)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`text-[11px] uppercase block mb-1 ${T.footerMuted}`}>Estimated Weight</label>
                    <input
                      type="text"
                      name="weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 5,000 lbs"
                      className={`w-full border rounded-xl p-3 focus:border-purple-400/60 outline-none ${T.inputBg}`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={`text-[11px] uppercase block mb-2 ${T.footerMuted}`}>Accessorial Equipment Needed</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'liftgate', label: 'Liftgate', checked: needLiftgate, set: setNeedLiftgate },
                      { key: 'palletJack', label: 'Pallet Jack', checked: needPalletJack, set: setNeedPalletJack },
                      { key: 'twic', label: 'TWIC Port', checked: needTWIC, set: setNeedTWIC },
                    ].map(({ key, label, checked, set }) => (
                      <label
                        key={key}
                        className={`flex items-center gap-1.5 p-2.5 rounded-xl border cursor-pointer text-[11px] transition ${
                          checked
                            ? 'bg-purple-600/15 border-purple-400/40 text-current'
                            : `${T.inputBg}`
                        }`}
                      >
                        <input
                          type="checkbox"
                          name={key}
                          checked={checked}
                          onChange={(e) => set(e.target.checked)}
                          className="sr-only"
                        />
                        <CheckCircle2 className={`w-3.5 h-3.5 ${checked ? T.accent : 'text-slate-500'}`} />
                        <span>{label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`text-[11px] uppercase block mb-1 ${T.footerMuted}`}>Broker / Shipper Contact Information</label>
                  <input
                    type="text"
                    name="broker_contact"
                    placeholder="Company name, contact phone or direct email"
                    className={`w-full border rounded-xl p-3 focus:border-purple-400/60 outline-none ${T.inputBg}`}
                    required
                  />
                </div>

                {formSent ? (
                  <div className="p-4 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-400 text-center font-semibold text-sm">
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
                      <p className="text-xs text-red-500 text-center">
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
      <footer className={`border-t pt-16 pb-12 px-4 sm:px-8 transition-colors duration-300 ${T.footerBg} ${T.footerMuted}`}>
        <div className="max-w-7xl mx-auto">
          <div className={`grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b text-sm ${T.hairline}`}>

            <Reveal className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0">
                  {isDark && <div className="absolute -inset-1.5 rounded-full bg-purple-500/25 blur-md" />}
                  <Image
                    src={logoBadge}
                    alt="Big Mack Trucking LLC official logo"
                    fill
                    sizes="64px"
                    className="relative object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]"
                  />
                </div>
                <div>
                  <span className={`text-lg font-semibold tracking-tight block font-display ${T.heading}`}>
                    Big Mack Trucking LLC
                  </span>
                  <span className={`text-[10px] uppercase font-mono tracking-widest ${T.accent}`}>Expedited Freight</span>
                </div>
              </div>
              <p className={`leading-relaxed text-[11px] ${T.footerMuted}`}>
                Authorized commercial motor carrier delivering dock-high 26ft straight box freight, heavy-duty hydraulic liftgate ground operations, and TWIC-certified maritime port transport.
              </p>
              <div className="flex gap-2 pt-1 font-mono">
                <span className={`border px-2.5 py-1 rounded text-[10px] ${T.mutedBadge}`}>MC# 1398475</span>
                <span className={`border px-2.5 py-1 rounded text-[10px] ${T.mutedBadge}`}>USDOT# 3843409</span>
              </div>
            </Reveal>

            <Reveal delay={80} className="space-y-2.5 text-[13px]">
              <span className={`font-semibold uppercase block text-xs tracking-wider font-mono ${T.heading}`}>Fleet & Hardware</span>
              <p>Straight box truck (26ft)</p>
              <p>Dock-high floor alignment</p>
              <p>3,500 LB hydraulic liftgate</p>
              <p>Industrial pallet jack onboard</p>
              <p>Heavy-duty ratchet straps & E-track</p>
            </Reveal>

            <Reveal delay={160} className="space-y-2.5 text-[13px]">
              <span className={`font-semibold uppercase block text-xs tracking-wider font-mono ${T.heading}`}>Security & Clearances</span>
              <p className={`font-medium ${T.accent}`}>TWIC card certified driver</p>
              <p>Maritime port access ready</p>
              <p>FMCSA active authorized carrier</p>
              <p>Rated GVWR 26,000 LBS</p>
              <p>Comprehensive cargo & auto liability</p>
            </Reveal>

            <Reveal delay={240} className="space-y-2.5 text-[13px]">
              <span className={`font-semibold uppercase block text-xs tracking-wider font-mono ${T.heading}`}>Direct Dispatch</span>
              <p className={`font-medium ${T.heading}`}>Principal: Omari Headley</p>
              <p>
                <a href="tel:5165088078" className={`font-semibold hover:text-purple-400 transition ${T.accent}`}>
                  Dispatch: (516) 508-8078
                </a>
              </p>
              <p>
                <a href="mailto:Bigmacklogisticsa1@gmail.com" className="hover:text-purple-400 transition break-all">
                  Bigmacklogisticsa1@gmail.com
                </a>
              </p>
              <p className="text-[11px] pt-1 opacity-80">Dispatch hours: 24/7 expedited coverage</p>
            </Reveal>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono opacity-80">
            <p>© {new Date().getFullYear()} Big Mack Trucking LLC. All rights reserved.</p>
            <p>USDOT# 3843409 • MC# 1398475 • Principal: Omari Headley</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
