'use client';

import { useEffect, useMemo, useState } from 'react';
import { run } from '@/lib/runStore';
import * as THREE from 'three';
import { applyXrayCut } from './xray';
import { prepareLivery } from './textures';

// Box-side lettering (both sides) and the rear roll-up door, drawn once fonts are ready.
// Box side panel: x = +/-0.439, y 0.39..1.04, z -1.28..0.48 (truck-local units).
export default function Livery() {
  const [textures, setTextures] = useState(null);

  useEffect(() => {
    let alive = true;
    prepareLivery()
      .then((t) => alive && setTextures(t))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const materials = useMemo(() => {
    if (!textures) return null;
    const make = (map) =>
      applyXrayCut(
        new THREE.MeshStandardMaterial({
          map,
          transparent: true,
          depthWrite: false,
          roughness: 0.35,
          metalness: 0.1,
          polygonOffset: true,
          polygonOffsetFactor: -2,
        }),
      );
    return { left: make(textures.left), right: make(textures.right), rear: make(textures.rear) };
  }, [textures]);

  useEffect(() => {
    if (materials) run.liveryReady = true;
  }, [materials]);

  if (!materials) return null;
  return (
    <group>
      <mesh position={[0.4436, 0.715, -0.402]} rotation={[0, Math.PI / 2, 0]} material={materials.left}>
        <planeGeometry args={[1.64, 0.593]} />
      </mesh>
      <mesh position={[-0.4436, 0.715, -0.402]} rotation={[0, -Math.PI / 2, 0]} material={materials.right}>
        <planeGeometry args={[1.64, 0.593]} />
      </mesh>
      <mesh position={[0, 0.74, -1.3165]} rotation={[0, Math.PI, 0]} material={materials.rear}>
        <planeGeometry args={[0.66, 0.477]} />
      </mesh>
    </group>
  );
}
