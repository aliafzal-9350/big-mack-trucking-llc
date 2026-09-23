'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useRun } from '@/lib/runStore';
import { TIERS } from '@/lib/quality';
import { themedMaterial } from '../themed';
import { hazardTexture, slatTexture, stencilTexture } from '../textures';
import { standard } from './shared';
import Merge from './Merge';

// JFK air-cargo warehouse the truck is backed into at d = 0. The path runs along +z here,
// so local coordinates are world coordinates: +x is the truck's left, the wall is behind it.
const FACE = -1.52; // building face (just behind the truck's rear bumper)
const DOCK_H = 0.37; // dock floor height = truck floor height
const DOOR_W = 1.1;
const DOOR_TOP = 1.46;
const HEIGHT = 3.2;
const DEPTH = 2.1; // depth of the front bay the open door looks into
const BAYS = [
  { x: 4.4, label: '05' },
  { x: 2.2, label: '06' },
  { x: 0, label: '07', open: true },
  { x: -2.2, label: '08' },
  { x: -4.4, label: '09' },
];

function Box({ size, position, material, ...rest }) {
  return (
    <mesh position={position} material={material} {...rest}>
      <boxGeometry args={size} />
    </mesh>
  );
}

export default function Dock() {
  const pointLights = useRun((r) => TIERS[r.tier].pointLights);
  const mats = useMemo(() => {
    const slats = slatTexture().clone();
    slats.repeat.set(1, 5);
    slats.needsUpdate = true;
    const hazard = hazardTexture().clone();
    hazard.repeat.set(36, 1);
    hazard.needsUpdate = true;
    return {
      wall: themedMaterial(standard({ roughness: 0.93, metalness: 0.04 }), { color: 'wall' }),
      trim: themedMaterial(standard({ roughness: 0.8, metalness: 0.1 }), { color: 'wallTrim' }),
      door: themedMaterial(standard({ roughness: 0.55, metalness: 0.45, bumpMap: slats, bumpScale: 1.4 }), { color: 'wallTrim' }),
      pad: standard({ color: '#17151c', roughness: 0.96 }),
      rubber: standard({ color: '#0e0d11', roughness: 0.9 }),
      hazard: standard({ map: hazard, roughness: 0.7 }),
      floor: standard({ color: '#3b3440', roughness: 0.85 }),
      glow: themedMaterial(standard({ color: '#000000', emissive: new THREE.Color('#ffc58a') }), { emissive: [0.45, 1.25] }),
      carton: standard({ color: '#b08a5c', roughness: 0.85 }),
      wrap: standard({ color: '#d9d2e4', roughness: 0.5 }),
      lamp: themedMaterial(standard({ color: '#1a1a1a', emissive: new THREE.Color('#ffa54a') }), { emissive: [0, 2.4], sodium: true }),
      dockLamp: themedMaterial(standard({ color: '#222', emissive: new THREE.Color('#fff4e2') }), { emissive: [0.15, 1.1] }),
      yellow: new THREE.MeshBasicMaterial({ color: '#d9a531', transparent: true, opacity: 0.55 }),
    };
  }, []);

  const numbers = useMemo(
    () => Object.fromEntries(BAYS.map((b) => [b.label, stencilTexture(b.label, { width: 256, height: 128, size: 118 })])),
    [],
  );

  const back = FACE - DEPTH;
  const sideW = 9 - DOOR_W / 2;

  return (
    <Merge>
      {/* main block behind the loading bays */}
      <Box size={[18, HEIGHT, 4]} position={[0, HEIGHT / 2, back - 2]} material={mats.wall} />
      {/* front bay, built around the open door of bay 07 */}
      <Box size={[sideW, HEIGHT, DEPTH]} position={[DOOR_W / 2 + sideW / 2, HEIGHT / 2, FACE - DEPTH / 2]} material={mats.wall} />
      <Box size={[sideW, HEIGHT, DEPTH]} position={[-DOOR_W / 2 - sideW / 2, HEIGHT / 2, FACE - DEPTH / 2]} material={mats.wall} />
      <Box size={[DOOR_W, HEIGHT - DOOR_TOP, DEPTH]} position={[0, (HEIGHT + DOOR_TOP) / 2, FACE - DEPTH / 2]} material={mats.wall} />
      <Box size={[DOOR_W, DOCK_H, DEPTH]} position={[0, DOCK_H / 2, FACE - DEPTH / 2]} material={mats.floor} />
      {/* parapet */}
      <Box size={[18.2, 0.12, 0.2]} position={[0, HEIGHT + 0.06, FACE - 0.08]} material={mats.trim} />
      {/* painted curb band */}
      <Box size={[18, 0.12, 0.02]} position={[0, 0.06, FACE + 0.011]} material={mats.hazard} />

      {/* inside bay 07: warm light, staged freight */}
      <mesh position={[0, (DOCK_H + DOOR_TOP) / 2, back + 0.01]} material={mats.glow}>
        <planeGeometry args={[DOOR_W, DOOR_TOP - DOCK_H]} />
      </mesh>
      <group position={[0.22, DOCK_H, back + 0.55]}>
        <Box size={[0.34, 0.045, 0.27]} position={[0, 0.022, 0]} material={mats.carton} />
        <Box size={[0.31, 0.3, 0.25]} position={[0, 0.2, 0]} material={mats.wrap} />
      </group>
      <group position={[-0.2, DOCK_H, back + 0.95]}>
        <Box size={[0.34, 0.045, 0.27]} position={[0, 0.022, 0]} material={mats.carton} />
        <Box size={[0.31, 0.24, 0.25]} position={[0, 0.17, 0]} material={mats.carton} />
      </group>
      {pointLights ? <pointLight position={[0, 1.05, FACE - 0.6]} color="#ffc88a" intensity={2.2} distance={4.5} decay={2} /> : null}

      {BAYS.map((bay) => (
        <group key={bay.label} position={[bay.x, 0, FACE]}>
          {!bay.open && (
            <mesh position={[0, (DOCK_H + DOOR_TOP) / 2, 0.012]} material={mats.door}>
              <planeGeometry args={[DOOR_W, DOOR_TOP - DOCK_H]} />
            </mesh>
          )}
          {/* dock seal pads */}
          <Box size={[DOOR_W + 0.3, 0.14, 0.16]} position={[0, DOOR_TOP + 0.07, 0.08]} material={mats.pad} />
          <Box size={[0.14, DOOR_TOP - DOCK_H + 0.14, 0.16]} position={[DOOR_W / 2 + 0.08, (DOCK_H + DOOR_TOP) / 2, 0.08]} material={mats.pad} />
          <Box size={[0.14, DOOR_TOP - DOCK_H + 0.14, 0.16]} position={[-DOOR_W / 2 - 0.08, (DOCK_H + DOOR_TOP) / 2, 0.08]} material={mats.pad} />
          {/* bumpers */}
          <Box size={[0.12, 0.2, 0.1]} position={[0.4, 0.24, 0.05]} material={mats.rubber} />
          <Box size={[0.12, 0.2, 0.1]} position={[-0.4, 0.24, 0.05]} material={mats.rubber} />
          {/* wall pack light + bay number */}
          <Box size={[0.14, 0.05, 0.08]} position={[0, 2.02, 0.04]} material={mats.lamp} />
          <mesh position={[0, 2.5, 0.006]}>
            <planeGeometry args={[0.62, 0.31]} />
            <meshBasicMaterial map={numbers[bay.label]} color="#efe9f7" transparent opacity={0.5} depthWrite={false} />
          </mesh>
          {/* painted guide lines for the bay in use */}
          {bay.open
            ? [-0.64, 0.64].map((x) => (
                <mesh key={x} position={[x, 0.004, 1.3]} rotation={[-Math.PI / 2, 0, 0]} material={mats.yellow}>
                  <planeGeometry args={[0.04, 2.6]} />
                </mesh>
              ))
            : null}
        </group>
      ))}

      {/* swing-arm dock light aimed into the truck */}
      <group position={[-0.95, 1.55, FACE + 0.08]}>
        <Box size={[0.03, 0.03, 0.42]} position={[0, 0, 0.21]} material={mats.rubber} />
        <Box size={[0.1, 0.1, 0.08]} position={[0, -0.02, 0.44]} material={mats.dockLamp} />
      </group>

    </Merge>
  );
}
