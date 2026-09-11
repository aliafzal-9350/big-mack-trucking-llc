'use client';

import React, { Suspense, useRef, useState, useEffect, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, ContactShadows, useProgress, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import TruckDecals from './TruckDecals';

// Eagerly preload critical 3D assets at the module level so network streaming begins immediately
if (typeof window !== 'undefined') {
  useGLTF.preload('/models/truck.glb');
  useTexture.preload('/image/logo-transparent.png');
}

// Target group rotation (radians) for each camera preset.
// 'front' default preset is set to the 110° hero 3/4 angle, displaying both
// the iconic purple cab and the branded cargo box simultaneously.
const PRESET_ROTATION = {
  front: (Math.PI * 11) / 18,
  cab: (Math.PI * 11) / 18,
  side: (Math.PI * 7) / 9,
  rear: (Math.PI * 4) / 9 + Math.PI,
};

// GPU shader pre-warming: compiles all materials and lighting shaders before the first frame
function SceneWarmup() {
  const { gl, scene, camera } = useThree();
  useLayoutEffect(() => {
    try {
      gl.compile(scene, camera);
    } catch (_) {}
  }, [gl, scene, camera]);
  return null;
}

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

// Dynamically adjusts camera FOV and distance so the 3D model truck
// appears significantly bigger and prominent by default on both mobile and desktop.
function ResponsiveCamera({ truckX, truckY }) {
  const { camera, size } = useThree();

  useEffect(() => {
    const aspect = size.width / size.height;

    if (aspect < 0.8) {
      // Tall narrow portrait phone (e.g. 390x844 iPhone, aspect ~ 0.46 - 0.75)
      // Camera is moved close (dist ~4.9) with tight FOV so the truck is large, bold, and fills the card
      camera.position.set(3.4, 1.25, 3.4);
      camera.fov = 38;
    } else if (aspect < 1.15) {
      // Square or compact tablet card view
      camera.position.set(3.6, 1.35, 3.6);
      camera.fov = 38;
    } else if (aspect < 1.45) {
      // Small laptop or tablet landscape
      camera.position.set(truckX + 3.3, truckY + 1.4, 3.3);
      camera.fov = 37;
    } else {
      // Standard widescreen desktop: truck is bold, large, and commanding in right hero space
      camera.position.set(truckX + 3.2, truckY + 1.4, 3.2);
      camera.fov = 36;
    }
    camera.updateProjectionMatrix();
  }, [size.width, size.height, camera, truckX, truckY]);

  return null;
}

// Cinematic entrance, weighted suspension idle, subtle mouse-parallax lean,
// and responsive horizontal centering.
function Model({ activePreset, isAutoRotating, reducedMotion, theme, truckX, truckY }) {
  const { scene } = useGLTF('/models/truck.glb');
  const groupRef = useRef();
  const elapsed = useRef(0);
  const parallaxLift = useRef(0);

  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        if (child.material) {
          const mat = child.material;
          const name = (mat.name || '').toLowerCase();
          const isDark = theme === 'dark';

          if (name.includes('phong8')) {
            // Cab: Authentic Freightliner Royal Purple with deep metallic clearcoat
            mat.color = new THREE.Color('#4E1F84');
            mat.roughness = 0.16;
            mat.metalness = 0.48;
          } else if (name.includes('phong16')) {
            // Cargo box: Deep Midnight Indigo / Plum (matching real truck photo)
            mat.color = new THREE.Color('#26153B');
            mat.roughness = 0.36;
            mat.metalness = 0.12;
          } else if (name.includes('phong6')) {
            // Front Grille: Authentic Freightliner horizontal chrome slats (matching real truck photo)
            mat.color = new THREE.Color('#D1D5DB');
            mat.roughness = 0.16;
            mat.metalness = 0.94;
          } else if (name.includes('phong12')) {
            // Grille frame & headlight bezels: Polished chrome
            mat.color = new THREE.Color('#E2E8F0');
            mat.roughness = 0.14;
            mat.metalness = 0.96;
          } else if (name.includes('phong7')) {
            // Box corner extrusions & perimeter rail: Brushed aluminum
            mat.color = new THREE.Color('#E2E8F0');
            mat.roughness = 0.18;
            mat.metalness = 0.92;
          } else if (name.includes('phong11')) {
            // Boarding steps & fuel tank: Brushed heavy-gauge aluminum
            mat.color = new THREE.Color('#CBD5E1');
            mat.roughness = 0.26;
            mat.metalness = 0.88;
          } else if (name.includes('phong3')) {
            // Wheel rims: Commercial fleet alloy silver
            mat.color = new THREE.Color('#CBD5E1');
            mat.roughness = 0.22;
            mat.metalness = 0.88;
          } else if (name.includes('phong18')) {
            // Tires: Deep carbon tread rubber
            mat.color = new THREE.Color('#131316');
            mat.roughness = 0.85;
            mat.metalness = 0.02;
          } else if (name.includes('phong5')) {
            // Bumper & Chassis: Heavy-duty commercial satin black
            mat.color = new THREE.Color('#15171B');
            mat.roughness = 0.72;
            mat.metalness = 0.14;
          } else if (name.includes('phong10')) {
            // Headlights: Clear lens with luminous crystal core
            mat.color = new THREE.Color('#FFFFFF');
            mat.emissive = new THREE.Color('#FFF8E7');
            mat.emissiveIntensity = isDark ? 3.4 : 0.25;
            mat.roughness = 0.05;
            mat.metalness = 0.3;
          } else if (name.includes('phong9') || name.includes('phong19')) {
            // Windshield & side glass: Deep automotive safety tint
            mat.color = new THREE.Color('#0A0E18');
            mat.roughness = 0.04;
            mat.metalness = 0.92;
            mat.transparent = true;
            mat.opacity = 0.88;
          } else if (name.includes('phong14')) {
            // Amber turn signals & cab roof clearance markers
            mat.color = new THREE.Color('#F97316');
            mat.emissive = new THREE.Color('#EA580C');
            mat.emissiveIntensity = isDark ? 1.4 : 0.4;
            mat.transparent = true;
            mat.opacity = 0.88;
          } else if (name.includes('phong13')) {
            // Rear tail & brake lights
            mat.color = new THREE.Color('#EF4444');
            mat.emissive = new THREE.Color('#DC2626');
            mat.emissiveIntensity = isDark ? 1.8 : 0.3;
            mat.transparent = true;
            mat.opacity = 0.88;
          } else if (name.includes('phong17') || name.includes('phong15')) {
            // Brake drums & discs: Industrial cast iron
            mat.color = new THREE.Color('#475569');
            mat.roughness = 0.45;
            mat.metalness = 0.75;
          } else if (name.includes('phong4')) {
            // Cab interior: Charcoal slate
            mat.color = new THREE.Color('#111827');
            mat.roughness = 0.8;
            mat.metalness = 0.05;
          }
          mat.needsUpdate = true;
        }
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

    parallaxLift.current = THREE.MathUtils.damp(parallaxLift.current, pointerY * 0.02, 4, delta);

    let entranceY = 0;
    let idleY = 0;
    if (!reducedMotion) {
      const t = Math.min(elapsed.current / 1.4, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      entranceY = (eased - 1) * 0.4;
      // Gentle heavy-truck suspension idle breath, kept subtle so tires stay firmly grounded
      idleY = Math.sin(elapsed.current * 0.5) * 0.008;
    }

    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, truckX, 4, delta);
    groupRef.current.position.y = truckY + entranceY + idleY + parallaxLift.current;
  });

  return (
    <group ref={groupRef} position={[truckX, truckY, 0]}>
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

export default function BigMackCanvas({ activePreset = 'orbit', isAutoRotating = true, theme = 'dark' }) {
  const [hasWebGL, setHasWebGL] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [deviceMode, setDeviceMode] = useState('desktop');

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

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setDeviceMode('mobile');
      } else if (w < 1100) {
        setDeviceMode('tablet');
      } else {
        setDeviceMode('desktop');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
  // Responsive truck coordinates:
  // Mobile: centered in the dedicated 3D card (x = 0, y = -0.55).
  // Tablet: shifted slightly to leave room for text (x = 0.8, y = -0.40).
  // Desktop: placed in the right hero quadrant (x = 1.38, y = -0.24) so it NEVER overlaps
  // hero text on the left, and stays comfortably above the preset dock on the bottom.
  const truckX = deviceMode === 'mobile' ? 0 : deviceMode === 'tablet' ? 0.8 : 1.38;
  const truckY = deviceMode === 'mobile' ? -0.55 : deviceMode === 'tablet' ? -0.4 : -0.24;

  return (
    <CanvasErrorBoundary>
      <div className="w-full h-full relative cursor-grab active:cursor-grabbing select-none">
        <CanvasLoader />
        <Canvas
          shadows={{ type: THREE.PCFSoftShadowMap }}
          dpr={[1, 2]}
          camera={{ position: [3.4, 1.25, 3.4], fov: 38 }}
          gl={{
            antialias: true,
            alpha: true,
            stencil: false,
            powerPreference: 'high-performance',
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: isDark ? 1.18 : 1.32,
          }}
        >
          <SceneWarmup />
          <ResponsiveCamera truckX={truckX} truckY={truckY} />

          <ambientLight intensity={isDark ? 1.1 : 1.8} />

          {/* Key sunlight casting realistic directional drop shadow with PCF soft filtering */}
          <directionalLight
            position={[9, 15, 7.5]}
            intensity={isDark ? 2.8 : 3.6}
            color={isDark ? '#FFFFFF' : '#FFF8F0'}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-7}
            shadow-camera-right={7}
            shadow-camera-top={7}
            shadow-camera-bottom={-7}
            shadow-camera-near={0.5}
            shadow-camera-far={32}
            shadow-bias={-0.00012}
            shadow-normalBias={0.02}
          />
          {/* Subtle violet-indigo fill light */}
          <directionalLight position={[-12, 10, -10]} intensity={isDark ? 1.4 : 0.8} color={isDark ? '#E9D5FF' : '#FFFFFF'} />
          <directionalLight position={[0, -10, 0]} intensity={0.35} />
          {/* Crisp automotive rim highlight across the roofline and box top */}
          <directionalLight position={[0, 10, -15]} intensity={isDark ? 1.2 : 0.45} color={isDark ? '#C084FC' : '#FFFFFF'} />
          <directionalLight position={[10, 6, -6]} intensity={isDark ? 0.9 : 0.35} color={isDark ? '#A855F7' : '#FFFFFF'} />
          <hemisphereLight skyColor="#FFFFFF" groundColor={isDark ? '#19062E' : '#D1CBDD'} intensity={isDark ? 0.65 : 0.95} />

          <Environment resolution={256}>
            <group rotation={[-Math.PI / 4, -0.3, 0]}>
              <Lightformer form="rect" intensity={isDark ? 3.4 : 4.4} color="#FFFFFF" position={[0, 8, 0]} scale={[14, 14, 1]} target={[0, 0, 0]} />
              <Lightformer form="rect" intensity={isDark ? 2.0 : 1.4} color={isDark ? '#E9D5FF' : '#FFFFFF'} position={[-8, 4, 3]} scale={[16, 4, 1]} target={[0, 0, 0]} />
              <Lightformer form="rect" intensity={isDark ? 3.8 : 1.6} color={isDark ? '#C084FC' : '#FFFFFF'} position={[8, 3, -4]} scale={[16, 3, 1]} target={[0, 0, 0]} />
              <Lightformer form="ring" intensity={isDark ? 2.8 : 3.2} color="#FFFFFF" position={[0, 1, 8]} scale={[6, 6, 1]} target={[0, 0, 0]} />
            </group>
          </Environment>

          <Suspense fallback={null}>
            <Model
              activePreset={activePreset}
              isAutoRotating={isAutoRotating}
              reducedMotion={reducedMotion}
              theme={theme}
              truckX={truckX}
              truckY={truckY}
            />

            {/* Multi-tier realistic shadow system dynamically placed under the truck */}
            {/* 1. Ground shadow receiver plane for authentic directional sun drop shadow */}
            <mesh
              receiveShadow
              rotation={[-Math.PI / 2, 0, 0]}
              position={[truckX, truckY - 0.005, 0]}
            >
              <planeGeometry args={[50, 50]} />
              <shadowMaterial
                transparent
                opacity={isDark ? 0.44 : 0.30}
              />
            </mesh>

            {/* 2. Soft radial asphalt anchor disc under the truck to ground the vehicle */}
            <mesh
              rotation={[-Math.PI / 2, 0, 0]}
              position={[truckX, truckY - 0.006, 0]}
            >
              <ringGeometry args={[0, 7.5, 64]} />
              <meshBasicMaterial
                color={isDark ? '#0b0614' : '#ded7e5'}
                transparent
                opacity={isDark ? 0.38 : 0.24}
                depthWrite={false}
              />
            </mesh>

            {/* 3. Razor-sharp tire contact occlusion directly under the 6 wheels */}
            <ContactShadows
              position={[truckX, truckY - 0.001, 0]}
              opacity={isDark ? 0.96 : 0.72}
              scale={10.0}
              blur={0.8}
              far={1.5}
              resolution={1024}
              color={isDark ? '#04010a' : '#1b1424'}
            />

            {/* 4. Diffuse underbody occlusion under the 26ft chassis */}
            <ContactShadows
              position={[truckX, truckY - 0.003, 0]}
              opacity={isDark ? 0.55 : 0.36}
              scale={14.0}
              blur={2.0}
              far={3.0}
              resolution={512}
              color={isDark ? '#070210' : '#2b2336'}
            />
          </Suspense>

          <OrbitControls
            target={[truckX, truckY + 0.45, 0]}
            enableZoom={true}
            minDistance={2.6}
            maxDistance={9.0}
            enablePan={false}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minPolarAngle={Math.PI / 4}
            enableDamping={true}
            dampingFactor={0.07}
            touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
          />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}

