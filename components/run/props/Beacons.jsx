'use client';

import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { run } from '@/lib/runStore';
import { WAYPOINTS } from '@/lib/timeline';
import { placement } from './shared';

// Tracking-map layer: a light pillar and a pulsing ring at every named waypoint, plus the
// projection that pins the HTML waypoint labels (see components/hud/MapLabels.jsx) onto them.
const pillarVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const pillarFragment = /* glsl */ `
  uniform float uAmount;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    float a = pow(1.0 - vUv.y, 1.6) * uAmount * 0.9;
    gl_FragColor = vec4(uColor * a, 1.0);
    #include <colorspace_fragment>
  }
`;
const ringFragment = /* glsl */ `
  uniform float uAmount;
  uniform float uTime;
  uniform vec3 uColor;
  varying vec2 vUv;
  void main() {
    vec2 p = vUv - 0.5;
    float r = length(p) * 2.0;
    float solid = 1.0 - smoothstep(0.3, 0.34, abs(r - 0.32) * 4.0);
    float pulse = fract(uTime * 0.6);
    float wave = (1.0 - smoothstep(0.0, 0.06, abs(r - pulse))) * (1.0 - pulse);
    float a = (solid * 0.9 + wave * 0.8) * uAmount;
    gl_FragColor = vec4(uColor * a, 1.0);
    #include <colorspace_fragment>
  }
`;

const v = new THREE.Vector3();

export default function Beacons() {
  const camera = useThree((s) => s.camera);
  const size = useThree((s) => s.size);
  const group = useRef();
  const uniforms = useMemo(
    () => ({ uAmount: { value: 0 }, uTime: { value: 0 }, uColor: { value: new THREE.Color('#ffae55').multiplyScalar(1.6) } }),
    [],
  );
  const mats = useMemo(() => {
    const base = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false };
    return {
      pillar: new THREE.ShaderMaterial({ uniforms, vertexShader: pillarVertex, fragmentShader: pillarFragment, side: THREE.DoubleSide, ...base }),
      ring: new THREE.ShaderMaterial({ uniforms, vertexShader: pillarVertex, fragmentShader: ringFragment, ...base }),
    };
  }, [uniforms]);
  const points = useMemo(() => WAYPOINTS.map((w) => ({ ...w, ...placement(w.d, 0) })), []);
  const here = useRef();

  useFrame(({ clock }) => {
    const amount = run.sample.state.map;
    uniforms.uAmount.value = amount;
    uniforms.uTime.value = clock.elapsedTime;
    group.current.visible = amount > 0.01;
    if (here.current) {
      const p = placement(run.d, 0);
      here.current.position.set(p.position[0], 0.03, p.position[2]);
      here.current.scale.setScalar(2.1 + Math.sin(clock.elapsedTime * 2.4) * 0.18);
    }

    if (amount > 0.01) {
      for (const w of points) {
        const el = run.hotspotEls?.[`wp-${w.id}`];
        if (!el) continue;
        v.set(w.position[0], 2.4, w.position[2]).project(camera);
        const x = (v.x * 0.5 + 0.5) * size.width;
        const y = (-v.y * 0.5 + 0.5) * size.height;
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        el.style.opacity = v.z < 1 ? String(Math.max(0, (amount - 0.35) / 0.65)) : '0';
        el.dataset.passed = run.d >= w.d - 0.5 ? 'yes' : 'no';
      }
    } else if (group.current.userData.wasVisible) {
      for (const w of points) {
        const el = run.hotspotEls?.[`wp-${w.id}`];
        if (el) el.style.opacity = '0';
      }
    }
    group.current.userData.wasVisible = amount > 0.01;
  }, -1);

  return (
    <group ref={group}>
      <mesh ref={here} rotation={[-Math.PI / 2, 0, 0]} material={mats.ring}>
        <planeGeometry args={[2.6, 2.6]} />
      </mesh>
      {points.map((w) => (
        <group key={w.id} position={w.position}>
          <mesh position={[0, 2.5, 0]} material={mats.pillar}>
            <cylinderGeometry args={[0.07, 0.07, 5, 10, 1, true]} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} material={mats.ring}>
            <planeGeometry args={[2.6, 2.6]} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
