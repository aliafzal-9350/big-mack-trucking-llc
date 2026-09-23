'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { run } from '@/lib/runStore';

// The load inside the box, seen through the x-ray: 12 slots of 48x40 pallets, two across,
// six deep, filled front to back. The count comes from the quote form (run.load.pallets).
const FLOOR_Y = 0.385;
const ROW_PITCH = 0.285;
const FRONT_Z = 0.44;
export const SLOTS = Array.from({ length: 12 }, (_, i) => {
  const row = Math.floor(i / 2);
  const col = i % 2;
  return [col === 0 ? 0.19 : -0.19, FRONT_Z - ROW_PITCH * (row + 0.5)];
});
const HEIGHTS = [0.27, 0.23, 0.31, 0.25, 0.21, 0.29, 0.26, 0.24, 0.3, 0.22, 0.28, 0.25];
const DOOR_Z = -1.75;

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const easeOut = (x) => 1 - Math.pow(1 - x, 3);

const m = new THREE.Matrix4();
const q = new THREE.Quaternion();
const p = new THREE.Vector3();
const s = new THREE.Vector3();

export default function LoadPlan() {
  const group = useRef();
  const bases = useRef();
  const cargo = useRef();

  const mats = useMemo(
    () => ({
      wood: new THREE.MeshStandardMaterial({ color: '#8a6a44', roughness: 0.85 }),
      wrap: new THREE.MeshStandardMaterial({
        color: '#ece6f7',
        roughness: 0.4,
        emissive: new THREE.Color('#b99cf0'),
        emissiveIntensity: 0,
      }),
    }),
    [],
  );

  useFrame(() => {
    const { xray, load } = run.sample.state;
    group.current.visible = xray > 0.01;
    if (!group.current.visible) return;
    mats.wrap.emissiveIntensity = xray * 0.55;

    const count = run.load.pallets;
    const loaded = load * count;
    for (let i = 0; i < SLOTS.length; i++) {
      const t = i < count ? easeOut(clamp01(loaded - i)) : 0;
      const [x, z] = SLOTS[i];
      const scale = t > 0.001 ? 1 : 0;
      const zz = DOOR_Z + (z - DOOR_Z) * t;

      p.set(x, FLOOR_Y + 0.022, zz);
      s.set(scale, scale, scale);
      m.compose(p, q, s);
      bases.current.setMatrixAt(i, m);

      const h = HEIGHTS[i];
      p.set(x, FLOOR_Y + 0.045 + h / 2, zz);
      s.set(scale, scale * h, scale);
      m.compose(p, q, s);
      cargo.current.setMatrixAt(i, m);
    }
    bases.current.instanceMatrix.needsUpdate = true;
    cargo.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <instancedMesh ref={bases} args={[undefined, mats.wood, SLOTS.length]} frustumCulled={false}>
        <boxGeometry args={[0.34, 0.044, 0.25]} />
      </instancedMesh>
      <instancedMesh ref={cargo} args={[undefined, mats.wrap, SLOTS.length]} frustumCulled={false}>
        <boxGeometry args={[0.31, 1, 0.23]} />
      </instancedMesh>
    </group>
  );
}
