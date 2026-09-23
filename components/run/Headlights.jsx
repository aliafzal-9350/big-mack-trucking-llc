'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { run } from '@/lib/runStore';
import { glowTexture } from './textures';

// Low-beam lamp centers (truck-local).
export const HEADLAMPS = [
  [0.338, 0.448, 1.372],
  [-0.338, 0.448, 1.372],
];
const BEAM_LENGTH = 3.4;
const DIP = 0.07; // radians the beams aim below horizontal

const beamVertex = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewW;
  void main() {
    vUv = uv;
    vec4 world = modelMatrix * vec4(position, 1.0);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vViewW = normalize(cameraPosition - world.xyz);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;
const beamFragment = /* glsl */ `
  uniform float uIntensity;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vViewW;
  void main() {
    float facing = abs(dot(normalize(vNormalW), vViewW));
    float along = pow(vUv.y, 2.4);
    // side-on the beam reads as a shaft of light; head-on it would just fog the lens
    float a = along * facing * (1.0 - facing * 0.65) * uIntensity * 2.2;
    gl_FragColor = vec4(uColor * a, 1.0);
    #include <colorspace_fragment>
  }
`;

const smooth = (e0, e1, x) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

// Soft volumetric beams + lens glints. Only really visible on the night shift.
export default function Headlights() {
  const beamMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uIntensity: { value: 0 }, uColor: { value: new THREE.Color('#fff0d8') } },
        vertexShader: beamVertex,
        fragmentShader: beamFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        toneMapped: false,
      }),
    [],
  );
  const glintMaterial = useMemo(
    () =>
      new THREE.SpriteMaterial({
        map: glowTexture(),
        color: new THREE.Color('#fff3df').multiplyScalar(2.2),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        transparent: true,
        toneMapped: false,
      }),
    [],
  );

  useFrame(() => {
    const intro = run.stage === 'ready' ? 1 : run.intro;
    const on = (run.stage === 'fallback' ? 1 : smooth(0.34, 0.4, intro)) * run.night;
    beamMaterial.uniforms.uIntensity.value = on * 0.075;
    glintMaterial.opacity = on;
  });

  const axis = new THREE.Vector3(0, -Math.sin(DIP), Math.cos(DIP));
  return (
    <group>
      {HEADLAMPS.map((p, i) => (
        <group key={i} position={p}>
          <mesh
            material={beamMaterial}
            position={axis.clone().multiplyScalar(BEAM_LENGTH / 2).toArray()}
            rotation={[-Math.PI / 2 + DIP, 0, 0]}
            renderOrder={5}
          >
            <coneGeometry args={[0.62, BEAM_LENGTH, 28, 1, true]} />
          </mesh>
          <sprite material={glintMaterial} scale={[0.3, 0.3, 1]} position={[0, 0, 0.02]} renderOrder={6} />
        </group>
      ))}
    </group>
  );
}
