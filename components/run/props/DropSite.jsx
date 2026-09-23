'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { ROAD, STOPS } from '@/lib/path';
import { themedMaterial } from '../themed';
import { glowTexture, slatTexture, storeSignTexture } from '../textures';
import { placement, standard } from './shared';
import Merge from './Merge';

// The final drop: a storefront with no loading dock, on the truck's right (curb) side.
const CURB = ROAD.center - ROAD.halfWidth; // right edge of the road
const WALK = 2.6; // sidewalk width
const FRONT = CURB - WALK; // building face

export default function DropSite() {
  const mats = useMemo(() => {
    const slats = slatTexture().clone();
    slats.repeat.set(1, 7);
    slats.needsUpdate = true;
    return {
      walk: themedMaterial(standard({ roughness: 0.95 }), { color: 'wallTrim' }),
      wall: themedMaterial(standard({ roughness: 0.9 }), { color: 'wall' }),
      trim: themedMaterial(standard({ roughness: 0.7, metalness: 0.2 }), { color: 'wallTrim' }),
      door: themedMaterial(standard({ roughness: 0.5, metalness: 0.5, bumpMap: slats, bumpScale: 1.2 }), { color: 'wallTrim' }),
      window: themedMaterial(standard({ color: '#000', emissive: new THREE.Color('#ffcf98') }), { emissive: [0.25, 1.5] }),
      mullion: standard({ color: '#141218', roughness: 0.6 }),
      bollard: standard({ color: '#e8b62c', roughness: 0.5 }),
      lamp: themedMaterial(standard({ color: '#151515', emissive: new THREE.Color('#ffa54a') }), { emissive: [0, 6], sodium: true }),
      glow: themedMaterial(
        new THREE.SpriteMaterial({
          map: glowTexture(),
          color: new THREE.Color('#ffa54a'),
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
          toneMapped: false,
        }),
        { emissive: [0, 1], sodium: true },
      ),
    };
  }, []);
  const sign = useMemo(() => storeSignTexture(), []);

  // Everything below is in the frame of the truck's parking spot at the drop.
  return (
    <Merge>
      <group {...placement(STOPS.drop)}>
        <mesh position={[CURB - WALK / 2, 0.035, 0]} material={mats.walk}>
          <boxGeometry args={[WALK, 0.07, 26]} />
        </mesh>
        <mesh position={[FRONT - 1.8, 1.7, 0]} material={mats.wall}>
          <boxGeometry args={[3.6, 3.4, 22]} />
        </mesh>
        <mesh position={[FRONT + 0.04, 3.3, 0]} material={mats.trim}>
          <boxGeometry args={[0.1, 0.2, 22]} />
        </mesh>

        {/* storefront window ahead of the truck's cab */}
        <group position={[FRONT + 0.01, 0, 4.6]}>
          <mesh position={[0, 1.15, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.window}>
            <planeGeometry args={[4.4, 1.6]} />
          </mesh>
          {[-2.2, -1.1, 0, 1.1, 2.2].map((z) => (
            <mesh key={z} position={[0.02, 1.15, z]} material={mats.mullion}>
              <boxGeometry args={[0.04, 1.64, 0.06]} />
            </mesh>
          ))}
          <mesh position={[0.02, 1.97, 0]} material={mats.mullion}>
            <boxGeometry args={[0.04, 0.06, 4.46]} />
          </mesh>
        </group>

        {/* receiving door behind the truck, where the pallet is headed */}
        <group position={[FRONT + 0.012, 0, -2.4]}>
          <mesh position={[0, 1.02, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.door}>
            <planeGeometry args={[2.1, 1.9]} />
          </mesh>
          <mesh position={[0.01, 2.3, 0]} rotation={[0, Math.PI / 2, 0]}>
            <planeGeometry args={[1.9, 0.37]} />
            <meshStandardMaterial map={sign} emissive="#ffffff" emissiveMap={sign} emissiveIntensity={0.25} roughness={0.6} />
          </mesh>
          <mesh position={[0.08, 2.72, 0]} material={mats.lamp}>
            <boxGeometry args={[0.1, 0.1, 0.2]} />
          </mesh>
          <sprite material={mats.glow} position={[0.22, 2.66, 0]} scale={[1.4, 1.4, 1]} />
        </group>

        {[1.4, 2.8, 6.8].map((z) => (
          <mesh key={z} position={[CURB - 0.3, 0.3, z]} material={mats.bollard}>
            <cylinderGeometry args={[0.05, 0.05, 0.46, 12]} />
          </mesh>
        ))}
      </group>
    </Merge>
  );
}
