'use client';

import React, { Suspense, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows, useProgress, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import TruckDecals from './TruckDecals';

// Target group rotation (radians) for each camera preset -- empirically
// mapped by sweeping a full rotation against the fixed camera position and
// picking the angles that actually frame each feature cleanly (this box
// truck's proportions don't put a clean front/side/rear exactly 90/180
// degrees apart from this camera's azimuth).
const PRESET_ROTATION = {
  front: (Math.PI * 4) / 9,
  cab: (Math.PI * 11) / 18,
  side: (Math.PI * 7) / 9,
  rear: (Math.PI * 4) / 9 + Math.PI,
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

// Cinematic entrance (settles into place on mount), a faint idle bob, and a
// subtle mouse-parallax lean -- all skipped when the visitor prefers reduced
// motion, leaving only the functional (user-triggered) preset rotation.
function Model({ activePreset, isAutoRotating, reducedMotion, theme }) {
  const { scene } = useGLTF('/models/truck.glb');
  const groupRef = useRef();
  const elapsed = useRef(0);
  const parallaxLift = useRef(0);

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        const name = (mat.name || '').toLowerCase();
        const isDark = theme === 'dark';

        if (name.includes('phong8')) {
          mat.color = new THREE.Color('#3B0764');
          mat.roughness = 0.16;
          mat.metalness = 0.72;
        } else if (name.includes('phong16')) {
          mat.color = new THREE.Color('#4C1D95');
          mat.roughness = 0.22;
          mat.metalness = 0.45;
        } else if (name.includes('phong7')) {
          mat.color = new THREE.Color('#F8FAFC');
          mat.roughness = 0.05;
          mat.metalness = 0.98;
        } else if (name.includes('phong3')) {
          mat.color = new THREE.Color('#E2E8F0');
          mat.roughness = 0.12;
          mat.metalness = 0.92;
        } else if (name.includes('phong18')) {
          mat.color = new THREE.Color('#141416');
          mat.roughness = 0.88;
          mat.metalness = 0.02;
        } else if (name.includes('phong5')) {
          mat.color = new THREE.Color('#0F172A');
          mat.roughness = 0.65;
          mat.metalness = 0.35;
        } else if (name.includes('phong6')) {
          mat.color = new THREE.Color('#090D16');
          mat.roughness = 0.18;
          mat.metalness = 0.85;
        } else if (name.includes('phong10')) {
          // Headlights: bright glowing lens at night, plain lit glass by day.
          mat.color = new THREE.Color('#FFFFFF');
          mat.emissive = new THREE.Color('#FFF7E0');
          mat.emissiveIntensity = isDark ? 3.2 : 0.15;
          mat.roughness = 0.05;
          mat.metalness = 0.3;
        } else if (name.includes('phong9') || name.includes('phong19')) {
          mat.color = new THREE.Color('#080B14');
          mat.roughness = 0.03;
          mat.metalness = 0.95;
          mat.transparent = true;
          mat.opacity = 0.86;
        } else if (name.includes('phong14')) {
          mat.color = new THREE.Color('#F97316');
          mat.emissive = new THREE.Color('#EA580C');
          mat.emissiveIntensity = isDark ? 1.1 : 0.35;
          mat.transparent = true;
          mat.opacity = 0.85;
        } else if (name.includes('phong13')) {
          // Brake/tail lights: glow red at night (running lights), subdued by day.
          mat.color = new THREE.Color('#EF4444');
          mat.emissive = new THREE.Color('#DC2626');
          mat.emissiveIntensity = isDark ? 1.6 : 0.25;
          mat.transparent = true;
          mat.opacity = 0.85;
        } else if (name.includes('phong17') || name.includes('phong15')) {
          mat.color = new THREE.Color('#334155');
          mat.roughness = 0.35;
          mat.metalness = 0.85;
        } else if (name.includes('phong4')) {
          mat.color = new THREE.Color('#181424');
          mat.roughness = 0.75;
          mat.metalness = 0.1;
        }
        mat.needsUpdate = true;
      }
    });
  }, [scene, theme]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    elapsed.current += delta;

    const pointerX = reducedMotion ? 0 : state.pointer.x;
    const pointerY = reducedMotion ? 0 : state.pointer.y;

    if (isAutoRotating && activePreset === 'orbit') {
      groupRef.current.rotation.y += delta * 0.35;
    } else {
      const baseTarget = PRESET_ROTATION[activePreset] ?? PRESET_ROTATION.front;
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        baseTarget + pointerX * 0.05,
        3.2,
        delta
      );
    }

    parallaxLift.current = THREE.MathUtils.damp(parallaxLift.current, pointerY * 0.03, 4, delta);

    let entranceY = 0;
    let idleY = 0;
    if (!reducedMotion) {
      const t = Math.min(elapsed.current / 1.4, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      entranceY = (eased - 1) * 0.5;
      idleY = Math.sin(elapsed.current * 0.6) * 0.025;
    }

    groupRef.current.position.y = -0.65 + entranceY + idleY + parallaxLift.current;
  });

  return (
    <group ref={groupRef} position={[0.75, -0.65, 0]}>
      <primitive object={scene} scale={34} />
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

export default function BigMackCanvas({ activePreset = 'front', isAutoRotating = false, theme = 'dark' }) {
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

  const isDark = theme === 'dark';

  return (
    <CanvasErrorBoundary>
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
        <CanvasLoader />
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [5.2, 2.0, 5.0], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: isDark ? 1.15 : 1.3,
          }}
        >
          <ambientLight intensity={isDark ? 1.0 : 1.7} />
          <directionalLight
            position={[12, 16, 10]}
            intensity={isDark ? 2.6 : 3.4}
            color={isDark ? '#FFFFFF' : '#FFF6E8'}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-left={-8}
            shadow-camera-right={8}
            shadow-camera-top={8}
            shadow-camera-bottom={-8}
            shadow-camera-far={40}
          />
          <directionalLight position={[-12, 10, -10]} intensity={isDark ? 1.3 : 0.7} color={isDark ? '#E9D5FF' : '#FFFFFF'} />
          <directionalLight position={[0, -10, 0]} intensity={0.35} />
          <directionalLight position={[0, 10, -15]} intensity={isDark ? 1.1 : 0.4} color={isDark ? '#C084FC' : '#FFFFFF'} />
          <directionalLight position={[10, 6, -6]} intensity={isDark ? 0.8 : 0.3} color={isDark ? '#A855F7' : '#FFFFFF'} />
          <hemisphereLight skyColor={isDark ? '#FFFFFF' : '#FFFFFF'} groundColor={isDark ? '#1B0736' : '#D8D2E8'} intensity={isDark ? 0.6 : 0.9} />

          <Environment resolution={256}>
            <group rotation={[-Math.PI / 4, -0.3, 0]}>
              <Lightformer form="rect" intensity={isDark ? 3.2 : 4.2} color="#FFFFFF" position={[0, 8, 0]} scale={[14, 14, 1]} target={[0, 0, 0]} />
              <Lightformer form="rect" intensity={isDark ? 1.8 : 1.2} color={isDark ? '#E9D5FF' : '#FFFFFF'} position={[-8, 4, 3]} scale={[16, 4, 1]} target={[0, 0, 0]} />
              <Lightformer form="rect" intensity={isDark ? 3.6 : 1.4} color={isDark ? '#C084FC' : '#FFFFFF'} position={[8, 3, -4]} scale={[16, 3, 1]} target={[0, 0, 0]} />
              <Lightformer form="ring" intensity={isDark ? 2.6 : 3.0} color="#FFFFFF" position={[0, 1, 8]} scale={[6, 6, 1]} target={[0, 0, 0]} />
            </group>
          </Environment>

          <Suspense fallback={null}>
            <Model activePreset={activePreset} isAutoRotating={isAutoRotating} reducedMotion={reducedMotion} theme={theme} />
            <ContactShadows
              position={[0, -0.66, 0]}
              opacity={isDark ? 0.8 : 0.45}
              scale={14}
              blur={2.2}
              far={4}
              color={isDark ? '#08020E' : '#3A3450'}
            />
          </Suspense>

          <OrbitControls
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
