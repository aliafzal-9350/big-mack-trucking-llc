'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  Anchor,
  ArrowUpRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Compass,
  RotateCw,
  Send,
  Zap,
  MapPin,
  Box,
  FileText
} from 'lucide-react';

const BigMackCanvas = dynamic(() => import('@/components/BigMackCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center font-mono text-xs tracking-widest text-purple-400">
      <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mb-4" />
      <span>INITIALIZING 3D METALLIC PURPLE RIG...</span>
    </div>
  ),
});

export default function HomePage() {
  const [activePreset, setActivePreset] = useState('front');
  const [isAutoRotating, setIsAutoRotating] = useState(false);

  // Rate calculator states
  const [origin, setOrigin] = useState('JFK Air Cargo (NY)');
  const [destination, setDestination] = useState('Port Newark (NJ)');
  const [pallets, setPallets] = useState(6);
  const [weight, setWeight] = useState('4,500 lbs');
  const [needLiftgate, setNeedLiftgate] = useState(true);
  const [needPalletJack, setNeedPalletJack] = useState(true);
  const [needTWIC, setNeedTWIC] = useState(false);
  const [formSent, setFormSent] = useState(false);

  const handlePresetSelect = (preset) => {
    setActivePreset(preset);
    setIsAutoRotating(preset === 'orbit');
  };

  const handleRateSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setTimeout(() => setFormSent(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#08040C] text-slate-100 font-sans selection:bg-purple-600 selection:text-white antialiased overflow-x-hidden">

      {/* 1. TOP TELEMETRY & COMPLIANCE BANNER */}
      <div className="border-b border-purple-900/30 bg-[#050208] text-slate-300 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-3">

          <div className="flex items-center gap-3 sm:gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-purple-400 font-bold px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/40">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE DISPATCH READY
            </span>
            <span className="hidden sm:inline text-purple-900">|</span>
            <span className="text-slate-300 font-semibold">USDOT# 3843409</span>
            <span className="hidden sm:inline text-purple-900">|</span>
            <span className="text-slate-300 font-semibold">MC# 1398475</span>
            <span className="hidden md:inline text-purple-900">|</span>
            <span className="hidden md:flex items-center gap-1 text-purple-300">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400 inline" />
              TWIC Certified Driver
            </span>
          </div>

          <div className="flex items-center gap-5 font-mono text-xs">
            <a
              href="tel:5165088078"
              className="flex items-center gap-1.5 text-slate-200 hover:text-purple-300 transition font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-purple-400" />
              <span>(516) 508-8078</span>
            </a>
            <a
              href="mailto:Bigmacklogisticsa1@gmail.com"
              className="hidden sm:flex items-center gap-1.5 text-slate-300 hover:text-purple-300 transition"
            >
              <Mail className="w-3.5 h-3.5 text-purple-400" />
              <span>Bigmacklogisticsa1@gmail.com</span>
            </a>
          </div>

        </div>
      </div>

      {/* 2. HIGH-TECH GLASS HEADER */}
      <header className="border-b border-purple-900/30 bg-[#08040C]/85 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">

          {/* Logo Brand Emblem with Official Circular HD Emblem */}
          <a href="#hero" className="flex items-center gap-3.5 group">
            <div className="relative w-32 sm:w-40 h-14 rounded-md bg-[#f7f5f2] p-1 flex items-center justify-start overflow-hidden transition-transform duration-300 group-hover:scale-[1.02] flex-shrink-0">
              <img
                src="/image/logo.jpeg"
                alt="Big Mack Trucking LLC logo"
                width={2048}
                height={2048}
                className="w-full h-full object-contain object-left"
              />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none font-display">
                BIG MACK<span className="text-purple-400">.</span>
              </span>
              <span className="text-[10px] font-mono tracking-widest text-purple-300/80 uppercase block mt-1 font-bold">
                TRUCKING LLC • EXPEDITED FREIGHT
              </span>
            </div>
          </a>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-mono tracking-wider uppercase text-slate-300">
            <a href="#hero" className="text-purple-400 font-bold hover:text-purple-300 transition">
              3D Fleet Rig
            </a>
            <a href="#equipment" className="hover:text-white transition">
              Equipment Specs
            </a>
            <a href="#twic" className="hover:text-white transition">
              TWIC Maritime
            </a>
            <a href="#dispatch" className="hover:text-white transition">
              Rate Con Terminal
            </a>
          </nav>

          {/* Direct CTA */}
          <div className="flex items-center gap-3">
            <a
              href="tel:5165088078"
              className="flex items-center gap-2 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-800 hover:from-purple-600 hover:to-purple-700 text-white text-xs font-mono font-bold tracking-wider uppercase px-5 py-3 rounded-xl shadow-lg shadow-purple-600/25 transition border border-purple-400/30"
            >
              <Phone className="w-3.5 h-3.5 text-purple-200" />
              <span>Direct Dispatch</span>
            </a>
          </div>

        </div>
      </header>

      {/* 3. HERO SHOWCASE WITH 3D METALLIC PURPLE TRUCK */}
      <section id="hero" className="relative min-h-[calc(100vh-130px)] flex flex-col justify-between px-4 sm:px-8 max-w-7xl mx-auto pt-6 pb-8">

        {/* Full-bleed 3D Canvas Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
          <BigMackCanvas activePreset={activePreset} isAutoRotating={isAutoRotating} />
        </div>

        {/* Hero Left Content Overlay */}
        <div className="relative z-10 max-w-xl pointer-events-none mt-2 sm:mt-6">

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#140824]/90 border border-purple-500/40 text-purple-300 text-xs font-mono uppercase tracking-wider mb-4 shadow-xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            <span>26FT Metallic Purple Fleet • Dock-High</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[0.95] uppercase font-display">
            HEAVY-DUTY<br />
            DOCK-HIGH<br />
            <span className="purple-gradient-text">
              FREIGHT POWER.
            </span>
          </h1>

          <p className="mt-5 text-sm sm:text-base text-slate-300 leading-relaxed font-normal max-w-md bg-[#08040C]/60 backdrop-blur-sm p-3 rounded-2xl border border-purple-900/30">
            Directed by <strong className="text-white">Omari Headley</strong>. Precision 26ft straight box truck carrier equipped with heavy-duty liftgates, commercial pallet jacks, reinforced ratchet securement, and certified <strong className="text-purple-300">TWIC card access</strong> for ports and restricted terminals.
          </p>

          <div className="mt-7 flex flex-wrap gap-3 pointer-events-auto">
            <a
              href="#dispatch"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs font-mono uppercase tracking-widest px-7 py-4 rounded-xl transition shadow-xl shadow-purple-600/30 flex items-center gap-2 border border-purple-400/40"
            >
              Lock In Rate Con
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="tel:5165088078"
              className="bg-purple-950/70 hover:bg-purple-900/80 border border-purple-600/30 text-white font-mono text-xs tracking-wider uppercase px-6 py-4 rounded-xl transition backdrop-blur-md flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-purple-400" />
              <span>(516) 508-8078</span>
            </a>
          </div>

          {/* Quick HUD Telemetry Matrix */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-6 mt-6 border-t border-purple-900/40 max-w-md font-mono">
            <div className="bg-[#120820]/80 border border-purple-800/30 p-2.5 rounded-xl">
              <span className="text-[10px] text-purple-400 uppercase block font-semibold">GVW Rating</span>
              <span className="text-xs font-bold text-white">26,000 LBS</span>
            </div>
            <div className="bg-[#120820]/80 border border-purple-800/30 p-2.5 rounded-xl">
              <span className="text-[10px] text-purple-400 uppercase block font-semibold">Handling</span>
              <span className="text-xs font-bold text-white">Liftgate + Jack</span>
            </div>
            <div className="bg-[#120820]/80 border border-purple-800/30 p-2.5 rounded-xl">
              <span className="text-[10px] text-purple-400 uppercase block font-semibold">Security</span>
              <span className="text-xs font-bold text-purple-300">TWIC Certified</span>
            </div>
          </div>
        </div>

        {/* 4. INNOVATIVE 3D FLEET COCKPIT CONTROLLER */}
        <div className="relative z-10 flex flex-col items-center sm:items-end mt-10 sm:mt-0">

          <div className="glass-panel-glow p-2 rounded-2xl shadow-2xl flex flex-wrap items-center justify-center gap-1.5 font-mono max-w-xl">

            <button
              onClick={() => handlePresetSelect('orbit')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${activePreset === 'orbit'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <RotateCw className="w-3.5 h-3.5 text-purple-300 animate-spin" />
              <span>360° Orbit</span>
            </button>

            <button
              onClick={() => handlePresetSelect('front')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${activePreset === 'front'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Compass className="w-3.5 h-3.5 text-purple-300" />
              <span>Front 3/4</span>
            </button>

            <button
              onClick={() => handlePresetSelect('cab')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${activePreset === 'cab'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <FileText className="w-3.5 h-3.5 text-purple-300" />
              <span>Cab Stencil</span>
            </button>

            <button
              onClick={() => handlePresetSelect('side')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${activePreset === 'side'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Box className="w-3.5 h-3.5 text-purple-300" />
              <span>Logo Decal</span>
            </button>

            <button
              onClick={() => handlePresetSelect('rear')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${activePreset === 'rear'
                ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg shadow-purple-600/30 border border-purple-400/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Truck className="w-3.5 h-3.5 text-purple-300" />
              <span>Liftgate Dock</span>
            </button>

          </div>

          <div className="mt-2 text-[10px] font-mono text-purple-300/60 uppercase tracking-widest flex items-center gap-2">
            <span>DRAG TO ROTATE 360° FLEET RIG</span>
            <span>•</span>
            <span>SMOOTH ORBIT INTERACTION</span>
          </div>

        </div>

      </section>

      {/* 5. FLEET RIG & EQUIPMENT SPECIFICATIONS */}
      <section id="equipment" className="border-t border-purple-950/40 bg-[#06030A] py-20 px-4 sm:px-8 relative">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold block mb-2">
                // HARDWARE SPECIFICATIONS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-display">
                Engineered for Expedited Loads
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-lg leading-relaxed font-normal">
              Big Mack Trucking LLC maintains professional-grade commercial equipment designed to eliminate freight handling bottlenecks at shipping docks, ports, and job sites.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Spec Card 1 */}
            <div className="bg-[#0D0717] border border-purple-900/30 p-7 rounded-3xl relative group hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-950/50">
              <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-700/40 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-purple-400 tracking-wider uppercase block font-bold">26FT STRAIGHT BOX</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">Dock-High Clearance</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Exact standard dock height floor level for immediate pallet jack access and cross-dock turnaround.
              </p>
              <div className="pt-4 border-t border-purple-900/30 font-mono text-[11px] text-purple-300 space-y-1.5">
                <p>• High-Cube Interior Volume</p>
                <p>• Up to 12 Standard 48x40 Pallets</p>
                <p>• 26,000 LBS GVW Non-CDL Rating</p>
              </div>
            </div>

            {/* Spec Card 2 */}
            <div className="bg-[#0D0717] border border-purple-900/30 p-7 rounded-3xl relative group hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-950/50">
              <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-700/40 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-purple-400 tracking-wider uppercase block font-bold">HYDRAULIC LIFTGATE</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">Heavy-Duty Platform</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Hydraulic ground-to-box transfer enabling self-sufficient deliveries without requiring warehouse loading docks.
              </p>
              <div className="pt-4 border-t border-purple-900/30 font-mono text-[11px] text-purple-300 space-y-1.5">
                <p>• 3,500 LBS Hydraulic Lift Capacity</p>
                <p>• Level-Ride Tilt Mechanics</p>
                <p>• Ground Storefront & Site Delivery</p>
              </div>
            </div>

            {/* Spec Card 3 */}
            <div className="bg-[#0D0717] border border-purple-900/30 p-7 rounded-3xl relative group hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-950/50">
              <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-700/40 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Box className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-purple-400 tracking-wider uppercase block font-bold">PALLET JACK & STRAPS</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">Onboard Handling</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Heavy-duty commercial pallet jack permanently on the rig with commercial ratchet straps and E-track load locks.
              </p>
              <div className="pt-4 border-t border-purple-900/30 font-mono text-[11px] text-purple-300 space-y-1.5">
                <p>• Industrial Onboard Pallet Jack</p>
                <p>• Commercial Ratchet Straps</p>
                <p>• Dual-Track E-Track Securement</p>
              </div>
            </div>

            {/* Spec Card 4 */}
            <div className="bg-[#0D0717] border border-purple-900/30 p-7 rounded-3xl relative group hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-950/50">
              <div className="w-12 h-12 rounded-2xl bg-purple-950 border border-purple-700/40 flex items-center justify-center text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                <Anchor className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-mono text-purple-400 tracking-wider uppercase block font-bold">MARITIME CREDENTIALS</span>
              <h3 className="text-xl font-bold text-white mt-1 mb-3">TWIC Card Certified</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                Official federal clearance granting unescorted entry into secure maritime ports, airports, and military cargo terminals.
              </p>
              <div className="pt-4 border-t border-purple-900/30 font-mono text-[11px] text-purple-300 space-y-1.5">
                <p>• Port Newark / Bayonne Ready</p>
                <p>• JFK / EWR Air Cargo Verified</p>
                <p>• Zero Escort Delays or Fees</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. TWIC & PORT ACCESS HIGHLIGHT */}
      <section id="twic" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#120824] via-[#0D0717] to-[#120824] border border-purple-800/40 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">

          <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none flex items-center justify-center">
            <Anchor className="w-96 h-96 text-purple-400" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
                Transportation Worker Identification Credential
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-display">
                Unrestricted Maritime Port Access
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Avoid costly dock wait times, paperwork bottlenecks, and third-party escort fees. Big Mack Trucking LLC holds active TWIC accreditation, allowing driver Omari Headley to access container freight stations, maritime piers, and bonded airport warehouses immediately.
              </p>

              <div className="flex flex-wrap gap-4 pt-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-white bg-purple-950/60 border border-purple-800/40 px-3.5 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Port Newark / Elizabeth Marine Terminal</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-purple-950/60 border border-purple-800/40 px-3.5 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>Red Hook Container Terminal (Brooklyn)</span>
                </div>
                <div className="flex items-center gap-2 text-white bg-purple-950/60 border border-purple-800/40 px-3.5 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-purple-400" />
                  <span>JFK & Newark Air Cargo Corridors</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col justify-center items-center lg:items-end">
              <div className="bg-[#08040C] border border-purple-700/40 p-6 rounded-2xl text-center w-full max-w-sm">
                <div className="w-14 h-14 rounded-2xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center mx-auto mb-4 text-purple-300">
                  <Anchor className="w-7 h-7" />
                </div>
                <span className="text-xs font-mono text-purple-300 uppercase block font-bold">PORT CLEARANCE</span>
                <span className="text-xl font-bold text-white block mt-1">TWIC VERIFIED</span>
                <p className="text-[11px] text-slate-400 font-mono mt-2">
                  Official badge on driver file. Expedited container drop-offs and unescorted pickups.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. INTERACTIVE RATE CONFIRMATION TERMINAL */}
      <section id="dispatch" className="py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-[#120822] to-[#08040C] border border-purple-800/40 rounded-3xl p-8 sm:p-14 shadow-2xl">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left: Dispatch & Authority Info */}
            <div className="lg:col-span-6 space-y-6">

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-950/80 border border-purple-700/50 text-purple-300 text-xs font-mono uppercase tracking-wider">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                Direct Carrier Booking
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white font-display">
                Fast Broker Rate Confirmation
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                Brokers and shippers book directly with <strong className="text-white">Omari Headley</strong>. Immediate rate confirmation responses, dedicated freight capacity, and continuous load tracking.
              </p>

              {/* Direct Hotlines */}
              <div className="space-y-4 pt-2 font-mono">

                <a
                  href="tel:5165088078"
                  className="bg-[#180A2D] hover:bg-[#200E3D] p-5 rounded-2xl border border-purple-700/40 flex items-center gap-4 transition group block"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-900/60 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform flex-shrink-0">
                    <Phone className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-300 uppercase block font-semibold">Priority 24/7 Dispatch</span>
                    <span className="text-xl font-bold text-white group-hover:text-purple-300 transition">
                      (516) 508-8078
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Instant verbal quote & rate con lock</span>
                  </div>
                </a>

                <a
                  href="mailto:Bigmacklogisticsa1@gmail.com"
                  className="bg-[#180A2D] hover:bg-[#200E3D] p-5 rounded-2xl border border-purple-700/40 flex items-center gap-4 transition group block"
                >
                  <div className="w-12 h-12 rounded-xl bg-purple-900/60 flex items-center justify-center text-purple-300 group-hover:scale-105 transition-transform flex-shrink-0">
                    <Mail className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-300 uppercase block font-semibold">Official Rate Con Email</span>
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-purple-300 transition break-all">
                      Bigmacklogisticsa1@gmail.com
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">Send broker load sheets & packets</span>
                  </div>
                </a>

              </div>

              {/* Compliance Badges */}
              <div className="flex flex-wrap gap-2 pt-2 font-mono text-xs">
                <span className="px-3 py-1.5 rounded-lg bg-purple-950/70 border border-purple-800/40 text-purple-300 font-bold">
                  MC# 1398475
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-purple-950/70 border border-purple-800/40 text-purple-300 font-bold">
                  USDOT# 3843409
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-purple-950/70 border border-purple-800/40 text-purple-300 font-bold">
                  GVW 26,000 LBS
                </span>
              </div>

            </div>

            {/* Right: Modern Rate Con Interactive Form */}
            <div className="lg:col-span-6 bg-[#08040C] border border-purple-800/40 p-8 rounded-3xl shadow-2xl">

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-900/40">
                <div>
                  <h3 className="text-xl font-bold font-display text-white">Rate Con Generator</h3>
                  <p className="text-xs font-mono text-purple-300/80">Direct carrier quote transmission</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-700/40 flex items-center justify-center">
                  <Send className="w-4 h-4 text-purple-400" />
                </div>
              </div>

              <form onSubmit={handleRateSubmit} className="space-y-4 font-mono text-xs">

                {/* Route Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-purple-300 uppercase block mb-1 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-400" /> Pickup Origin
                    </label>
                    <input
                      type="text"
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      placeholder="e.g. JFK Airport (NY) or 11430"
                      className="w-full bg-[#120822] border border-purple-900/60 rounded-xl p-3 text-white placeholder:text-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-purple-300 uppercase block mb-1 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-purple-400" /> Destination
                    </label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Newark (NJ) or 07114"
                      className="w-full bg-[#120822] border border-purple-900/60 rounded-xl p-3 text-white placeholder:text-slate-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Cargo Parameters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-purple-300 uppercase block mb-1 font-semibold">
                      Pallet Count ({pallets} Pallets)
                    </label>
                    <select
                      value={pallets}
                      onChange={(e) => setPallets(Number(e.target.value))}
                      className="w-full bg-[#120822] border border-purple-900/60 rounded-xl p-3 text-white focus:border-purple-500 outline-none"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Pallet' : 'Pallets'} (48x40)</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-purple-300 uppercase block mb-1 font-semibold">
                      Estimated Weight
                    </label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 5,000 lbs"
                      className="w-full bg-[#120822] border border-purple-900/60 rounded-xl p-3 text-white placeholder:text-slate-600 focus:border-purple-500 outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Equipment Accessories Checkboxes */}
                <div>
                  <label className="text-[11px] text-purple-300 uppercase block mb-2 font-semibold">
                    Accessorial Equipment Needed
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className={`flex items-center gap-1.5 p-2.5 rounded-xl border cursor-pointer text-[10px] transition ${needLiftgate ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-[#120822] border-purple-900/40 text-slate-400'
                      }`}>
                      <input
                        type="checkbox"
                        checked={needLiftgate}
                        onChange={(e) => setNeedLiftgate(e.target.checked)}
                        className="sr-only"
                      />
                      <CheckCircle2 className={`w-3.5 h-3.5 ${needLiftgate ? 'text-purple-400' : 'text-slate-600'}`} />
                      <span>Liftgate</span>
                    </label>

                    <label className={`flex items-center gap-1.5 p-2.5 rounded-xl border cursor-pointer text-[10px] transition ${needPalletJack ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-[#120822] border-purple-900/40 text-slate-400'
                      }`}>
                      <input
                        type="checkbox"
                        checked={needPalletJack}
                        onChange={(e) => setNeedPalletJack(e.target.checked)}
                        className="sr-only"
                      />
                      <CheckCircle2 className={`w-3.5 h-3.5 ${needPalletJack ? 'text-purple-400' : 'text-slate-600'}`} />
                      <span>Pallet Jack</span>
                    </label>

                    <label className={`flex items-center gap-1.5 p-2.5 rounded-xl border cursor-pointer text-[10px] transition ${needTWIC ? 'bg-purple-900/40 border-purple-500 text-white' : 'bg-[#120822] border-purple-900/40 text-slate-400'
                      }`}>
                      <input
                        type="checkbox"
                        checked={needTWIC}
                        onChange={(e) => setNeedTWIC(e.target.checked)}
                        className="sr-only"
                      />
                      <CheckCircle2 className={`w-3.5 h-3.5 ${needTWIC ? 'text-purple-400' : 'text-slate-600'}`} />
                      <span>TWIC Port</span>
                    </label>
                  </div>
                </div>

                {/* Broker Contact */}
                <div>
                  <label className="text-[11px] text-purple-300 uppercase block mb-1 font-semibold">
                    Broker / Shipper Contact Information
                  </label>
                  <input
                    type="text"
                    placeholder="Company name, contact phone or direct email"
                    className="w-full bg-[#120822] border border-purple-900/60 rounded-xl p-3 text-white placeholder:text-slate-600 focus:border-purple-500 outline-none"
                    required
                  />
                </div>

                {formSent ? (
                  <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 text-center font-bold">
                    ✓ RATE REQUEST SUBMITTED! DIRECT DISPATCH CONTACTING YOU.
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-500 hover:to-purple-700 text-white font-bold uppercase tracking-wider py-4 rounded-xl transition shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 border border-purple-400/40 cursor-pointer"
                  >
                    <span>Transmit Rate Confirmation Request</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                )}

              </form>

            </div>

          </div>

        </div>
      </section>

      {/* 8. CORPORATE COMPLIANCE & FOOTER (WITH USER'S OFFICIAL LOGO) */}
      <footer className="border-t border-purple-950/60 bg-[#040206] text-slate-400 pt-16 pb-12 px-4 sm:px-8 font-mono text-xs">
        <div className="max-w-7xl mx-auto">

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-purple-950/40">

            {/* Column 1: Brand & Logo */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-44 h-20 rounded-md bg-[#f7f5f2] p-1 flex items-center overflow-hidden flex-shrink-0">
                  <img
                    src="/image/logo.jpeg"
                    alt="Big Mack Trucking LLC official logo"
                    width={2048}
                    height={2048}
                    className="w-full h-full object-contain object-left"
                  />
                </div>
                <div>
                  <span className="text-base font-black tracking-tight text-white block font-display">
                    BIG MACK TRUCKING LLC
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold uppercase">
                    EXPEDITED FREIGHT POWER
                  </span>
                </div>
              </div>

              <p className="text-slate-400 leading-relaxed text-[11px]">
                Authorized commercial motor carrier delivering specialized dock-high 26ft straight box freight, heavy-duty hydraulic liftgate ground operations, and TWIC certified maritime port transport.
              </p>

              <div className="flex gap-2 pt-1">
                <span className="bg-purple-950/80 border border-purple-700/40 text-purple-300 px-2.5 py-1 rounded text-[10px] font-bold">
                  MC# 1398475
                </span>
                <span className="bg-white/5 border border-white/10 text-slate-300 px-2.5 py-1 rounded text-[10px] font-bold">
                  USDOT# 3843409
                </span>
              </div>
            </div>

            {/* Column 2: Equipment & Fleet */}
            <div className="space-y-2.5 text-[11px]">
              <span className="font-bold text-white uppercase block text-xs tracking-wider">Fleet & Hardware</span>
              <p className="text-slate-300">• Straight Box Truck (26ft)</p>
              <p className="text-slate-300">• Dock-High Floor Alignment</p>
              <p className="text-slate-300">• 3,500 LB Hydraulic Liftgate</p>
              <p className="text-slate-300">• Industrial Pallet Jack Onboard</p>
              <p className="text-slate-300">• Heavy-Duty Ratchet Straps & E-Track</p>
            </div>

            {/* Column 3: Security & FMCSA */}
            <div className="space-y-2.5 text-[11px]">
              <span className="font-bold text-white uppercase block text-xs tracking-wider">Security & Clearances</span>
              <p className="text-purple-300 font-semibold">• TWIC Card Certified Driver</p>
              <p className="text-slate-300">• Maritime Port Access Ready</p>
              <p className="text-slate-300">• FMCSA Active Authorized Carrier</p>
              <p className="text-slate-300">• Rated GVW 26,000 LBS</p>
              <p className="text-slate-300">• Comprehensive Cargo & Auto Liability</p>
            </div>

            {/* Column 4: Executive Leadership & Dispatch */}
            <div className="space-y-2.5 text-[11px]">
              <span className="font-bold text-white uppercase block text-xs tracking-wider">Direct Dispatch</span>
              <p className="text-white font-semibold">Principal: Omari Headley</p>
              <p>
                <a href="tel:5165088078" className="text-purple-300 hover:text-white font-bold transition">
                  Dispatch: (516) 508-8078
                </a>
              </p>
              <p>
                <a href="mailto:Bigmacklogisticsa1@gmail.com" className="text-slate-300 hover:text-purple-300 transition break-all">
                  Bigmacklogisticsa1@gmail.com
                </a>
              </p>
              <p className="text-slate-500 text-[10px] pt-1">
                Dispatch Hours: 24/7 Expedited Coverage
              </p>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-[11px]">
            <p>© {new Date().getFullYear()} Big Mack Trucking LLC. All rights reserved.</p>
            <p className="font-mono">USDOT# 3843409 • MC# 1398475 • Principal: Omari Headley</p>
          </div>

        </div>
      </footer>

    </div>
  );
}
