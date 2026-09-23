'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ROAD, STOPS } from '@/lib/path';
import { themedMaterial } from '../themed';
import { glowTexture, guideSignTexture } from '../textures';
import { placement, standard } from './shared';
import Merge from './Merge';

const POLE_H = 2.95;
const REACH = 0.72; // arm length out over the road

function lampLayout(step) {
  const lamps = [];
  for (let d = STOPS.lampsFrom; d <= STOPS.lampsTo; d += 12 * step) {
    lamps.push({ d, lateral: ROAD.center + ROAD.halfWidth + 0.55, toward: -1 });
    lamps.push({ d: d + 0.01, lateral: ROAD.center - ROAD.halfWidth - 0.55, toward: 1 });
  }
  return lamps;
}

// Sodium streetlights on both shoulders: 3 instanced meshes + one additive point cloud of glows.
export function Streetlights({ step = 1 }) {
  const lamps = useMemo(() => lampLayout(step), [step]);
  const poles = useRef();
  const arms = useRef();
  const heads = useRef();

  const mats = useMemo(
    () => ({
      pole: themedMaterial(standard({ roughness: 0.6, metalness: 0.6 }), { color: 'wallTrim' }),
      head: themedMaterial(standard({ color: '#1b1a1e', emissive: new THREE.Color('#ffa54a') }), { emissive: [0, 7], sodium: true }),
      glow: themedMaterial(
        new THREE.PointsMaterial({
          map: glowTexture(),
          size: 2.2,
          sizeAttenuation: true,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          color: new THREE.Color('#ffa54a'),
          toneMapped: false,
        }),
        { emissive: [0, 1], sodium: true },
      ),
    }),
    [],
  );

  const glowGeometry = useMemo(() => {
    const positions = [];
    const g = new THREE.Object3D();
    for (const lamp of lamps) {
      const { position, rotation } = placement(lamp.d, lamp.lateral);
      g.position.fromArray(position);
      g.rotation.fromArray(rotation);
      g.updateMatrix();
      const head = new THREE.Vector3(lamp.toward * REACH, POLE_H - 0.1, 0).applyMatrix4(g.matrix);
      positions.push(head.x, head.y, head.z);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geometry;
  }, [lamps]);

  useLayoutEffect(() => {
    const base = new THREE.Object3D();
    const part = new THREE.Object3D();
    lamps.forEach((lamp, i) => {
      const { position, rotation } = placement(lamp.d, lamp.lateral);
      base.position.fromArray(position);
      base.rotation.fromArray(rotation);
      base.updateMatrix();

      part.position.set(0, POLE_H / 2, 0);
      part.updateMatrix();
      poles.current.setMatrixAt(i, base.matrix.clone().multiply(part.matrix));

      part.position.set((lamp.toward * REACH) / 2, POLE_H, 0);
      part.updateMatrix();
      arms.current.setMatrixAt(i, base.matrix.clone().multiply(part.matrix));

      part.position.set(lamp.toward * REACH, POLE_H - 0.04, 0);
      part.updateMatrix();
      heads.current.setMatrixAt(i, base.matrix.clone().multiply(part.matrix));
    });
    for (const mesh of [poles.current, arms.current, heads.current]) {
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    }
  }, [lamps]);

  return (
    <group>
      <instancedMesh ref={poles} args={[undefined, mats.pole, lamps.length]}>
        <cylinderGeometry args={[0.028, 0.04, POLE_H, 8]} />
      </instancedMesh>
      <instancedMesh ref={arms} args={[undefined, mats.pole, lamps.length]}>
        <boxGeometry args={[REACH, 0.03, 0.03]} />
      </instancedMesh>
      <instancedMesh ref={heads} args={[undefined, mats.head, lamps.length]}>
        <boxGeometry args={[0.3, 0.045, 0.12]} />
      </instancedMesh>
      <points geometry={glowGeometry} material={mats.glow} renderOrder={4} />
    </group>
  );
}

const GANTRIES = [
  { d: STOPS.gantry[0], sign: { shield: '278', title: 'Verrazzano Br', subtitle: 'Staten Island', foot: 'WEST' } },
  { d: STOPS.gantry[1], sign: { shield: '278', title: 'Goethals Br', subtitle: 'New Jersey', foot: 'WEST' } },
];

// Overhead guide signs over the road, facing oncoming traffic (the truck).
export function Gantries() {
  const mats = useMemo(
    () => ({
      steel: themedMaterial(standard({ roughness: 0.55, metalness: 0.7 }), { color: 'wallTrim' }),
      light: themedMaterial(standard({ color: '#111', emissive: new THREE.Color('#f5f0ff') }), { emissive: [0, 2.5] }),
    }),
    [],
  );
  const left = ROAD.center + ROAD.halfWidth + 0.45;
  const right = ROAD.center - ROAD.halfWidth - 0.45;
  const span = left - right;
  return (
    <Merge>
      {GANTRIES.map(({ d, sign }) => (
        <group key={d} {...placement(d)}>
          {[left, right].map((x) => (
            <mesh key={x} position={[x, 1.5, 0]} material={mats.steel}>
              <boxGeometry args={[0.12, 3, 0.12]} />
            </mesh>
          ))}
          <mesh position={[(left + right) / 2, 2.9, 0]} material={mats.steel}>
            <boxGeometry args={[span, 0.14, 0.14]} />
          </mesh>
          <mesh position={[(left + right) / 2, 2.62, 0]} material={mats.steel}>
            <boxGeometry args={[span, 0.06, 0.06]} />
          </mesh>
          <mesh position={[0.1, 2.72, -0.08]} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[1.9, 0.742]} />
            <meshStandardMaterial map={guideSignTexture(`g${d}`, sign)} roughness={0.5} emissive="#ffffff" emissiveMap={guideSignTexture(`g${d}`, sign)} emissiveIntensity={0.18} />
          </mesh>
          <mesh position={[0.1, 2.3, -0.2]} material={mats.light}>
            <boxGeometry args={[1.4, 0.03, 0.05]} />
          </mesh>
        </group>
      ))}
    </Merge>
  );
}
