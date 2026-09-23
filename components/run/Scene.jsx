'use client';

import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { mark, run, setRun, useRun } from '@/lib/runStore';
import { TIERS } from '@/lib/quality';
import Truck from './Truck';
import { preloadTruckModel } from './model';
import CameraRig from './CameraRig';
import WorldDriver from './WorldDriver';
import { Lights, Reflections } from './Lights';
import Ground from './Ground';
import Road from './Road';
import Sky from './Sky';
import Effects from './Effects';
import Dock from './props/Dock';
import { Streetlights, Gantries } from './props/Roadside';
import { Containers, Cranes, Gate } from './props/Port';
import DropSite from './props/DropSite';
import Beacons from './props/Beacons';
import Skyline from './props/Skyline';

preloadTruckModel();
mark('scene-chunk');

// Once the truck and its lettering are in the scene, compile every shader up front,
// including objects that start hidden (x-ray load, map beacons, liftgate pallet). Shader
// compiles are slow on Windows (ANGLE/D3D11); done lazily they stall mid-scroll.
function Ready() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    let cancelled = false;
    const waitForLivery = () =>
      new Promise((resolve) => {
        const started = performance.now();
        const check = () => (run.liveryReady || performance.now() - started > 3000 ? resolve() : setTimeout(check, 50));
        check();
      });
    const go = async () => {
      mark('model');
      await waitForLivery();
      mark('livery');
      const hidden = [];
      scene.traverse((o) => {
        if (!o.visible) {
          hidden.push(o);
          o.visible = true;
        }
      });
      try {
        if (gl.compileAsync) await gl.compileAsync(scene, camera);
        else gl.compile(scene, camera);
      } catch {
        // compile is an optimization only
      }
      hidden.forEach((o) => {
        o.visible = false;
      });
      mark('compiled');
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (cancelled || run.stage !== 'loading') return;
          mark('intro');
          setRun(run.reducedMotion ? { stage: 'ready', intro: 1 } : { stage: 'intro', intro: 0 });
        }),
      );
    };
    go();
    return () => {
      cancelled = true;
    };
  }, [gl, scene, camera]);
  return null;
}

export default function Scene() {
  const tierName = useRun((r) => r.tier);
  const tier = { ...TIERS[tierName] };

  return (
    <Canvas
      dpr={tier.dpr}
      flat={false}
      gl={{
        antialias: !tier.post,
        alpha: false,
        stencil: false,
        powerPreference: 'high-performance',
        toneMapping: tier.post ? THREE.NoToneMapping : THREE.NeutralToneMapping,
      }}
      camera={{ fov: 30, near: 0.1, far: 900, position: [4, 1.4, 6] }}
      onCreated={(state) => {
        state.gl.setClearColor('#0b0817');
        if (process.env.NODE_ENV !== 'production' || window.location.search.includes('debug')) window.__three = state;
      }}
    >
      <WorldDriver />
      <CameraRig />
      <Lights />
      <Reflections />
      <Sky />
      <Ground />
      <Road />
      <Skyline count={tierName === 'low' ? 120 : 240} />
      <Dock />
      <Streetlights step={tier.lampStep} />
      <Gantries />
      <Containers density={tier.containers} />
      <Cranes />
      <Gate />
      <DropSite />
      <Beacons />
      <Suspense fallback={null}>
        <Truck />
        <Ready />
      </Suspense>
      {tier.post ? <Effects msaa={tier.msaa} /> : null}
    </Canvas>
  );
}
