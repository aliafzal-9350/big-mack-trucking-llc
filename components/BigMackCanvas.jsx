'use client';

import React, { Suspense, useRef, useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture, ContactShadows, Text, Center, useProgress, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';

function CanvasLoader() {
  const { progress } = useProgress();
  if (progress >= 100) return null;
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#08040C]/90 backdrop-blur-md">
      <div className="flex items-center gap-2 mb-3 font-mono text-xs font-black tracking-widest text-purple-400">
        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping" />
        INITIALIZING 3D FLEET TELEMETRY • {Math.round(progress)}%
      </div>
      <div className="w-56 h-1.5 bg-purple-950/80 rounded-full overflow-hidden border border-purple-800/40">
        <div 
          className="h-full bg-gradient-to-r from-purple-700 via-fuchsia-500 to-purple-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="mt-3 font-mono text-[10px] tracking-wider text-purple-300/70 uppercase">
        Big Mack Trucking LLC • USDOT 3843409
      </span>
    </div>
  );
}

function TruckDecals() {
  const doorText = `BIG MACK TRUCKING\nUSDOT 3843409\nMC 1398475\nGVWR 26,000 LBS`;
  
  // Load official company logo for cargo box sides & rear rollup
  const logoTexture = useTexture('/image/logo-transparent.png');
  
  useEffect(() => {
    if (logoTexture) {
      logoTexture.anisotropy = 16;
      logoTexture.generateMipmaps = true;
      logoTexture.needsUpdate = true;
    }
  }, [logoTexture]);

  return (
    <group>
      <group scale={34}>
      {/* Driver Side Cab Compliance Stencil */}
      <group position={[-0.416, 0.48, 0.92]} rotation={[0, -Math.PI / 2, 0]}>
        <Text
          material-side={THREE.FrontSide}
          onSync={(t) => { if (t.material) t.material.side = THREE.FrontSide; }}
          fontSize={0.026}
          lineHeight={1.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          fontWeight="black"
          letterSpacing={0.04}
        >
          {doorText}
        </Text>
      </group>

      {/* Passenger Side Cab Compliance Stencil */}
      <group position={[0.416, 0.48, 0.92]} rotation={[0, Math.PI / 2, 0]}>
        <Text
          material-side={THREE.FrontSide}
          onSync={(t) => { if (t.material) t.material.side = THREE.FrontSide; }}
          fontSize={0.026}
          lineHeight={1.25}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
          fontWeight="black"
          letterSpacing={0.04}
        >
          {doorText}
        </Text>
      </group>

      {/* Driver Side Cargo Box Official Logo Decal */}
      <mesh position={[-0.441, 0.68, -0.39]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.55, 0.55]} />
        <meshStandardMaterial
          map={logoTexture}
          transparent={true}
          roughness={0.2}
          metalness={0.1}
          depthWrite={false}
          polygonOffset={true}
          polygonOffsetFactor={-2}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Passenger Side Cargo Box Official Logo Decal */}
      <mesh position={[0.441, 0.68, -0.39]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.55, 0.55]} />
        <meshStandardMaterial
          map={logoTexture}
          transparent={true}
          roughness={0.2}
          metalness={0.1}
          depthWrite={false}
          polygonOffset={true}
          polygonOffsetFactor={-2}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Rear Rollup Door: Official Logo & Compliance Lettering */}
      <group position={[0, 0.68, -1.312]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.12, 0]}>
          <planeGeometry args={[0.32, 0.32]} />
          <meshStandardMaterial
            map={logoTexture}
            transparent={true}
            roughness={0.2}
            metalness={0.1}
            depthWrite={false}
            polygonOffset={true}
            polygonOffsetFactor={-2}
            side={THREE.FrontSide}
          />
        </mesh>
        <Text 
          material-side={THREE.FrontSide}
          onSync={(t) => { if (t.material) t.material.side = THREE.FrontSide; }}
          position={[0, -0.09, 0]}
          fontSize={0.038} 
          letterSpacing={0.04} 
          color="#FFFFFF" 
          anchorX="center" 
          anchorY="middle" 
          fontWeight="900"
        >
          BIG MACK TRUCKING
        </Text>
        <Text 
          material-side={THREE.FrontSide}
          onSync={(t) => { if (t.material) t.material.side = THREE.FrontSide; }}
          position={[0, -0.15, 0]} 
          fontSize={0.022} 
          letterSpacing={0.06} 
          color="#C084FC" 
          anchorX="center" 
          anchorY="middle" 
          fontWeight="bold"
        >
          USDOT 3843409 • MC 1398475 • GVW 26,000 LBS
        </Text>
        <Text 
          material-side={THREE.FrontSide}
          onSync={(t) => { if (t.material) t.material.side = THREE.FrontSide; }}
          position={[0, -0.20, 0]} 
          fontSize={0.019} 
          letterSpacing={0.05} 
          color="#E9D5FF" 
          anchorX="center" 
          anchorY="middle" 
          fontWeight="bold"
        >
          DIRECT DISPATCH: (516) 508-8078
        </Text>
      </group>
      </group>
    </group>
  );
}

function Model({ activePreset, isAutoRotating }) {
  const { scene } = useGLTF('/models/truck.glb');
  const groupRef = useRef();

  // Map each individual mesh/material to realistic automotive PBR materials
  useLayoutEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mat = child.material;
        const name = (mat.name || '').toLowerCase();

        // 1. Cab Body Paint (phong8) - Metallic Royal Purple Clearcoat
        if (name.includes('phong8')) {
          mat.color = new THREE.Color('#3B0764');
          mat.roughness = 0.16;
          mat.metalness = 0.72;
          mat.needsUpdate = true;
        }
        // 2. Cargo Box Exterior (phong16) - Fleet Metallic Purple
        else if (name.includes('phong16')) {
          mat.color = new THREE.Color('#4C1D95');
          mat.roughness = 0.22;
          mat.metalness = 0.45;
          mat.needsUpdate = true;
        }
        // 3. Mirror Chrome (Bumper, Exhaust, Side Steps, Handles - phong7)
        else if (name.includes('phong7')) {
          mat.color = new THREE.Color('#F8FAFC');
          mat.roughness = 0.05;
          mat.metalness = 0.98;
          mat.needsUpdate = true;
        }
        // 4. Polished Alloy Wheel Rims (phong3)
        else if (name.includes('phong3')) {
          mat.color = new THREE.Color('#E2E8F0');
          mat.roughness = 0.12;
          mat.metalness = 0.92;
          mat.needsUpdate = true;
        }
        // 5. Vulcanized Rubber Tires (phong18)
        else if (name.includes('phong18')) {
          mat.color = new THREE.Color('#141416');
          mat.roughness = 0.88;
          mat.metalness = 0.02;
          mat.needsUpdate = true;
        }
        // 6. Industrial Chassis & Undercarriage Frame (phong5)
        else if (name.includes('phong5')) {
          mat.color = new THREE.Color('#0F172A');
          mat.roughness = 0.65;
          mat.metalness = 0.35;
          mat.needsUpdate = true;
        }
        // 7. Front Grille Diamond Mesh (phong6)
        else if (name.includes('phong6')) {
          mat.color = new THREE.Color('#090D16');
          mat.roughness = 0.18;
          mat.metalness = 0.85;
          mat.needsUpdate = true;
        }
        // 8. Crystal Xenon Headlights (phong10)
        else if (name.includes('phong10')) {
          mat.color = new THREE.Color('#FFFFFF');
          mat.emissive = new THREE.Color('#F1F5F9');
          mat.emissiveIntensity = 0.8;
          mat.roughness = 0.05;
          mat.metalness = 0.3;
          mat.needsUpdate = true;
        }
        // 9. Tinted Automotive Glass (phong9, phong19)
        else if (name.includes('phong9') || name.includes('phong19')) {
          mat.color = new THREE.Color('#080B14');
          mat.roughness = 0.03;
          mat.metalness = 0.95;
          mat.transparent = true;
          mat.opacity = 0.86;
          mat.needsUpdate = true;
        }
        // 10. Amber Signals (phong14)
        else if (name.includes('phong14')) {
          mat.color = new THREE.Color('#F97316');
          mat.emissive = new THREE.Color('#EA580C');
          mat.emissiveIntensity = 0.35;
          mat.transparent = true;
          mat.opacity = 0.85;
          mat.needsUpdate = true;
        }
        // 11. Red Brake Lights (phong13)
        else if (name.includes('phong13')) {
          mat.color = new THREE.Color('#EF4444');
          mat.emissive = new THREE.Color('#DC2626');
          mat.emissiveIntensity = 0.45;
          mat.transparent = true;
          mat.opacity = 0.85;
          mat.needsUpdate = true;
        }
        // 12. Brake Rotors & Calipers (phong17, phong15)
        else if (name.includes('phong17') || name.includes('phong15')) {
          mat.color = new THREE.Color('#334155');
          mat.roughness = 0.35;
          mat.metalness = 0.85;
          mat.needsUpdate = true;
        }
        // 13. Cab Interior (phong4)
        else if (name.includes('phong4')) {
          mat.color = new THREE.Color('#181424');
          mat.roughness = 0.75;
          mat.metalness = 0.1;
          mat.needsUpdate = true;
        }
      }
    });
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isAutoRotating && activePreset === 'orbit') {
      // Gentle cinematic 360 showcase drift
      groupRef.current.rotation.y += delta * 0.35;
    } else {
      let targetRotationY = -Math.PI / 3.6; // default 3/4 perspective
      if (activePreset === 'front') targetRotationY = -Math.PI / 4.5;
      if (activePreset === 'cab') targetRotationY = -Math.PI / 3.2;
      if (activePreset === 'side') targetRotationY = -Math.PI / 2;
      if (activePreset === 'rear') targetRotationY = -Math.PI * 1.03;

      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        targetRotationY,
        3.2,
        delta
      );
    }
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
    console.warn('3D Viewport caught error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-purple-300 font-mono text-xs bg-purple-950/20 border border-purple-800/30 rounded-3xl">
          <div className="w-12 h-12 rounded-2xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center mb-3">
            <span className="text-2xl">🚚</span>
          </div>
          <p className="font-bold text-white text-sm">Big Mack 3D Telemetry Offline</p>
          <p className="text-slate-400 text-center mt-1 max-w-xs">Direct 24/7 Expedited Dispatch active at (516) 508-8078</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function BigMackCanvas({ activePreset = 'front', isAutoRotating = false }) {
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-purple-400 font-mono text-xs bg-purple-950/20 border border-purple-800/30 rounded-3xl">
        <div className="w-12 h-12 rounded-2xl bg-purple-900/50 flex items-center justify-center mb-3">
          🚚
        </div>
        <p className="font-bold text-white">3D Fleet Telemetry Offline</p>
        <p className="text-slate-400 mt-1">GPU Hardware Acceleration Required for WebGL Viewport</p>
      </div>
    );
  }

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
            toneMappingExposure: 1.25,
          }}
        >
          {/* Studio Lighting & Procedural Lightformer Environment Reflections */}
          <ambientLight intensity={1.1} />
          <directionalLight position={[12, 16, 10]} intensity={2.8} castShadow />
          <directionalLight position={[-12, 10, -10]} intensity={1.5} color="#E9D5FF" />
          <directionalLight position={[0, -10, 0]} intensity={0.4} />
          <directionalLight position={[0, 10, -15]} intensity={1.4} color="#C084FC" />
          <directionalLight position={[10, 6, -6]} intensity={1.0} color="#A855F7" />
          <hemisphereLight skyColor="#FFFFFF" groundColor="#1B0736" intensity={0.7} />

          {/* Procedural Studio Environment for authentic Chrome and Metallic reflections */}
          <Environment resolution={256}>
            <group rotation={[-Math.PI / 4, -0.3, 0]}>
              <Lightformer form="rect" intensity={3.5} color="#FFFFFF" position={[0, 8, 0]} scale={[14, 14, 1]} target={[0, 0, 0]} />
              <Lightformer form="rect" intensity={2.0} color="#E9D5FF" position={[-8, 4, 3]} scale={[16, 4, 1]} target={[0, 0, 0]} />
              <Lightformer form="rect" intensity={4.0} color="#C084FC" position={[8, 3, -4]} scale={[16, 3, 1]} target={[0, 0, 0]} />
              <Lightformer form="ring" intensity={3.0} color="#FFFFFF" position={[0, 1, 8]} scale={[6, 6, 1]} target={[0, 0, 0]} />
            </group>
          </Environment>

          <Suspense fallback={null}>
            <Model activePreset={activePreset} isAutoRotating={isAutoRotating} />
            <ContactShadows
              position={[0, -0.66, 0]}
              opacity={0.80}
              scale={14}
              blur={2.2}
              far={4}
              color="#08020E"
            />
          </Suspense>

          {/* OrbitControls with scroll-zoom strictly disabled so page scrolling is seamless */}
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
