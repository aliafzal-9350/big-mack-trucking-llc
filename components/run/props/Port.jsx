'use client';

import { useLayoutEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { run } from '@/lib/runStore';
import { ROAD, STOPS } from '@/lib/path';
import { CONTAINER_COLORS } from '@/lib/palette';
import { themedMaterial } from '../themed';
import { gateSignTexture, glowTexture, hazardTexture, ribTexture, stencilTexture } from '../textures';
import { placement, seeded, standard } from './shared';
import Merge from './Merge';

const C_W = 0.87; // 8 ft
const C_H = 0.93; // 8.5 ft
const C_L = 4.36; // 40 ft

function containerLayout(density) {
  const rand = seeded(1398475);
  const out = [];
  const rows = [
    ...[0, 1, 2].map((r) => ({ lateral: ROAD.center + ROAD.halfWidth + 2.6 + r * (C_W + 0.12), maxLevels: 2 + r })),
    ...[0, 1, 2].map((r) => ({ lateral: ROAD.center - ROAD.halfWidth - 3.2 - r * (C_W + 0.12), maxLevels: 2 + r })),
  ];
  for (const row of rows) {
    for (let d = STOPS.portFrom; d < STOPS.portTo; d += C_L + 0.25) {
      // Open apron around the gate: no stacks within 12 units, and the first row stays back.
      if (Math.abs(d + C_L / 2 - STOPS.port) < 12) continue;
      if (rand() > density) continue;
      const levels = 1 + Math.floor(rand() * row.maxLevels);
      for (let level = 0; level < levels; level++) {
        out.push({
          d: d + C_L / 2,
          lateral: row.lateral,
          y: C_H / 2 + level * C_H,
          color: CONTAINER_COLORS[Math.floor(rand() * CONTAINER_COLORS.length)],
        });
      }
    }
  }
  return out;
}

export function Containers({ density = 1 }) {
  const mesh = useRef();
  const layout = useMemo(() => containerLayout(0.92 * density), [density]);
  const material = useMemo(() => {
    const ribs = ribTexture().clone();
    ribs.repeat.set(7, 1);
    ribs.needsUpdate = true;
    return standard({ color: '#ffffff', roughness: 0.62, metalness: 0.35, bumpMap: ribs, bumpScale: 2.2 });
  }, []);

  useLayoutEffect(() => {
    const o = new THREE.Object3D();
    const color = new THREE.Color();
    layout.forEach((c, i) => {
      const { position, rotation } = placement(c.d, c.lateral, c.y);
      o.position.fromArray(position);
      o.rotation.fromArray(rotation);
      o.scale.set(C_W, C_H, C_L);
      o.updateMatrix();
      mesh.current.setMatrixAt(i, o.matrix);
      mesh.current.setColorAt(i, color.set(c.color));
    });
    mesh.current.instanceMatrix.needsUpdate = true;
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true;
    mesh.current.computeBoundingSphere();
  }, [layout]);

  return (
    <instancedMesh ref={mesh} args={[undefined, material, layout.length]}>
      <boxGeometry args={[1, 1, 1]} />
    </instancedMesh>
  );
}

// Ship-to-shore gantry cranes: the silhouette that says "port" from a mile away.
function Crane({ d, lateral, mats }) {
  const legs = [[-1.7, -1.6], [-1.7, 1.6], [1.7, -1.6], [1.7, 1.6]];
  const warn = useRef();
  useFrame(({ clock }) => {
    if (warn.current) warn.current.visible = Math.sin(clock.elapsedTime * 2.2 + d) > -0.2;
  });
  return (
    <group {...placement(d, lateral)}>
      {legs.map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x, 4.6, z]} material={mats.crane}>
          <boxGeometry args={[0.3, 9.2, 0.3]} />
        </mesh>
      ))}
      {[-1.6, 1.6].map((z) => (
        <mesh key={z} position={[0, 8.9, z]} material={mats.crane}>
          <boxGeometry args={[3.8, 0.4, 0.34]} />
        </mesh>
      ))}
      {[-1.7, 1.7].map((x) => (
        <mesh key={x} position={[x, 2.4, 0]} material={mats.crane}>
          <boxGeometry args={[0.24, 0.3, 3.5]} />
        </mesh>
      ))}
      {/* boom, reaching out over the water (away from the road) */}
      <mesh position={[8, 9.6, 0]} material={mats.crane}>
        <boxGeometry args={[23, 0.55, 1.1]} />
      </mesh>
      <mesh position={[0.4, 10.4, 0]} material={mats.house}>
        <boxGeometry args={[2.6, 1.1, 1.6]} />
      </mesh>
      {/* A-frame */}
      <mesh position={[-0.8, 12.1, 0]} rotation={[0, 0, -0.38]} material={mats.crane}>
        <boxGeometry args={[0.22, 5, 0.22]} />
      </mesh>
      <mesh position={[1.1, 12.1, 0]} rotation={[0, 0, 0.3]} material={mats.crane}>
        <boxGeometry args={[0.22, 5, 0.22]} />
      </mesh>
      <group ref={warn} position={[0.2, 14.5, 0]} userData={{ dynamic: true }}>
        <mesh material={mats.warn}>
          <sphereGeometry args={[0.12, 12, 8]} />
        </mesh>
        <sprite material={mats.warnGlow} scale={[1.6, 1.6, 1]} />
      </group>
    </group>
  );
}

export function Cranes() {
  const mats = useMemo(
    () => ({
      crane: themedMaterial(standard({ color: '#7a2a2a', roughness: 0.7, metalness: 0.3 }), {}),
      house: standard({ color: '#b9b4bf', roughness: 0.7 }),
      warn: standard({ color: '#300', emissive: new THREE.Color('#ff2a1a'), emissiveIntensity: 5 }),
      warnGlow: new THREE.SpriteMaterial({
        map: glowTexture(),
        color: new THREE.Color('#ff3a24').multiplyScalar(1.5),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        toneMapped: false,
      }),
    }),
    [],
  );
  return (
    <Merge>
      <Crane d={STOPS.port - 12} lateral={14} mats={mats} />
      <Crane d={STOPS.port + 10} lateral={14} mats={mats} />
      <Crane d={STOPS.port + 30} lateral={15} mats={mats} />
    </Merge>
  );
}

const scannerVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const scannerFragment = /* glsl */ `
  uniform float uTime;
  uniform float uActive;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float lines = smoothstep(0.7, 1.0, fract(vUv.y * 38.0 - uTime * 1.6));
    float sweepD = (vUv.y - fract(uTime * 0.45)) * 9.0;
    float sweep = exp(-sweepD * sweepD);
    float edges = (1.0 - smoothstep(0.0, 0.1, vUv.x)) + smoothstep(0.9, 1.0, vUv.x);
    float a = (0.05 + lines * 0.12 + sweep * 0.35 + edges * 0.4) * (0.35 + uActive * 1.4);
    gl_FragColor = vec4(uColor * a, 1.0);
    #include <colorspace_fragment>
  }
`;

// The TWIC gate at Port Newark: portal, header sign, barrier arm, scanner curtain, guard booth.
export function Gate() {
  const barrier = useRef();
  const scanner = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uActive: { value: 0 }, uColor: { value: new THREE.Color('#b99cf0') } },
        vertexShader: scannerVertex,
        fragmentShader: scannerFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [],
  );
  const mats = useMemo(() => {
    const hazard = hazardTexture().clone();
    hazard.repeat.set(3, 1);
    hazard.needsUpdate = true;
    return {
      steel: themedMaterial(standard({ roughness: 0.5, metalness: 0.6 }), { color: 'wallTrim' }),
      hazard: standard({ map: hazard, roughness: 0.7 }),
      armWhite: standard({ color: '#f1eef5', roughness: 0.5 }),
      armRed: standard({ color: '#c3202a', roughness: 0.5 }),
      downlight: themedMaterial(standard({ color: '#111', emissive: new THREE.Color('#f3eeff') }), { emissive: [0.3, 3] }),
      booth: themedMaterial(standard({ roughness: 0.8 }), { color: 'wall' }),
      window: themedMaterial(standard({ color: '#000', emissive: new THREE.Color('#ffd7a3') }), { emissive: [0.3, 1.6] }),
    };
  }, []);
  const sign = useMemo(() => gateSignTexture(), []);
  const twic = useMemo(() => stencilTexture('TWIC ONLY', { width: 1024, height: 256, size: 190 }), []);

  const left = ROAD.center + ROAD.halfWidth + 0.35;
  const right = ROAD.center - ROAD.halfWidth - 0.35;

  useFrame(({ clock }) => {
    const d = run.d;
    const smooth = THREE.MathUtils.smoothstep;
    // Arm lifts as the truck rolls up, drops again once it has cleared.
    const open = smooth(d, STOPS.port - 7.5, STOPS.port - 3.8) * (1 - smooth(d, STOPS.port + 3.4, STOPS.port + 6));
    barrier.current.rotation.z = open * Math.PI * 0.47;
    // Scanner curtain flares while the truck body is passing through it.
    const front = d + 1.44;
    const rear = d - 1.36;
    const inside = front > STOPS.port && rear < STOPS.port ? 1 : 0;
    scanner.uniforms.uActive.value += (inside - scanner.uniforms.uActive.value) * 0.12;
    scanner.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <Merge>
      <group {...placement(STOPS.port)}>
        {[left, right].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh position={[0, 1.35, 0]} material={mats.steel}>
              <boxGeometry args={[0.22, 2.7, 0.22]} />
            </mesh>
            <mesh position={[0, 0.16, 0]} material={mats.hazard}>
              <boxGeometry args={[0.5, 0.32, 1.4]} />
            </mesh>
          </group>
        ))}
        <mesh position={[(left + right) / 2, 2.62, 0]} material={mats.steel}>
          <boxGeometry args={[left - right + 0.3, 0.48, 0.34]} />
        </mesh>
        <mesh position={[(left + right) / 2, 2.62, -0.176]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[2.6, 0.65]} />
          <meshStandardMaterial map={sign} emissive="#ffffff" emissiveMap={sign} emissiveIntensity={0.35} roughness={0.6} />
        </mesh>
        <mesh position={[0, 2.36, 0]} material={mats.downlight}>
          <boxGeometry args={[1.4, 0.03, 0.12]} />
        </mesh>

        {/* scanner curtain across the truck's lane */}
        <mesh position={[0, 1.15, 0]} material={scanner} renderOrder={8}>
          <planeGeometry args={[1.5, 2.3]} />
        </mesh>

        {/* barrier arm, hinged on the right-hand island */}
        <group ref={barrier} position={[right + 0.18, 0.86, -1.0]} userData={{ dynamic: true }}>
          {Array.from({ length: 6 }, (_, i) => (
            <mesh key={i} position={[0.15 + i * 0.3, 0, 0]} material={i % 2 ? mats.armRed : mats.armWhite}>
              <boxGeometry args={[0.3, 0.06, 0.06]} />
            </mesh>
          ))}
        </group>

        {/* guard booth */}
        <group position={[right - 0.9, 0, -2.4]}>
          <mesh position={[0, 0.65, 0]} material={mats.booth}>
            <boxGeometry args={[1, 1.3, 1.3]} />
          </mesh>
          <mesh position={[0, 1.34, 0]} material={mats.steel}>
            <boxGeometry args={[1.25, 0.08, 1.55]} />
          </mesh>
          <mesh position={[0.505, 0.85, 0]} rotation={[0, Math.PI / 2, 0]} material={mats.window}>
            <planeGeometry args={[0.95, 0.45]} />
          </mesh>
        </group>

        <mesh position={[0, 0.006, -5]} rotation={[-Math.PI / 2, 0, Math.PI]}>
          <planeGeometry args={[1.2, 0.3]} />
          <meshBasicMaterial map={twic} color="#f1ebfa" transparent opacity={0.75} depthWrite={false} />
        </mesh>
      </group>
    </Merge>
  );
}
