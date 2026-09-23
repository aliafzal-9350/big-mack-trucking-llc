'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { run } from '@/lib/runStore';

// Tuck-under hydraulic liftgate + the pallet it brings down + the pallet jack that takes it away.
// Driven by run.sample.state.liftgate (0 stowed -> 1 pallet delivered to the curb).
const FLOOR_Y = 0.372;
const STOW = { y: 0.262, z: -1.2 };
const OUT_Z = -1.62;

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const phase = (x, a, b) => clamp01((x - a) / (b - a));
const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

export default function Liftgate() {
  const platform = useRef();
  const armL = useRef();
  const armR = useRef();
  const pallet = useRef();
  const jack = useRef();

  const mats = useMemo(
    () => ({
      plate: new THREE.MeshStandardMaterial({ color: '#b9bec8', metalness: 0.85, roughness: 0.35 }),
      arm: new THREE.MeshStandardMaterial({ color: '#2a2d35', metalness: 0.6, roughness: 0.45 }),
      wood: new THREE.MeshStandardMaterial({ color: '#8a6a44', roughness: 0.85 }),
      wrap: new THREE.MeshStandardMaterial({ color: '#e7e0f2', roughness: 0.45, metalness: 0.05 }),
      band: new THREE.MeshStandardMaterial({ color: '#ffa54a', roughness: 0.5, emissive: new THREE.Color('#ff8a1c'), emissiveIntensity: 0.25 }),
      jack: new THREE.MeshStandardMaterial({ color: '#d4442e', metalness: 0.3, roughness: 0.5 }),
      steel: new THREE.MeshStandardMaterial({ color: '#30333b', metalness: 0.7, roughness: 0.4 }),
    }),
    [],
  );

  useFrame(() => {
    // In the Book beat the liftgate previews the form: checked means the platform sits out
    // at floor height, ready for your pallets.
    const inBook = run.sample.index === 5 ? Math.min(1, Math.max(0, (run.sample.t - 0.45) / 0.5)) : 0;
    const preview = run.load.liftgate ? 0.38 * inBook : 0;
    const g = Math.max(run.sample.state.liftgate, preview);
    const slide = ease(phase(g, 0, 0.26));
    const rise = ease(phase(g, 0.26, 0.38));
    const load = ease(phase(g, 0.38, 0.58));
    const lower = ease(phase(g, 0.58, 0.84));
    const off = ease(phase(g, 0.84, 1));

    const z = lerp(STOW.z, OUT_Z, slide);
    const y = lower > 0 ? lerp(FLOOR_Y, 0.014, lower) : lerp(STOW.y, FLOOR_Y, rise);
    platform.current.position.set(0, y, z);

    // Lift columns run from the platform up to the box floor once the gate is out.
    const top = FLOOR_Y + 0.04;
    const h = Math.max(0.001, top - y);
    for (const arm of [armL.current, armR.current]) {
      arm.visible = slide > 0.95;
      arm.scale.y = h;
      arm.position.y = y + h / 2;
      arm.position.z = z + 0.2;
    }

    // Pallet: rolls out of the box onto the platform, rides it down, then leaves on the jack.
    const p = pallet.current;
    p.visible = load > 0.001;
    const onPlatformZ = lerp(-1.12, z - 0.02, load);
    p.position.set(lerp(0, -0.34, off), y + 0.012, lerp(onPlatformZ, -2.28, off));
    const j = jack.current;
    j.visible = off > 0.001;
    j.position.set(p.position.x, 0, p.position.z - 0.2);
  });

  return (
    <group>
      <group ref={platform}>
        <mesh material={mats.plate}>
          <boxGeometry args={[0.86, 0.022, 0.46]} />
        </mesh>
        {/* raised lip at the outer edge */}
        <mesh material={mats.plate} position={[0, 0.02, -0.225]}>
          <boxGeometry args={[0.86, 0.035, 0.012]} />
        </mesh>
      </group>
      <mesh ref={armL} material={mats.arm} position={[0.4, 0.3, OUT_Z]}>
        <boxGeometry args={[0.045, 1, 0.05]} />
      </mesh>
      <mesh ref={armR} material={mats.arm} position={[-0.4, 0.3, OUT_Z]}>
        <boxGeometry args={[0.045, 1, 0.05]} />
      </mesh>

      <group ref={pallet}>
        <mesh material={mats.wood} position={[0, 0.024, 0]}>
          <boxGeometry args={[0.34, 0.045, 0.27]} />
        </mesh>
        <mesh material={mats.wrap} position={[0, 0.17, 0]}>
          <boxGeometry args={[0.31, 0.25, 0.25]} />
        </mesh>
        <mesh material={mats.band} position={[0, 0.17, 0]}>
          <boxGeometry args={[0.318, 0.028, 0.258]} />
        </mesh>
      </group>

      <group ref={jack}>
        <mesh material={mats.jack} position={[0, 0.07, 0]}>
          <boxGeometry args={[0.12, 0.09, 0.08]} />
        </mesh>
        <mesh material={mats.steel} position={[0, 0.22, -0.07]} rotation={[-0.45, 0, 0]}>
          <cylinderGeometry args={[0.009, 0.009, 0.34, 8]} />
        </mesh>
        <mesh material={mats.steel} position={[0, 0.37, -0.145]}>
          <boxGeometry args={[0.1, 0.018, 0.018]} />
        </mesh>
      </group>
    </group>
  );
}
