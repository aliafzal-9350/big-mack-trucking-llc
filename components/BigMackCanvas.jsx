'use client';

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, useProgress, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import TruckModel from './TruckModel';
import TruckDecals from './TruckDecals';

// Target group rotation (radians) for each camera preset, tuned so the
// truck's front/side/rear face the fixed camera position set below.
const PRESET_ROTATION = {
  front: -Math.PI / 2,
  cab: -Math.PI / 2.6,
  side: -Math.PI / 4,
  rear: Math.PI / 4,
};

function CanvasLoader() {
  const { progress } = useProgress();
  if (progress >= 100) return null;
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#0A0A0C]/90 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3 font-mono text-xs font-bold tracking-widest text-purple-300">
        <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
        Loading 3D preview… {Math.round(progress)}%
      </div>
      <div className="w-56 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// Cinematic entrance (settle into place on mount), a faint idle bob, and a
// subtle mouse-parallax lean — all skipped when the visitor prefers reduced
// motion, leaving only the functional (user-triggered) preset rotation.
function Model({ activePreset, isAutoRotating, reducedMotion }) {
  const groupRef = useRef();
  const elapsed = useRef(0);
  const parallaxLift = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    elapsed.current += delta;

    const pointerX = reducedMotion ? 0 : state.pointer.x;
    const pointerY = reducedMotion ? 0 : state.pointer.y;

    if (isAutoRotating && activePreset === 'orbit') {
      groupRef.current.rotation.y += delta * 0.25;
    } else {
      const baseTarget = PRESET_ROTATION[activePreset] ?? PRESET_ROTATION.front;
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        baseTarget + pointerX * 0.05,
        3.2,
        delta
      );
    }

    parallaxLift.current = THREE.MathUtils.damp(parallaxLift.current, pointerY * 0.04, 4, delta);

    let entranceY = 0;
    let idleY = 0;
    if (!reducedMotion) {
      const t = Math.min(elapsed.current / 1.4, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      entranceY = (eased - 1) * 0.7;
      idleY = Math.sin(elapsed.current * 0.6) * 0.035;
    }

    groupRef.current.position.y = entranceY + idleY + parallaxLift.current;
  });

  return (
    <group ref={groupRef}>
      <TruckModel />
      <TruckDecals />
    </group>
  );
}

class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.warn('3D viewport error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-purple-200 font-mono text-xs bg-white/5 border border-white/10 rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-3">
            <span className="text-2xl">🚚</span>
          </div>
          <p className="font-bold text-white text-sm">3D preview unavailable</p>
          <p className="text-slate-400 text-center mt-1 max-w-xs">Call us directly at (516) 508-8078</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function BigMackCanvas({ activePreset = 'front', isAutoRotating = false }) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-purple-200 font-mono text-xs bg-white/5 border border-white/10 rounded-3xl">
        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-3">
          🚚
        </div>
        <p className="font-bold text-white">3D preview isn't supported on this device</p>
        <p className="text-slate-400 mt-1">Call us directly for details.</p>
      </div>
    );
  }

  return (
    <CanvasErrorBoundary>
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
        <CanvasLoader />
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [14, 4.4, 16], fov: 34 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.15,
          }}
        >
          <ambientLight intensity={1.1} />
          <directionalLight
            position={[12, 16, 10]}
            intensity={2.6}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
            shadow-camera-far={40}
          />
          <directionalLight position={[-12, 10, -10]} intensity={1.3} color="#E9D5FF" />
          <directionalLight position={[0, -10, 0]} intensity={0.35} />
          <directionalLight position={[0, 10, -15]} intensity={1.1} color="#C084FC" />
          <directionalLight position={[10, 6, -6]} intensity={0.8} color="#A855F7" />
          <hemisphereLight skyColor="#FFFFFF" groundColor="#1B0736" intensity={0.6} />

          <Environment resolution={256}>
            <group rotation={[-Math.PI / 4, -0.3, 0]}>
              <Lightformer form="rect" intensity={3.2} color="#FFFFFF" position={[0, 8, 0]} scale={[14, 14, 1]} target={[0, 0, 0]} />
              <Lightformer form="rect" intensity={1.8} color="#E9D5FF" position={[-8, 4, 3]} scale={[16, 4, 1]} target={[0, 0, 0]} />
              <Lightformer form="rect" intensity={3.6} color="#C084FC" position={[8, 3, -4]} scale={[16, 3, 1]} target={[0, 0, 0]} />
              <Lightformer form="ring" intensity={2.6} color="#FFFFFF" position={[0, 1, 8]} scale={[6, 6, 1]} target={[0, 0, 0]} />
            </group>
          </Environment>

          <Suspense fallback={null}>
            <Model activePreset={activePreset} isAutoRotating={isAutoRotating} reducedMotion={reducedMotion} />
            <ContactShadows
              position={[0, 0.01, 0]}
              opacity={0.78}
              scale={18}
              blur={2.2}
              far={6}
              color="#08020E"
            />
          </Suspense>

          <OrbitControls
            target={[0, 1.7, 0]}
            enableZoom={false}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minPolarAngle={Math.PI / 4}
            enableDamping={true}
            dampingFactor={0.06}
          />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
